# Software Design Document: Sigil v1.2.4

> "See the diff. Feel the result. Learn by doing."

**Version**: 1.2.4
**Date**: 2026-01-05
**Status**: Draft
**PRD Reference**: loa-grimoire/prd.md

---

## Executive Summary

Sigil v1.2.4 is a Design Physics Framework that enables apprenticeship learning for motion physics. Engineers learn by seeing diffs and feeling results in the browser, not through lectures.

### Architecture Philosophy

1. **Recipes are the truth** — TSX components with embedded spring values
2. **Zones determine context** — Directory = zone, config cascades
3. **Workbench enables learning** — tmux + browser + A/B toggle
4. **Claude infers, humans approve** — No dictionary, trust Claude's training

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Workbench shell | tmux + browser | Native terminal, Chrome MCP for preview |
| Recipe imports | Local path alias | `@sigil/recipes` → `./sigil-mark/recipes` |
| Animation library | React + Motion | Opinionated, industry standard |
| State storage | File-based (YAML + MD) | No database, clean removal |
| Enforcement | ESLint + CI | Simple and effective |

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SIGIL v1.2.4                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         WORKBENCH LAYER                              │   │
│  │  tmux session: diff pane + browser pane + claude pane               │   │
│  │  A/B toggle: hot-swap (granular) | iframes (flows)                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         RECIPE LAYER                                 │   │
│  │  TSX components with embedded physics                                │   │
│  │  Variants: Button.tsx, Button.nintendo.tsx, Button.relaxed.tsx      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          ZONE LAYER                                  │   │
│  │  .sigilrc.yaml per directory, cascading inheritance                 │   │
│  │  Zones: decisive | machinery | glass                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ENFORCEMENT LAYER                               │   │
│  │  ESLint plugin (sigil/no-raw-physics) + CI validation               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       CLAUDE LAYER                                   │   │
│  │  Context injection via XML, history parsing, vibe inference         │   │
│  │  Skills: sigil-core | Commands: /craft /sandbox /codify /etc.       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Interaction Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CLAUDE    │────▶│    ZONE     │────▶│   RECIPE    │────▶│  WORKBENCH  │
│   CODE      │     │  RESOLVER   │     │   LOADER    │     │   A/B TEST  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  /craft request     Find .sigilrc.yaml   Import recipe      Hot-swap or
  with file path     Walk up directories  from zone set      iframe compare
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  CONTEXT.xml         Zone config          Generated TSX       User feels
  injected to         with constraints     using recipe        difference
  Claude prompt                            physics
```

---

## 2. Technology Stack

### 2.1 Core Technologies

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Animation** | Framer Motion | ^10.0 | React animation standard, spring physics |
| **Framework** | React | ^18.0 | Opinionated choice for recipe ecosystem |
| **Build** | Vite | ^5.0 | Fast HMR for workbench, ESM native |
| **Terminal** | tmux | ^3.3 | Mature, scriptable, ubiquitous |
| **Browser** | Chrome MCP | Latest | Claude-native browser control |
| **CLI** | Node.js | ^20.0 | Claude Code integration |
| **Lint** | ESLint | ^8.0 | Plugin ecosystem, CI integration |

### 2.2 Recipe Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^10.16.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint-plugin-sigil": "^1.0.0",
    "vite": "^5.0.0"
  }
}
```

### 2.3 Path Alias Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@sigil/recipes/*": ["./sigil-mark/recipes/*"],
      "@sigil/hooks": ["./sigil-mark/hooks/index.ts"]
    }
  }
}
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@sigil/recipes': path.resolve(__dirname, './sigil-mark/recipes'),
      '@sigil/hooks': path.resolve(__dirname, './sigil-mark/hooks'),
    }
  }
});
```

---

## 3. Component Design

### 3.1 Recipe Architecture

Each recipe is a self-contained TSX component with embedded physics.

**Recipe Anatomy**:
```tsx
/**
 * @sigil-recipe {zone}/{ComponentName}
 * @physics {spring_config}, {timing_config}, {behavior_tags}
 * @zone {applicable_zones}
 * @sync {server_authoritative | client_authoritative}
 */

// 1. IMPORTS
import { motion } from 'framer-motion';
import { useState, forwardRef, type ReactNode } from 'react';

// 2. TYPES
export interface Props { /* ... */ }

// 3. PHYSICS CONSTANTS
const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 12,
};

// 4. HOOKS (if needed)
function useServerTick(action: () => Promise<void>) { /* ... */ }

// 5. STYLES
const baseStyles = `/* tailwind classes */`;

// 6. COMPONENT
export const Component = forwardRef<HTMLElement, Props>(/* ... */);

// 7. EXPORTS
export default Component;
```

### 3.2 Recipe Sets

#### Decisive (checkout, transactions)
```typescript
// Physics: Heavy, deliberate, trustworthy
const DECISIVE_SPRING = { stiffness: 180, damping: 12 };
const DECISIVE_TIMING = { min: 150, max: 250 }; // ms

// Constraints
sync: 'server_authoritative'
tick: 600 // ms server response budget
optimistic_ui: 'forbidden'
```

#### Machinery (admin, dashboards)
```typescript
// Physics: Instant, efficient, precise
const MACHINERY_SPRING = { stiffness: 400, damping: 30 };
// Or: no animation (instant state changes)

// Constraints
sync: 'client_authoritative'
animations: 'minimal'
```

#### Glass (marketing, landing)
```typescript
// Physics: Delightful, polished, inviting
const GLASS_SPRING = { stiffness: 200, damping: 20 };
const FLOAT_AMOUNT = -8; // pixels on hover

// Behaviors
glow: true
float: true
entrance_delay: 100 // ms stagger
```

### 3.3 Variant System

Variants are created through refinement and live alongside base recipes:

```
sigil-mark/recipes/decisive/
├── Button.tsx              # Base: spring(180, 12)
├── Button.nintendo.tsx     # Snappier: spring(300, 8)
├── Button.relaxed.tsx      # Softer: spring(140, 16)
├── Button.nintendo.extra.tsx  # Hierarchical variant
└── index.ts                # Barrel exports
```

**Variant Index Pattern**:
```typescript
// sigil-mark/recipes/decisive/index.ts
export { Button } from './Button';
export { Button as ButtonNintendo } from './Button.nintendo';
export { Button as ButtonRelaxed } from './Button.relaxed';
export { ConfirmFlow } from './ConfirmFlow';
```

### 3.4 Core Hooks

#### useServerTick
Ensures async actions complete before UI updates. Prevents optimistic UI in server_authoritative zones.

```typescript
interface ServerTickResult<T> {
  execute: () => Promise<T>;
  isPending: boolean;
  error: Error | null;
}

function useServerTick<T>(action: () => Promise<T>): ServerTickResult<T> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    if (isPending) return;
    setIsPending(true);
    setError(null);

    try {
      const result = await action();
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Action failed'));
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { execute, isPending, error };
}
```

---

## 4. Zone System

### 4.1 Zone Configuration Schema

```yaml
# .sigilrc.yaml
sigil: "1.2.4"                    # Version requirement
recipes: decisive                  # Recipe set to use
sync: server_authoritative        # Sync model
tick: 600                         # Server response budget (ms)

# Optional constraints
constraints:
  optimistic_ui: forbidden        # IMPOSSIBLE: never allowed
  loading_spinners: forbidden     # BLOCK: requires sandbox
  raw_physics: blocked            # BLOCK: requires sandbox

# Optional sandbox whitelist
sandbox:
  - "Experiment.tsx"
  - "Prototype/**"
```

### 4.2 Zone Resolution Algorithm

```typescript
interface ZoneConfig {
  sigil: string;
  recipes: 'decisive' | 'machinery' | 'glass';
  sync: 'server_authoritative' | 'client_authoritative';
  tick?: number;
  constraints?: Record<string, 'forbidden' | 'blocked' | 'warned'>;
  sandbox?: string[];
}

function resolveZone(filePath: string): ZoneConfig {
  const parts = filePath.split('/');
  let config: Partial<ZoneConfig> = {};

  // Walk up directory tree, merging configs
  for (let i = 1; i <= parts.length; i++) {
    const dir = parts.slice(0, i).join('/');
    const configPath = `${dir}/.sigilrc.yaml`;

    if (exists(configPath)) {
      const dirConfig = parseYaml(readFile(configPath));
      config = { ...config, ...dirConfig };
    }
  }

  // Default to machinery if no config found
  return {
    sigil: config.sigil ?? '1.2.4',
    recipes: config.recipes ?? 'machinery',
    sync: config.sync ?? 'client_authoritative',
    tick: config.tick,
    constraints: config.constraints ?? {},
    sandbox: config.sandbox ?? [],
  };
}
```

### 4.3 Zone Directory Structure

```
src/
├── .sigilrc.yaml              # Default: recipes: machinery
│
├── checkout/
│   ├── .sigilrc.yaml          # recipes: decisive, sync: server_authoritative
│   ├── ConfirmButton.tsx      # Uses decisive/Button
│   └── ClaimFlow.tsx          # Uses decisive/ConfirmFlow
│
├── admin/
│   ├── .sigilrc.yaml          # recipes: machinery (inherited or explicit)
│   ├── Dashboard.tsx          # Uses machinery/Table
│   └── Settings.tsx           # Uses machinery/Toggle
│
└── marketing/
    ├── .sigilrc.yaml          # recipes: glass
    ├── Hero.tsx               # Uses glass/HeroCard
    └── Features.tsx           # Uses glass/FeatureCard
```

---

## 5. Workbench Architecture

### 5.1 tmux Session Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  sigil workbench                                      [checkout/decisive]   │
├────────────────────────┬────────────────────────────────────────────────────┤
│ PANE 0: DIFF           │ PANE 1: BROWSER                                    │
│ (40% width)            │ (60% width)                                        │
│                        │                                                    │
│ File: Button.tsx       │ ┌──────────────────────────────────────────────┐  │
│                        │ │                                              │  │
│ - stiffness: 180       │ │         [Confirm Purchase]                   │  │
│ + stiffness: 300       │ │                                              │  │
│ - damping: 12          │ │         ← Click to test                      │  │
│ + damping: 8           │ │                                              │  │
│                        │ └──────────────────────────────────────────────┘  │
│ PHYSICS                │                                                    │
│ spring(300, 8)         │ Hot-swap active                                    │
│                        │ Version: B (after)                                 │
│ COMPARE                │                                                    │
│ [A] 180/12  [B] 300/8  │                                                    │
├────────────────────────┴────────────────────────────────────────────────────┤
│ PANE 2: CLAUDE CODE                                                         │
│                                                                             │
│ > More Nintendo Switch                                                      │
│ Adjusted: spring(180, 12) → spring(300, 8)                                  │
│ [Toggle A/B to feel the difference]                                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ STATUS: [A] Before  [B] After  │  Press Space to toggle  │  ● Learning     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Workbench Scripts

**sigil-workbench.sh**:
```bash
#!/bin/bash
# Launch Sigil workbench tmux session

SESSION_NAME="sigil-workbench"
COMPONENT_PATH="${1:-src/components}"

# Kill existing session if exists
tmux kill-session -t $SESSION_NAME 2>/dev/null

# Create new session with 3 panes
tmux new-session -d -s $SESSION_NAME -n "workbench"

# Pane 0: Diff view (left, 40%)
tmux send-keys -t $SESSION_NAME "sigil diff --watch $COMPONENT_PATH" Enter

# Split horizontally for browser (right, 60%)
tmux split-window -h -t $SESSION_NAME -p 60

# Pane 1: Browser preview (will be controlled by Chrome MCP)
tmux send-keys -t $SESSION_NAME "echo 'Browser preview ready'" Enter

# Split Pane 0 vertically for Claude
tmux select-pane -t 0
tmux split-window -v -t $SESSION_NAME -p 30

# Pane 2: Claude Code
tmux send-keys -t $SESSION_NAME "claude --workbench" Enter

# Set up status bar with Adhesion branding
tmux set-option -t $SESSION_NAME status-style "bg=#000000,fg=#FFFFFF"
tmux set-option -t $SESSION_NAME status-left "[SIGIL] "
tmux set-option -t $SESSION_NAME status-right "[A]Before [B]After │ Space toggle"

# Attach to session
tmux attach-session -t $SESSION_NAME
```

### 5.3 A/B Toggle Implementation

#### Hot-Swap (Granular Changes)

For single-component changes, use CSS variable hot-swap:

```typescript
// workbench/ab-toggle.ts
interface PhysicsState {
  stiffness: number;
  damping: number;
}

class ABToggle {
  private stateA: PhysicsState;
  private stateB: PhysicsState;
  private current: 'A' | 'B' = 'A';

  constructor(before: PhysicsState, after: PhysicsState) {
    this.stateA = before;
    this.stateB = after;
  }

  toggle(): void {
    this.current = this.current === 'A' ? 'B' : 'A';
    this.applyState();
  }

  private applyState(): void {
    const state = this.current === 'A' ? this.stateA : this.stateB;

    // Update CSS variables for immediate effect
    document.documentElement.style.setProperty(
      '--sigil-stiffness',
      String(state.stiffness)
    );
    document.documentElement.style.setProperty(
      '--sigil-damping',
      String(state.damping)
    );

    // Trigger re-render of components using these variables
    window.dispatchEvent(new CustomEvent('sigil:physics-change', {
      detail: state
    }));
  }
}
```

#### Iframe (Flow Comparison)

For entire zone or multi-step flow comparison:

```typescript
// workbench/iframe-compare.ts
interface IframeCompareOptions {
  urlA: string;  // Preview URL with version A
  urlB: string;  // Preview URL with version B
  container: HTMLElement;
}

class IframeCompare {
  private iframeA: HTMLIFrameElement;
  private iframeB: HTMLIFrameElement;
  private active: 'A' | 'B' = 'A';

  constructor(options: IframeCompareOptions) {
    this.iframeA = this.createIframe(options.urlA);
    this.iframeB = this.createIframe(options.urlB);

    // Show A, hide B initially
    this.iframeB.style.display = 'none';

    options.container.appendChild(this.iframeA);
    options.container.appendChild(this.iframeB);
  }

  toggle(): void {
    this.active = this.active === 'A' ? 'B' : 'A';

    this.iframeA.style.display = this.active === 'A' ? 'block' : 'none';
    this.iframeB.style.display = this.active === 'B' ? 'block' : 'none';
  }

  private createIframe(url: string): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    return iframe;
  }
}
```

### 5.4 Chrome MCP Integration

The browser pane is controlled via Claude's Chrome MCP:

```typescript
// Claude's context when in workbench mode
const workbenchContext = {
  mode: 'workbench',
  chrome_mcp: true,

  // Browser control via MCP
  browser: {
    navigate: (url: string) => mcp.navigate({ url, tabId }),
    screenshot: () => mcp.computer({ action: 'screenshot', tabId }),
    click: (x: number, y: number) => mcp.computer({
      action: 'left_click',
      coordinate: [x, y],
      tabId
    }),
  },

  // A/B toggle state
  ab: {
    current: 'A' | 'B',
    stateA: { stiffness: 180, damping: 12 },
    stateB: { stiffness: 300, damping: 8 },
    toggle: () => { /* swap and hot-reload */ },
  }
};
```

---

## 6. Claude Integration

### 6.1 Context Injection Format

Claude receives zone-aware context for each command:

```xml
<sigil_context version="1.2.4">
  <zone path="src/checkout">
    <recipes>decisive</recipes>
    <sync>server_authoritative</sync>
    <tick>600</tick>
  </zone>

  <available_recipes>
    <recipe name="Button" physics="spring(180, 12)">
      <variant name="nintendo" physics="spring(300, 8)" />
      <variant name="relaxed" physics="spring(140, 16)" />
    </recipe>
    <recipe name="ConfirmFlow" physics="spring(150, 14), timing(600ms)" />
  </available_recipes>

  <constraints>
    <rule level="impossible">Optimistic UI in server_authoritative</rule>
    <rule level="block">Raw physics outside sandbox</rule>
  </constraints>

  <sandbox_files>
    <file path="src/checkout/Experiment.tsx" age="3d" />
  </sandbox_files>

  <history>
    <entry date="2026-01-04" feedback="Nintendo Switch" result="spring(300, 8)" />
    <entry date="2026-01-03" feedback="too anxious" result="spring(140, 16)" />
  </history>

  <workbench active="true">
    <mode>learning</mode>
    <diff_visible>true</diff_visible>
    <ab_toggle>enabled</ab_toggle>
  </workbench>
</sigil_context>
```

### 6.2 CLAUDE.md Prompt Structure

```markdown
# Sigil v1.2.4: Design Physics Framework

You are operating within **Sigil**, a design physics framework...

## Core Philosophy
<sigil_philosophy>
**Apprenticeship Through Diff + Feel**
...
</sigil_philosophy>

## Commands
<sigil_commands>
### /craft [description] [--file path]
...
</sigil_commands>

## Zone Resolution
<sigil_zones>
...
</sigil_zones>

## Behavioral Guidelines
<sigil_behavior>
**DO:**
- Use recipes for all physics
- Show diffs prominently after changes
...

**DON'T:**
- Generate raw spring/timing values outside sandbox
- Lecture about physics (the diff is the lesson)
...
</sigil_behavior>
```

### 6.3 Skill Structure

```
.claude/skills/sigil-core/
├── index.yaml            # Metadata (~100 tokens)
├── SKILL.md              # Full instructions (~2000 tokens)
└── scripts/
    ├── resolve-zone.sh   # Zone resolution utility
    ├── parse-recipe.sh   # Recipe metadata extraction
    └── validate.sh       # Compliance check
```

**index.yaml**:
```yaml
name: sigil-core
version: 1.2.4
description: Design Physics Framework for apprenticeship learning
commands:
  - /craft
  - /sandbox
  - /codify
  - /inherit
  - /validate
  - /garden
```

---

## 7. Command Implementation

### 7.1 /craft

Generate component using zone-appropriate recipes.

**Input**: Component description, optional file path
**Output**: Generated TSX using recipe import

```typescript
// Command handler pseudocode
async function craft(description: string, filePath?: string) {
  // 1. Resolve zone
  const zone = resolveZone(filePath ?? process.cwd());

  // 2. Load available recipes
  const recipes = loadRecipes(zone.recipes);

  // 3. Claude selects appropriate recipe based on description
  const selectedRecipe = await claude.selectRecipe(description, recipes);

  // 4. Generate component
  const component = await claude.generate({
    template: 'recipe-consumer',
    recipe: selectedRecipe,
    description,
    zone,
  });

  // 5. Output with physics summary
  return {
    code: component,
    zone: zone.recipes,
    physics: selectedRecipe.physics,
  };
}
```

**Output Format**:
```
ZONE: src/checkout (decisive)
RECIPE: decisive/Button

[generated code]

PHYSICS: spring(180, 12), server-tick
```

### 7.2 /sandbox

Enable exploration mode for a file.

```typescript
async function sandbox(filePath: string) {
  // 1. Add sandbox header to file
  const content = readFile(filePath);
  const sandboxed = `// sigil-sandbox\n${content}`;
  writeFile(filePath, sandboxed);

  // 2. Update .sigilrc.yaml sandbox list
  const zone = resolveZone(filePath);
  zone.sandbox = [...(zone.sandbox ?? []), path.basename(filePath)];
  writeZoneConfig(filePath, zone);

  // 3. Report
  return {
    status: 'sandbox_enabled',
    file: filePath,
    rules_relaxed: ['raw_physics', 'recipe_import'],
  };
}
```

### 7.3 /codify

Extract physics from sandbox to recipe.

```typescript
async function codify(filePath: string, recipeName?: string) {
  // 1. Parse sandbox file for physics values
  const content = readFile(filePath);
  const physics = extractPhysics(content);

  // 2. Determine recipe name
  const name = recipeName ?? inferRecipeName(filePath);
  const zone = resolveZone(filePath);

  // 3. Generate recipe file
  const recipe = generateRecipe({
    name,
    physics,
    zone: zone.recipes,
    sourceFile: filePath,
  });

  // 4. Write recipe
  const recipePath = `sigil-mark/recipes/${zone.recipes}/${name}.tsx`;
  writeFile(recipePath, recipe);

  // 5. Update source file to use recipe
  const updated = replaceRawPhysicsWithRecipe(content, name, zone.recipes);

  // 6. Remove sandbox markers
  const cleaned = updated.replace('// sigil-sandbox\n', '');
  writeFile(filePath, cleaned);

  return {
    recipe: recipePath,
    physics,
    updated: filePath,
  };
}
```

### 7.4 /inherit

Analyze existing codebase for physics patterns.

```typescript
async function inherit() {
  // 1. Scan component directories
  const components = glob('src/**/*.tsx');

  // 2. Extract physics values
  const physicsPatterns = [];
  for (const file of components) {
    const content = readFile(file);
    const values = extractPhysicsValues(content);
    if (values.length > 0) {
      physicsPatterns.push({ file, values });
    }
  }

  // 3. Cluster patterns
  const clusters = clusterByPhysics(physicsPatterns);

  // 4. Report (NO auto-generation)
  return {
    total_components: components.length,
    with_physics: physicsPatterns.length,
    patterns: clusters.map(c => ({
      physics: c.centroid,
      files: c.files,
      suggested_recipe: c.suggestedName,
    })),
    action_required: 'Review analysis and create recipes manually',
  };
}
```

### 7.5 /validate

Check compliance across codebase.

```typescript
async function validate() {
  const violations = [];
  const compliant = [];

  const components = glob('src/**/*.tsx');

  for (const file of components) {
    const zone = resolveZone(file);
    const content = readFile(file);

    // Check for raw physics
    if (hasRawPhysics(content) && !isSandbox(file, zone)) {
      violations.push({
        file,
        rule: 'no-raw-physics',
        level: 'BLOCK',
      });
    }

    // Check for recipe import
    if (!hasRecipeImport(content) && !isSandbox(file, zone)) {
      violations.push({
        file,
        rule: 'require-recipe',
        level: 'BLOCK',
      });
    }

    // Check zone constraints
    for (const [constraint, level] of Object.entries(zone.constraints)) {
      if (violatesConstraint(content, constraint)) {
        violations.push({
          file,
          rule: constraint,
          level,
        });
      }
    }

    if (violations.filter(v => v.file === file).length === 0) {
      compliant.push(file);
    }
  }

  return {
    total: components.length,
    compliant: compliant.length,
    violations,
    coverage: `${Math.round(compliant.length / components.length * 100)}%`,
  };
}
```

### 7.6 /garden

Health report on recipes, sandboxes, variants.

```typescript
async function garden() {
  // Recipe coverage
  const components = glob('src/**/*.tsx');
  const withRecipes = components.filter(f => hasRecipeImport(readFile(f)));

  // Sandbox status
  const sandboxes = glob('src/**/*.tsx')
    .filter(f => readFile(f).startsWith('// sigil-sandbox'))
    .map(f => ({
      file: f,
      age: daysSinceModified(f),
      stale: daysSinceModified(f) > 7,
    }));

  // Variant inventory
  const recipes = glob('sigil-mark/recipes/**/*.tsx');
  const variants = recipes.filter(r => r.includes('.'));

  return {
    coverage: {
      total: components.length,
      using_recipes: withRecipes.length,
      percentage: `${Math.round(withRecipes.length / components.length * 100)}%`,
    },
    sandboxes: sandboxes.map(s => ({
      ...s,
      recommendation: s.stale ? 'Consider /codify' : 'Active',
    })),
    variants: variants.map(v => ({
      name: path.basename(v, '.tsx'),
      recipe: path.dirname(v).split('/').pop(),
    })),
    recommendations: generateRecommendations(sandboxes, variants),
  };
}
```

---

## 8. Enforcement Layer

### 8.1 ESLint Plugin

**eslint-plugin-sigil**:

```typescript
// rules/no-raw-physics.ts
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw spring/timing values outside sandbox',
    },
    schema: [],
  },

  create(context) {
    // Check if file is sandbox
    const sourceCode = context.getSourceCode();
    const isSandbox = sourceCode.text.startsWith('// sigil-sandbox');

    if (isSandbox) return {};

    return {
      Property(node) {
        if (
          node.key.name === 'stiffness' ||
          node.key.name === 'damping' ||
          node.key.name === 'transition'
        ) {
          context.report({
            node,
            message: 'Raw physics values not allowed. Use recipes from @sigil/recipes or mark file as sandbox.',
          });
        }
      },
    };
  },
};
```

**eslint.config.js**:
```javascript
import sigil from 'eslint-plugin-sigil';

export default [
  {
    plugins: { sigil },
    rules: {
      'sigil/no-raw-physics': 'error',
      'sigil/require-recipe': 'error',
      'sigil/no-optimistic-in-decisive': 'error',
      'sigil/sandbox-stale': 'warn',
    },
  },
];
```

### 8.2 CI Validation

**.github/workflows/sigil.yml**:
```yaml
name: Sigil Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: ESLint (Sigil rules)
        run: npx eslint --ext .tsx,.ts src/

      - name: Sigil validate
        run: npx sigil validate

      - name: Check for IMPOSSIBLE violations
        run: |
          if npx sigil validate --json | jq '.violations[] | select(.level == "IMPOSSIBLE")' | grep -q .; then
            echo "IMPOSSIBLE violations found. Build cannot proceed."
            exit 1
          fi
```

---

## 9. Refinement History

### 9.1 History Storage

History is stored in-repo at `sigil-mark/history/`:

```
sigil-mark/history/
├── 2026-01-05.md
├── 2026-01-04.md
└── ...
```

**History Entry Format**:
```markdown
# 2026-01-05

## CheckoutButton
- Feedback: "More Nintendo Switch"
- Before: spring(180, 12)
- After: spring(300, 8)
- Saved as variant: Button.nintendo

## ClaimModal
- Feedback: "feels too anxious"
- Before: spring(200, 10)
- After: spring(140, 16)
- Notes: User prefers relaxed feel for claim flows
```

### 9.2 History Parsing

Claude parses history to calibrate vibe interpretation:

```typescript
interface HistoryEntry {
  date: string;
  component: string;
  feedback: string;
  before: PhysicsState;
  after: PhysicsState;
  variant?: string;
}

function parseHistory(historyDir: string): HistoryEntry[] {
  const files = glob(`${historyDir}/*.md`).sort().reverse();
  const entries: HistoryEntry[] = [];

  for (const file of files.slice(0, 30)) { // Last 30 days
    const content = readFile(file);
    entries.push(...parseHistoryFile(content));
  }

  return entries;
}

function calibrateVibe(feedback: string, history: HistoryEntry[]): PhysicsState {
  // Find similar feedback patterns
  const similar = history.filter(h =>
    h.feedback.toLowerCase().includes(feedback.toLowerCase()) ||
    feedback.toLowerCase().includes(h.feedback.toLowerCase())
  );

  if (similar.length > 0) {
    // Average the "after" states
    return averagePhysics(similar.map(s => s.after));
  }

  // Fall back to Claude's inference
  return null;
}
```

---

## 10. File Structure

### 10.1 Complete Directory Layout

```
project/
├── CLAUDE.md                      # Sigil prompt for Claude CLI
├── .sigilrc.yaml                  # Root config
├── .sigil-version.json            # Version tracking
│
├── src/
│   ├── .sigilrc.yaml              # Default: recipes: machinery
│   │
│   ├── checkout/
│   │   ├── .sigilrc.yaml          # recipes: decisive
│   │   ├── ConfirmButton.tsx      # Uses @sigil/recipes/decisive/Button
│   │   ├── ClaimFlow.tsx          # Uses @sigil/recipes/decisive/ConfirmFlow
│   │   └── Experiment.tsx         # Sandbox file (// sigil-sandbox)
│   │
│   ├── admin/
│   │   ├── .sigilrc.yaml          # recipes: machinery
│   │   ├── Dashboard.tsx          # Uses @sigil/recipes/machinery/Table
│   │   └── Settings.tsx           # Uses @sigil/recipes/machinery/Toggle
│   │
│   └── marketing/
│       ├── .sigilrc.yaml          # recipes: glass
│       ├── Hero.tsx               # Uses @sigil/recipes/glass/HeroCard
│       └── Features.tsx           # Uses @sigil/recipes/glass/FeatureCard
│
├── sigil-mark/
│   ├── recipes/
│   │   ├── decisive/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.nintendo.tsx
│   │   │   ├── Button.relaxed.tsx
│   │   │   ├── ConfirmFlow.tsx
│   │   │   ├── ServerTickWrapper.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── machinery/
│   │   │   ├── Table.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Form.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── glass/
│   │       ├── HeroCard.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── Tooltip.tsx
│   │       └── index.ts
│   │
│   ├── hooks/
│   │   ├── useServerTick.ts
│   │   ├── useABToggle.ts
│   │   └── index.ts
│   │
│   ├── history/
│   │   ├── 2026-01-05.md
│   │   ├── 2026-01-04.md
│   │   └── ...
│   │
│   └── reports/
│       └── garden-2026-01-05.yaml
│
├── .claude/
│   ├── commands/
│   │   ├── craft.md
│   │   ├── sandbox.md
│   │   ├── codify.md
│   │   ├── inherit.md
│   │   ├── validate.md
│   │   └── garden.md
│   │
│   ├── skills/
│   │   └── sigil-core/
│   │       ├── index.yaml
│   │       ├── SKILL.md
│   │       └── scripts/
│   │           ├── resolve-zone.sh
│   │           ├── parse-recipe.sh
│   │           ├── workbench.sh
│   │           └── validate.sh
│   │
│   └── settings.json
│
├── assets/
│   └── fonts/
│       └── Adhesion-Regular.otf
│
├── eslint.config.js               # With sigil plugin
├── tsconfig.json                  # With @sigil/* path aliases
├── vite.config.ts                 # With resolve aliases
└── package.json
```

### 10.2 Version Tracking

**.sigil-version.json**:
```json
{
  "version": "1.2.4",
  "installed": "2026-01-05T00:00:00Z",
  "recipes": {
    "decisive": 3,
    "machinery": 3,
    "glass": 3
  },
  "variants": 2,
  "last_garden": "2026-01-05"
}
```

---

## 11. Security Considerations

### 11.1 Trust Model

Sigil operates on a "trust the team" model:

| Actor | Trust Level | Capabilities |
|-------|-------------|--------------|
| Engineer | Full | All commands, sandbox access |
| Designer | PR comments | Trigger refinements via comments |
| Claude | Guided | Generates within zone constraints |
| CI | Enforcer | Blocks IMPOSSIBLE violations |

### 11.2 Constraints

| Level | Description | Enforcement | Override |
|-------|-------------|-------------|----------|
| IMPOSSIBLE | Violates trust (e.g., optimistic UI in transactions) | CI fails | Never |
| BLOCK | Requires sandbox | ESLint error | Sandbox mode |
| WARN | Advisory | /garden report | N/A |

### 11.3 Data Handling

- **No remote calls**: All operations are local-first
- **No secrets**: Sigil doesn't handle credentials
- **Clean removal**: `rm -rf sigil-mark/` removes all state
- **Git-friendly**: All state is text files (YAML, MD, TSX)

---

## 12. Deployment Architecture

### 12.1 Development Environment

```
Local Development:
┌─────────────────────────────────────────────────────────────────┐
│                         Developer Machine                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   VS Code   │  │   Claude    │  │     Sigil Workbench     │ │
│  │             │  │   Code      │  │                         │ │
│  │  Editing    │  │  Commands   │  │  tmux + Chrome MCP      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│        │                │                      │                │
│        └────────────────┴──────────────────────┘                │
│                         │                                       │
│                    ┌────▼────┐                                  │
│                    │  Vite   │                                  │
│                    │   HMR   │                                  │
│                    └─────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 CI/CD Pipeline

```
Pull Request:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│   Actions   │────▶│   Vercel    │
│   PR Open   │     │   CI Run    │     │   Preview   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │           │
              ┌─────▼───┐ ┌─────▼───┐
              │ ESLint  │ │ sigil   │
              │ sigil/* │ │validate │
              └─────────┘ └─────────┘
                    │           │
                    └─────┬─────┘
                          │
                    ┌─────▼───┐
                    │  Pass/  │
                    │  Fail   │
                    └─────────┘
```

### 12.3 PR-Native Refinement Flow

```
PR Refinement:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Designer  │────▶│   Vercel    │────▶│   GitHub    │
│   Comment   │     │   Preview   │     │   Webhook   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                        ┌─────▼─────┐
                                        │  Claude   │
                                        │  Action   │
                                        └─────┬─────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
              ┌─────▼───┐               ┌─────▼───┐               ┌─────▼───┐
              │  Parse  │               │  Infer  │               │  Commit │
              │ Comment │               │ Physics │               │  Change │
              └─────────┘               └─────────┘               └─────────┘
```

---

## 13. Development Workflow

### 13.1 New Project Setup

```bash
# 1. Install Sigil
curl -fsSL https://sigil.dev/install.sh | bash

# 2. Initialize in project
sigil init

# 3. Start Claude Code
claude

# 4. (Optional) Open workbench
sigil workbench
```

### 13.2 Brownfield Migration

```bash
# 1. Analyze existing codebase
/inherit

# 2. Review analysis output
# (Claude shows patterns, does NOT auto-generate)

# 3. Create recipes manually based on analysis
# Edit sigil-mark/recipes/{zone}/*.tsx

# 4. Gradually migrate components
# Replace raw physics with recipe imports

# 5. Enable enforcement
# Add eslint-plugin-sigil
```

### 13.3 Daily Development

```bash
# Start workbench (optional)
sigil workbench

# Generate component
/craft "confirmation button for claim flow"

# Experiment with new physics
/sandbox src/checkout/Experiment.tsx

# Extract to recipe when ready
/codify src/checkout/Experiment.tsx --name Button.snappy

# Check health
/garden
```

---

## 14. Testing Strategy

### 14.1 Unit Tests

```typescript
// sigil-mark/recipes/decisive/__tests__/Button.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '../Button';

describe('Decisive Button', () => {
  it('calls onAction and shows pending state', async () => {
    const onAction = jest.fn(() => new Promise(r => setTimeout(r, 100)));
    const { getByText } = render(
      <Button onAction={onAction}>Confirm</Button>
    );

    fireEvent.click(getByText('Confirm'));

    expect(onAction).toHaveBeenCalled();
    expect(getByText('Processing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('Confirm')).toBeInTheDocument();
    });
  });

  it('applies correct spring physics', () => {
    const { container } = render(
      <Button onAction={async () => {}}>Test</Button>
    );

    // Check motion component has correct transition config
    // (Would need motion mock or integration test)
  });
});
```

### 14.2 Integration Tests

```typescript
// tests/integration/zone-resolution.test.ts
import { resolveZone } from '@sigil/core';

describe('Zone Resolution', () => {
  it('resolves checkout zone to decisive', () => {
    const zone = resolveZone('src/checkout/ConfirmButton.tsx');
    expect(zone.recipes).toBe('decisive');
    expect(zone.sync).toBe('server_authoritative');
  });

  it('cascades config from parent', () => {
    const zone = resolveZone('src/checkout/nested/Button.tsx');
    expect(zone.recipes).toBe('decisive');
  });

  it('defaults to machinery', () => {
    const zone = resolveZone('src/unknown/Component.tsx');
    expect(zone.recipes).toBe('machinery');
  });
});
```

### 14.3 Visual Regression Tests

```typescript
// tests/visual/button-variants.test.ts
import { chromium } from 'playwright';

describe('Button Variants Visual', () => {
  it('matches snapshot for decisive/Button', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('/storybook/?path=/story/decisive-button');
    await page.click('button');

    // Wait for animation to complete
    await page.waitForTimeout(300);

    expect(await page.screenshot()).toMatchSnapshot('decisive-button.png');

    await browser.close();
  });
});
```

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Claude vibe interpretation varies** | High | Medium | Refinement history calibrates over time |
| **Hot-swap technically challenging** | Medium | Medium | Fall back to iframes for flow comparison |
| **Recipe sprawl** | Medium | Low | /garden reports, hierarchical naming |
| **Brownfield codebases too messy** | Medium | High | /inherit flags only, human decides |
| **tmux unfamiliar to users** | Medium | Medium | Provide setup script, document shortcuts |
| **Chrome MCP rate limits** | Low | Medium | Batch operations, cache screenshots |

---

## 16. Future Considerations

### 16.1 v1.3+ Roadmap

| Feature | Priority | Notes |
|---------|----------|-------|
| `@sigil/crypto-recipes` package | P3 | Optional addon for web3 patterns |
| Cross-team learning (cloud) | P3 | Share refinement history across teams |
| Visual GUI for workbench | P3 | Electron/web alternative to tmux |
| Multi-framework support | P4 | Vue, Svelte adapters |

### 16.2 Technical Debt Considerations

- **Recipe bundling**: Currently individual files, may need barrel optimization
- **History parsing**: Markdown parsing is fragile, consider structured format
- **Path alias resolution**: IDE support varies, may need additional config

---

## Appendix A: Physics Reference

### Spring Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| **stiffness** | 50-500 | Higher = snappier, more responsive |
| **damping** | 5-30 | Higher = less oscillation, more controlled |
| **mass** | 0.5-2 | Higher = heavier, more momentum |

### Common Configurations

| Feel | Stiffness | Damping | Example |
|------|-----------|---------|---------|
| Nintendo Switch | 300 | 8 | Snappy, satisfying |
| Decisive | 180 | 12 | Deliberate, trustworthy |
| Relaxed | 140 | 16 | Soft, gentle |
| Instant | 400+ | 30 | No perceivable animation |
| Bouncy | 150 | 8 | Playful, attention-grabbing |
| Float | 200 | 20 | Delightful, polished |

---

## Appendix B: ESLint Rules Reference

| Rule | Level | Description |
|------|-------|-------------|
| `sigil/no-raw-physics` | error | No inline spring/timing values outside sandbox |
| `sigil/require-recipe` | error | Components must import from @sigil/recipes |
| `sigil/no-optimistic-in-decisive` | error | No optimistic UI in server_authoritative zones |
| `sigil/sandbox-stale` | warn | Sandbox files older than 7 days |
| `sigil/valid-zone-config` | error | .sigilrc.yaml must have valid schema |

---

## Appendix C: Keyboard Shortcuts

### Workbench (tmux)

| Shortcut | Action |
|----------|--------|
| `Space` | Toggle A/B |
| `Ctrl-b 0` | Focus diff pane |
| `Ctrl-b 1` | Focus browser pane |
| `Ctrl-b 2` | Focus Claude pane |
| `Ctrl-b d` | Detach session |
| `q` | Quit workbench |

---

*End of SDD*
