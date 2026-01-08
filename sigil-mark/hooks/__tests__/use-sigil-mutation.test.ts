/**
 * Sigil v4.1 - useSigilMutation Tests
 *
 * Tests for the zone+persona-aware mutation hook covering:
 * - Zone/persona auto-resolution
 * - Persona overrides
 * - CSS variables
 * - Disabled state
 * - Override warning
 * - Mutation lifecycle
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useSigilMutation,
  type SigilMutationConfig,
} from '../use-sigil-mutation';
import {
  SigilProvider,
  useSigilZoneContext,
} from '../../providers/sigil-provider';

// =============================================================================
// TEST UTILITIES
// =============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockMutation = <T>(
  result: T,
  delayMs: number = 50
): jest.Mock<Promise<T>> => {
  return jest.fn(() => delay(delayMs).then(() => result));
};

const createFailingMutation = (
  error: Error,
  delayMs: number = 50
): jest.Mock<Promise<never>> => {
  return jest.fn(() => delay(delayMs).then(() => Promise.reject(error)));
};

/**
 * Wrapper component that provides SigilProvider context.
 */
function createWrapper(
  options: { persona?: string; localVibes?: { timing_modifier?: number } } = {}
) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      SigilProvider,
      {
        persona: options.persona ?? 'power_user',
        localVibes: options.localVibes,
      },
      children
    );
  };
}

/**
 * Component that sets zone context and renders children.
 */
function ZoneWrapper({
  zone,
  children,
}: {
  zone: string;
  children: React.ReactNode;
}) {
  const { setZone } = useSigilZoneContext();
  React.useEffect(() => {
    setZone(zone);
    return () => setZone(null);
  }, [zone, setZone]);
  return React.createElement(React.Fragment, null, children);
}

/**
 * Wrapper that sets both provider and zone context.
 */
function createZoneWrapper(
  zone: string,
  options: { persona?: string; localVibes?: { timing_modifier?: number } } = {}
) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      SigilProvider,
      {
        persona: options.persona ?? 'power_user',
        localVibes: options.localVibes,
      },
      React.createElement(ZoneWrapper, { zone }, children)
    );
  };
}

// =============================================================================
// BASIC FUNCTIONALITY
// =============================================================================

describe('useSigilMutation - Basic Functionality', () => {
  it('starts in idle state', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createWrapper() }
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('transitions through mutation lifecycle', async () => {
    const mutation = createMockMutation({ id: 1 }, 100);

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createWrapper() }
    );

    // Start the mutation
    act(() => {
      result.current.execute(undefined);
    });

    // Should be pending
    expect(result.current.status).toBe('pending');
    expect(result.current.isPending).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });

    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.isPending).toBe(false);
  });

  it('handles mutation errors', async () => {
    const error = new Error('Payment failed');
    const mutation = createFailingMutation(error, 50);
    const onError = jest.fn();

    const { result } = renderHook(
      () => useSigilMutation({ mutation, onError }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.execute(undefined);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('failed');
    });

    expect(result.current.error).toEqual(error);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('calls onSuccess callback on success', async () => {
    const mutation = createMockMutation({ id: 1 }, 50);
    const onSuccess = jest.fn();

    const { result } = renderHook(
      () => useSigilMutation({ mutation, onSuccess }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.execute(undefined);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });

    expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
  });

  it('prevents double execution while pending', async () => {
    const mutation = createMockMutation({ id: 1 }, 100);

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.execute(undefined);
    });

    act(() => {
      result.current.execute(undefined);
    });

    expect(mutation).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });
  });

  it('resets to idle state', async () => {
    const mutation = createMockMutation({ id: 1 }, 50);

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.execute(undefined);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

// =============================================================================
// ZONE CONTEXT RESOLUTION
// =============================================================================

describe('useSigilMutation - Zone Resolution', () => {
  it('uses default zone when no context', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createWrapper() }
    );

    // Default zone uses optimistic sync (warm timing)
    expect(result.current.physics.sync).toBe('optimistic');
    expect(result.current.physics.motion).toBe('warm');
    expect(result.current.physics.timing).toBe(300);
  });

  it('auto-resolves zone from context', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical') }
    );

    // Critical zone uses pessimistic sync (deliberate timing)
    expect(result.current.physics.sync).toBe('pessimistic');
    expect(result.current.physics.motion).toBe('deliberate');
    expect(result.current.physics.timing).toBe(800);
    expect(result.current.physics.disabled_while_pending).toBe(true);
  });

  it('respects explicit zone override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation, zone: 'admin' }),
      { wrapper: createZoneWrapper('critical') } // Context is critical, but override is admin
    );

    // Should use admin zone physics (snappy), not critical
    expect(result.current.physics.sync).toBe('optimistic');
    expect(result.current.physics.motion).toBe('snappy');
    expect(result.current.physics.timing).toBe(150);
  });

  it('admin zone has snappy physics', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('admin') }
    );

    expect(result.current.physics.sync).toBe('optimistic');
    expect(result.current.physics.motion).toBe('snappy');
    expect(result.current.physics.timing).toBe(150);
    expect(result.current.physics.easing).toBe('ease-out');
  });

  it('marketing zone has warm physics', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('marketing') }
    );

    expect(result.current.physics.sync).toBe('optimistic');
    expect(result.current.physics.motion).toBe('warm');
    expect(result.current.physics.timing).toBe(300);
    expect(result.current.physics.easing).toBe('ease-in-out');
  });
});

// =============================================================================
// PERSONA OVERRIDES
// =============================================================================

describe('useSigilMutation - Persona Overrides', () => {
  it('auto-resolves persona from context', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical', { persona: 'power_user' }) }
    );

    // power_user in critical zone: deliberate timing
    expect(result.current.physics.motion).toBe('deliberate');
    expect(result.current.physics.timing).toBe(800);
  });

  it('applies newcomer persona override in critical zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical', { persona: 'newcomer' }) }
    );

    // newcomer in critical zone: reassuring timing (slower)
    expect(result.current.physics.motion).toBe('reassuring');
    expect(result.current.physics.timing).toBe(1200);
  });

  it('applies accessibility persona override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical', { persona: 'accessibility' }) }
    );

    // accessibility in critical zone: reduced motion (0ms)
    expect(result.current.physics.motion).toBe('reduced');
    expect(result.current.physics.timing).toBe(0);
    expect(result.current.physics.easing).toBe('linear');
  });

  it('applies power_user persona override in admin zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('admin', { persona: 'power_user' }) }
    );

    // power_user in admin zone: instant timing
    expect(result.current.physics.motion).toBe('instant');
    expect(result.current.physics.timing).toBe(0);
  });

  it('applies newcomer persona override in admin zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('admin', { persona: 'newcomer' }) }
    );

    // newcomer in admin zone: warm timing
    expect(result.current.physics.motion).toBe('warm');
    expect(result.current.physics.timing).toBe(300);
  });

  it('respects explicit persona override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation, persona: 'newcomer' }),
      { wrapper: createZoneWrapper('critical', { persona: 'power_user' }) }
    );

    // Explicit persona (newcomer) overrides context (power_user)
    expect(result.current.physics.motion).toBe('reassuring');
    expect(result.current.physics.timing).toBe(1200);
  });
});

// =============================================================================
// CSS VARIABLES
// =============================================================================

describe('useSigilMutation - CSS Variables', () => {
  it('returns correct CSS variables for critical zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical') }
    );

    expect(result.current.style).toEqual({
      '--sigil-duration': '800ms',
      '--sigil-easing': 'ease-out',
    });
  });

  it('returns correct CSS variables for admin zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('admin') }
    );

    expect(result.current.style).toEqual({
      '--sigil-duration': '150ms',
      '--sigil-easing': 'ease-out',
    });
  });

  it('returns correct CSS variables for marketing zone', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('marketing') }
    );

    expect(result.current.style).toEqual({
      '--sigil-duration': '300ms',
      '--sigil-easing': 'ease-in-out',
    });
  });

  it('returns correct CSS variables with persona override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical', { persona: 'newcomer' }) }
    );

    expect(result.current.style).toEqual({
      '--sigil-duration': '1200ms',
      '--sigil-easing': 'ease-in-out',
    });
  });
});

// =============================================================================
// DISABLED STATE
// =============================================================================

describe('useSigilMutation - Disabled State', () => {
  it('is not disabled when idle', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical') }
    );

    expect(result.current.disabled).toBe(false);
  });

  it('is disabled when pending in pessimistic sync zone', async () => {
    const mutation = createMockMutation({ success: true }, 100);

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('critical') }
    );

    act(() => {
      result.current.execute(undefined);
    });

    // Critical zone is pessimistic, so should be disabled while pending
    expect(result.current.disabled).toBe(true);
    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });

    expect(result.current.disabled).toBe(false);
  });

  it('is not disabled when pending in optimistic sync zone', async () => {
    const mutation = createMockMutation({ success: true }, 100);

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      { wrapper: createZoneWrapper('admin') }
    );

    act(() => {
      result.current.execute(undefined);
    });

    // Admin zone is optimistic, so should NOT be disabled while pending
    expect(result.current.disabled).toBe(false);
    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.status).toBe('confirmed');
    });
  });
});

// =============================================================================
// UNSAFE PHYSICS OVERRIDE
// =============================================================================

describe('useSigilMutation - Unsafe Override', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('applies unsafe physics override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () =>
        useSigilMutation({
          mutation,
          unsafe_override_physics: { timing: 1500 },
          unsafe_override_reason: 'Extended timing for complex animation',
        }),
      { wrapper: createZoneWrapper('critical') }
    );

    // Override should be applied
    expect(result.current.physics.timing).toBe(1500);
    // Other physics should remain from critical zone
    expect(result.current.physics.sync).toBe('pessimistic');
    expect(result.current.physics.motion).toBe('deliberate');
  });

  it('logs warning when unsafe override is used', () => {
    const mutation = createMockMutation({ success: true });

    renderHook(
      () =>
        useSigilMutation({
          mutation,
          unsafe_override_physics: { timing: 1500 },
          unsafe_override_reason: 'Extended timing for complex animation',
        }),
      { wrapper: createZoneWrapper('critical') }
    );

    // Warning should be logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Sigil] Physics override in critical zone:'),
      expect.stringContaining('Extended timing for complex animation'),
      expect.stringContaining('Overrides:'),
      expect.objectContaining({ timing: 1500 })
    );
  });

  it('logs override warning only once per hook instance', () => {
    const mutation = createMockMutation({ success: true });

    const { rerender } = renderHook(
      () =>
        useSigilMutation({
          mutation,
          unsafe_override_physics: { timing: 1500 },
          unsafe_override_reason: 'Extended timing for complex animation',
        }),
      { wrapper: createZoneWrapper('critical') }
    );

    // Rerender multiple times
    rerender();
    rerender();
    rerender();

    // Warning should only be logged once
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });

  it('can override sync strategy', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () =>
        useSigilMutation({
          mutation,
          unsafe_override_physics: { sync: 'optimistic' },
          unsafe_override_reason: 'Force optimistic for special case',
        }),
      { wrapper: createZoneWrapper('critical') }
    );

    // Override should change sync from pessimistic to optimistic
    expect(result.current.physics.sync).toBe('optimistic');
    expect(result.current.physics.disabled_while_pending).toBe(true); // Still from base
  });
});

// =============================================================================
// REMOTE VIBE MODIFIER
// =============================================================================

describe('useSigilMutation - Remote Vibe Modifier', () => {
  it('applies timing modifier from remote vibes', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      {
        wrapper: createZoneWrapper('critical', {
          persona: 'power_user',
          localVibes: { timing_modifier: 1.5 }, // 50% slower
        }),
      }
    );

    // Base timing is 800ms (deliberate), with 1.5x modifier = 1200ms
    expect(result.current.physics.timing).toBe(1200);
  });

  it('applies timing modifier with persona override', () => {
    const mutation = createMockMutation({ success: true });

    const { result } = renderHook(
      () => useSigilMutation({ mutation }),
      {
        wrapper: createZoneWrapper('critical', {
          persona: 'newcomer',
          localVibes: { timing_modifier: 0.5 }, // 50% faster
        }),
      }
    );

    // Newcomer timing is 1200ms (reassuring), with 0.5x modifier = 600ms
    expect(result.current.physics.timing).toBe(600);
  });
});
