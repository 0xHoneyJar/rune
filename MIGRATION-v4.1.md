# Migration Guide: Sigil v4.0 to v4.1

**Version:** 4.1.0 "Living Guardrails"
**Date:** 2026-01-07

This guide covers migrating from Sigil v4.0 "Sharp Tools" to v4.1 "Living Guardrails".

---

## Overview

v4.1 adds enforcement capabilities to the v4.0 context documentation system:

| Layer | v4.0 | v4.1 |
|-------|------|------|
| Agent | Context readers | Context readers (unchanged) |
| Compile | None | eslint-plugin-sigil |
| Runtime | Layout wrappers | SigilProvider + useSigilMutation |

---

## Breaking Changes

### 1. Process Layer Runtime Exports Removed

The Process layer (`sigil-mark/process`) no longer exports React hooks.

**Before (v4.0):**
```tsx
// This crashes in browsers - Node.js fs is used
import { ProcessContextProvider, useProcessContext } from 'sigil-mark/process';

<ProcessContextProvider>
  <App />
</ProcessContextProvider>
```

**After (v4.1):**
```tsx
// Use SigilProvider for runtime context
import { SigilProvider, useSigilZoneContext, useSigilPersonaContext } from 'sigil-mark/providers';

<SigilProvider persona="newcomer">
  <App />
</SigilProvider>

// In components
function MyComponent() {
  const { current: zone } = useSigilZoneContext();
  const { current: persona } = useSigilPersonaContext();
  // ...
}
```

### 2. useCriticalAction Deprecated

`useCriticalAction` is deprecated in favor of `useSigilMutation`.

**Before (v4.0):**
```tsx
import { useCriticalAction } from 'sigil-mark/core';

const payment = useCriticalAction({
  mutation: () => api.pay(amount),
  timeAuthority: 'server-tick',  // Manual configuration
});

<button onClick={() => payment.commit()}>
  Pay
</button>
```

**After (v4.1):**
```tsx
import { useSigilMutation } from 'sigil-mark/hooks';

const { execute, isPending, disabled, style } = useSigilMutation({
  mutation: () => api.pay(amount),
  // Physics auto-resolved from zone context
});

<button
  onClick={() => execute()}
  disabled={disabled}
  style={style}
>
  {isPending ? 'Processing...' : 'Pay'}
</button>
```

---

## Step-by-Step Migration

### Step 1: Update .sigilrc.yaml Schema

Add `default_physics` and `persona_overrides` to your zones:

```yaml
# .sigilrc.yaml
sigil: "4.1.0"  # Update version

zones:
  critical:
    layout: CriticalZone
    timeAuthority: server-tick
    motion: deliberate

    # NEW: Default physics for this zone
    default_physics:
      sync: pessimistic       # Server owns clock
      timing: deliberate      # 800ms default
      motion: deliberate

    # NEW: Persona-specific overrides
    persona_overrides:
      newcomer:
        lens: guided
        motion: reassuring    # Slower for newcomers
        timing: reassuring    # 1200ms
        show_help: true
      power_user:
        lens: strict
        motion: deliberate
        timing: deliberate    # 800ms
        show_help: false
```

### Step 2: Replace ProcessContextProvider with SigilProvider

```tsx
// app/providers.tsx
import { SigilProvider } from 'sigil-mark/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  // Optional: detect persona from user preferences or analytics
  const persona = useUserPersona() || 'power_user';

  return (
    <SigilProvider
      persona={persona}
      // Optional: remote config for marketing vibes
      remoteConfigProvider="launchdarkly"
      remoteConfigKey="sigil-vibes"
    >
      {children}
    </SigilProvider>
  );
}
```

### Step 3: Replace useCriticalAction with useSigilMutation

Find all uses of `useCriticalAction` and replace:

```tsx
// BEFORE
const action = useCriticalAction({
  mutation: (data) => api.submit(data),
  timeAuthority: 'server-tick',
  onSuccess: () => toast('Success!'),
});

// Call
action.commit(formData);

// AFTER
const { execute, isPending, disabled, style, physics } = useSigilMutation({
  mutation: (data) => api.submit(data),
  onSuccess: () => toast('Success!'),
  // No timeAuthority needed - auto-resolved from zone
});

// Call
execute(formData);
```

### Step 4: Configure ESLint Plugin

Install and configure the ESLint plugin:

```bash
npm install eslint-plugin-sigil --save-dev
```

```js
// eslint.config.js
import sigil from 'eslint-plugin-sigil';

export default [
  sigil.configs.recommended,
  // Your other config...
];
```

Rules included:
- `sigil/enforce-tokens` (error) - No arbitrary Tailwind values
- `sigil/zone-compliance` (warn) - Timing must match zone motion
- `sigil/input-physics` (warn) - Keyboard nav in admin zones

### Step 5: Set Up Vocabulary (Optional)

Define product terms for consistent language:

```yaml
# sigil-mark/vocabulary/vocabulary.yaml
version: "4.1.0"
terms:
  deposit:
    engineering_name: deposit
    user_facing: Deposit
    mental_model: "Adding funds to grow"
    recommended:
      material: glass
      motion: deliberate
      tone: confident
    zones:
      - critical
      - onboarding
```

### Step 6: Configure Remote Soul (Optional)

For marketing-controlled vibes via LaunchDarkly:

```tsx
<SigilProvider
  persona={persona}
  remoteConfigProvider="launchdarkly"
  remoteConfigKey="sigil-vibes"
  remoteConfigTimeout={100}  // 100ms timeout, falls back to local
>
  <App />
</SigilProvider>
```

See `docs/MARKETING-VIBES.md` for LaunchDarkly setup.

---

## Hook API Comparison

### useCriticalAction (Deprecated)

```tsx
const {
  state,     // CriticalActionState
  commit,    // (variables) => Promise<void>
  cancel,    // () => void
  retry,     // () => void
  reset,     // () => void
  confirm,   // () => void (for requireConfirmation)
} = useCriticalAction({
  mutation: (vars) => Promise,
  timeAuthority: 'server-tick' | 'optimistic' | 'hybrid',
  proprioception: { ... },
  optimistic: (cache, vars) => void,
  rollback: (cache, vars) => void,
  onSuccess: (data) => void,
  onError: (error) => void,
});
```

### useSigilMutation (New)

```tsx
const {
  // State
  status,        // 'idle' | 'pending' | 'confirmed' | 'failed'
  data,          // TData | null
  error,         // Error | null

  // Resolved physics
  physics,       // ResolvedPhysics

  // Computed UI state
  disabled,      // boolean (pessimistic sync + pending)
  isPending,     // boolean

  // CSS variables
  style,         // { '--sigil-duration', '--sigil-easing' }

  // Actions
  execute,       // (variables) => Promise<void>
  reset,         // () => void
} = useSigilMutation({
  mutation: (vars) => Promise,
  zone?: string,           // Optional override
  persona?: string,        // Optional override
  unsafe_override_physics?: Partial<ResolvedPhysics>,
  unsafe_override_reason?: string,
  onSuccess?: (data) => void,
  onError?: (error) => void,
});
```

---

## Physics Resolution

useSigilMutation auto-resolves physics using this priority:

1. **Explicit override** (`unsafe_override_physics`)
2. **Persona override** (from zone's `persona_overrides`)
3. **Zone default** (from zone's `default_physics`)
4. **Remote vibe modifier** (timing_modifier from LaunchDarkly)

Example resolution in CriticalZone with newcomer persona:

```
Zone: critical
  default_physics:
    sync: pessimistic
    timing: deliberate (800ms)

  persona_overrides.newcomer:
    timing: reassuring (1200ms)
    show_help: true

Remote vibe:
  timing_modifier: 1.0 (no change)

Resolved:
  sync: pessimistic
  timing: 1200ms (newcomer override)
  easing: ease-in-out
  disabled_while_pending: true
```

---

## CI Integration

### Process Import Checker

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    steps:
      - name: Check process imports
        run: ./scripts/check-process-imports.sh
```

This prevents accidental import of `sigil-mark/process` in client code.

### Version Verification

```yaml
      - name: Verify version coherence
        run: ./scripts/verify-version.sh
```

---

## FAQ

### Q: Why was ProcessContextProvider removed?

The Process layer reads YAML files using Node.js `fs`, which crashes in browsers. ProcessContextProvider incorrectly attempted to use these functions at runtime. v4.1 properly separates:

- **Agent-time**: Process layer reads YAML during code generation
- **Runtime**: SigilProvider manages context in the browser

### Q: Can I still use useCriticalAction?

Yes, it still works but logs a deprecation warning. We recommend migrating to useSigilMutation for:

- Auto-resolved physics (no manual timeAuthority)
- Persona-aware overrides
- Remote vibe support
- CSS custom properties

### Q: What if I need to override physics?

Use the `unsafe_override_` prefix:

```tsx
const { execute } = useSigilMutation({
  mutation: () => api.complexAction(),
  unsafe_override_physics: { timing: 1500 },
  unsafe_override_reason: 'Extended timing for multi-step animation',
});
```

This logs a warning but allows the override.

### Q: How do I access vibes in components?

```tsx
const { physics } = useSigilMutation({ mutation });
const { vibes } = physics;

<div
  data-theme={vibes?.seasonal_theme}
  data-energy={vibes?.hero_energy}
>
```

### Q: What's the ESLint plugin for?

Three rules:

1. **enforce-tokens**: Prevents arbitrary Tailwind values like `gap-[13px]`
2. **zone-compliance**: Warns when timing doesn't match zone's motion type
3. **input-physics**: Warns about missing keyboard nav in admin zones

### Q: Is the vocabulary layer required?

No, it's optional. Use it if you want consistent term-to-feel mapping across your product.

---

## Support

- GitHub Issues: [sigil/issues](https://github.com/your-org/sigil/issues)
- Migration help: See existing migrations in `loa-grimoire/a2a/`

---

*Sigil v4.1.0 "Living Guardrails"*
*Generated: 2026-01-07*
