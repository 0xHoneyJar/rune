import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TaskGraph, generateTaskId, resetTaskCounter } from './task-graph.js';
import type { Task, TaskType, TaskStatus } from '../types.js';

// Mock fs operations
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn(() => false),
}));

describe('TaskGraph', () => {
  let graph: TaskGraph;

  const createTask = (
    id: string,
    type: TaskType = 'generate',
    deps: string[] = [],
    status: TaskStatus = 'pending'
  ): Task => ({
    id,
    type,
    status,
    dependencies: deps,
    input: {},
    createdAt: new Date(),
  });

  beforeEach(async () => {
    resetTaskCounter();
    graph = new TaskGraph({
      sessionId: 'test-session',
      basePath: '/tmp/test-sessions',
      autoSave: false,
    });
    await graph.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateTaskId', () => {
    it('should generate unique task IDs', () => {
      resetTaskCounter();
      const id1 = generateTaskId('fork');
      const id2 = generateTaskId('fork');

      expect(id1).toMatch(/^fork-/);
      expect(id2).toMatch(/^fork-/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('addTask', () => {
    it('should add task to graph', async () => {
      const task = createTask('task-1');
      await graph.addTask(task);

      expect(graph.getTask('task-1')).toEqual(task);
    });

    it('should throw on circular dependency', async () => {
      const task1 = createTask('task-1', 'generate', ['task-2']);
      const task2 = createTask('task-2', 'generate', ['task-1']);

      await graph.addTask(task1);
      await expect(graph.addTask(task2)).rejects.toThrow('circular dependency');
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      await graph.addTask(createTask('task-1'));
      await graph.updateStatus('task-1', 'running');

      expect(graph.getTask('task-1')?.status).toBe('running');
    });

    it('should set completedAt for complete/failed', async () => {
      await graph.addTask(createTask('task-1'));
      await graph.updateStatus('task-1', 'complete');

      expect(graph.getTask('task-1')?.completedAt).toBeDefined();
    });

    it('should throw for unknown task', async () => {
      await expect(graph.updateStatus('unknown', 'running')).rejects.toThrow('not found');
    });
  });

  describe('setSnapshot', () => {
    it('should bind snapshot to task', async () => {
      await graph.addTask(createTask('task-1'));
      await graph.setSnapshot('task-1', 'snap-123');

      expect(graph.getTask('task-1')?.snapshotId).toBe('snap-123');
    });
  });

  describe('getTasksByStatus', () => {
    it('should filter tasks by status', async () => {
      await graph.addTask(createTask('task-1', 'generate', [], 'pending'));
      await graph.addTask(createTask('task-2', 'generate', [], 'running'));
      await graph.addTask(createTask('task-3', 'generate', [], 'pending'));

      const pending = graph.getTasksByStatus('pending');
      expect(pending).toHaveLength(2);
    });
  });

  describe('canRun', () => {
    it('should return true when all deps complete', async () => {
      const dep = createTask('dep-1', 'fork', [], 'complete');
      const task = createTask('task-1', 'generate', ['dep-1']);

      await graph.addTask(dep);
      await graph.addTask(task);

      expect(graph.canRun('task-1')).toBe(true);
    });

    it('should return false when deps not complete', async () => {
      const dep = createTask('dep-1', 'fork', [], 'running');
      const task = createTask('task-1', 'generate', ['dep-1']);

      await graph.addTask(dep);
      await graph.addTask(task);

      expect(graph.canRun('task-1')).toBe(false);
    });
  });

  describe('getNextRunnable', () => {
    it('should return next runnable task', async () => {
      const dep = createTask('dep-1', 'fork', [], 'complete');
      const task = createTask('task-1', 'generate', ['dep-1']);

      await graph.addTask(dep);
      await graph.addTask(task);

      const next = graph.getNextRunnable();
      expect(next?.id).toBe('task-1');
    });

    it('should return undefined when nothing runnable', async () => {
      const dep = createTask('dep-1', 'fork', [], 'running');
      const task = createTask('task-1', 'generate', ['dep-1']);

      await graph.addTask(dep);
      await graph.addTask(task);

      expect(graph.getNextRunnable()).toBeUndefined();
    });
  });

  describe('propagateBlocked', () => {
    it('should mark dependents as blocked', async () => {
      const task1 = createTask('task-1', 'fork', [], 'failed');
      const task2 = createTask('task-2', 'generate', ['task-1']);
      const task3 = createTask('task-3', 'validate', ['task-2']);

      await graph.addTask(task1);
      await graph.addTask(task2);
      await graph.addTask(task3);

      await graph.propagateBlocked('task-1');

      expect(graph.getTask('task-2')?.status).toBe('blocked');
      expect(graph.getTask('task-3')?.status).toBe('blocked');
    });
  });

  describe('findRecoveryPoint', () => {
    it('should find last complete task with snapshot', async () => {
      const task1 = createTask('task-1', 'fork', [], 'complete');
      task1.snapshotId = 'snap-1';

      const task2 = createTask('task-2', 'ground', ['task-1'], 'complete');
      task2.snapshotId = 'snap-2';

      const task3 = createTask('task-3', 'generate', ['task-2'], 'failed');

      await graph.addTask(task1);
      await graph.addTask(task2);
      await graph.addTask(task3);

      const recovery = graph.findRecoveryPoint('task-3');
      expect(recovery?.id).toBe('task-2');
    });
  });

  describe('hasBlocked / isComplete', () => {
    it('should detect blocked tasks', async () => {
      await graph.addTask(createTask('task-1', 'fork', [], 'blocked'));
      expect(graph.hasBlocked()).toBe(true);
    });

    it('should detect complete graph', async () => {
      await graph.addTask(createTask('task-1', 'fork', [], 'complete'));
      expect(graph.isComplete()).toBe(true);
    });
  });
});
