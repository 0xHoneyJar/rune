# Sigil: Design Context Framework

> "Make the right path easy. Make the wrong path visible. Don't make the wrong path impossible."

## What is Sigil?

Sigil is a design context framework that helps AI agents make consistent design decisions by:

1. **Providing zone context** - Knowing if you're in "critical" vs "marketing" context
2. **Surfacing design rules** - Colors, typography, spacing, motion patterns
3. **Capturing product feel** - Moodboard with references and anti-patterns
4. **Human accountability** - All validation is human approval, not automation

---

## v4.1 "Living Guardrails" - Enforcement Layer

v4.1 adds enforcement capabilities to the v4.0 context documentation system:

```
                         AGENT TIME
  zone-reader -> persona-reader -> vocab-reader -> physics-reader
                           |
             +-------------+-------------+
             |                           |
             v                           v
      COMPILE TIME                  RUNTIME
  eslint-plugin-sigil        SigilProvider + useSigilMutation
  - enforce-tokens           - Auto-resolved physics
  - zone-compliance          - Persona overrides
  - input-physics            - Remote soul vibes
```

### Key v4.1 Features

| Feature | Description |
|---------|-------------|
| SigilProvider | Runtime context for zone/persona state |
| useSigilMutation | Hook that auto-resolves physics from context |
| eslint-plugin-sigil | Compile-time enforcement (3 rules) |
| Vocabulary Layer | Term -> feel mapping with 10 core terms |
| Physics Timing | Motion name -> ms mapping |
| Remote Soul | Marketing-controlled vibes via LaunchDarkly |

---

## Quick Reference

### Commands (v4.0)

| Command | Purpose | L1 | L2 | L3 |
|---------|---------|----|----|-----|
| `/envision` | Capture product moodboard | Full interview | `--quick` | `--from <file>` |
| `/codify` | Define design rules | Guided interview | `--zone <name>` | `--from <design-system.json>` |
| `/craft` | Get design guidance | Auto-context | `--zone`, `--persona` | `--no-gaps` |
| `/observe` | Visual feedback loop | Capture screen | `--component` | `--screenshot`, `--rules` |
| `/refine` | Incremental updates | Review feedback | `--persona`, `--zone` | `--evidence` |
| `/consult` | Record decisions | 30d lock | `--scope`, `--lock` | `--protect`, `--evidence` |
| `/garden` | Health monitoring | Summary | `--personas`, `--feedback` | `--validate` (CI) |

### Key Files

| File | Purpose |
|------|---------|
| `sigil-mark/moodboard.md` | Product feel, references, anti-patterns |
| `sigil-mark/rules.md` | Design rules by category |
| `sigil-mark/personas/personas.yaml` | User archetypes with evidence |
| `sigil-mark/vocabulary/vocabulary.yaml` | Term -> feel mapping |
| `sigil-mark/kernel/physics.yaml` | Motion timing definitions |
| `sigil-mark/remote-soul.yaml` | Kernel/vibe boundary |
| `.sigilrc.yaml` | Zone definitions with physics & persona overrides |
| `.sigil-version.json` | Version tracking |

---

## Agent Protocol (v4.1)

### Before Generating UI Code

1. **Check for Sigil setup**: Look for `sigil-mark/`

2. **Load design context** (graceful fallbacks):
   ```
   sigil-mark/moodboard.md         -> Product feel
   sigil-mark/rules.md             -> Design rules
   sigil-mark/personas/personas.yaml -> User archetypes
   sigil-mark/vocabulary/vocabulary.yaml -> Term -> feel mapping
   sigil-mark/kernel/physics.yaml  -> Motion timing
   ```

3. **Determine zone**: Match current file path to zones in `.sigilrc.yaml`
   ```yaml
   zones:
     critical:
       paths: ["src/features/claim/**"]
       default_physics:
         sync: pessimistic
         timing: deliberate
         motion: deliberate
       persona_overrides:
         newcomer:
           timing: reassuring
           show_help: true
   ```

4. **Check vocabulary**: If component name matches a term, use term's recommended physics

5. **Generate code with context**

### Zone Resolution

```
1. Get current file path
2. Read .sigilrc.yaml zones section
3. For each zone, check if path matches any glob pattern
4. Return matching zone with default_physics
5. Apply persona_overrides if persona context available
```

### Gap Detection

At the END of /craft output, surface missing context:

```
CONTEXT GAPS

2 gaps detected that may affect this guidance:

1. UNDEFINED PERSONA: "whale"
   You mentioned "whale users" but no whale persona exists.
   -> /refine --persona whale "high-value depositor"

2. MISSING VOCABULARY: "claim"
   No vocabulary term defined for "claim".
   -> /refine --vocab claim
```

---

## useSigilMutation Hook

The primary hook for mutations in v4.1. Auto-resolves physics from zone+persona context.

### Basic Usage

```tsx
import { useSigilMutation } from 'sigil-mark/hooks';

function PaymentButton() {
  const { execute, isPending, disabled, style, physics } = useSigilMutation({
    mutation: (amount) => api.pay(amount),
    onSuccess: () => toast.success('Payment complete!'),
  });

  return (
    <button
      onClick={() => execute(100)}
      disabled={disabled}
      style={style}
    >
      {isPending ? 'Processing...' : 'Pay $100'}
    </button>
  );
}
```

### Physics Auto-Resolution

| Zone | Sync | Timing | Disabled While Pending |
|------|------|--------|----------------------|
| critical | pessimistic | 800ms (deliberate) | true |
| admin | optimistic | 150ms (snappy) | false |
| marketing | optimistic | 300ms (warm) | false |
| default | optimistic | 300ms (warm) | false |

### Persona Overrides

In critical zone:

| Persona | Timing | Motion |
|---------|--------|--------|
| newcomer | 1200ms (reassuring) | reassuring |
| power_user | 800ms (deliberate) | deliberate |
| accessibility | 0ms (reduced) | reduced |

### API Reference

```tsx
const {
  // State
  status,        // 'idle' | 'pending' | 'confirmed' | 'failed'
  data,          // TData | null
  error,         // Error | null

  // Resolved physics
  physics,       // { sync, timing, easing, disabled_while_pending, vibes }

  // Computed UI state
  disabled,      // boolean (pessimistic sync + pending)
  isPending,     // boolean

  // CSS variables
  style,         // { '--sigil-duration', '--sigil-easing' }

  // Actions
  execute,       // (variables) => Promise<void>
  reset,         // () => void
} = useSigilMutation(config);
```

---

## ESLint Plugin

Three rules for compile-time enforcement:

### enforce-tokens (error)

Prevents arbitrary Tailwind values:

```jsx
// Error: Use token value instead of arbitrary value: [13px]
<div className="gap-[13px]">

// OK
<div className="gap-2">
```

### zone-compliance (warn)

Warns when timing doesn't match zone's motion type:

```jsx
// In critical zone (motion: deliberate):
// Warning: Duration 200ms is too fast for critical zone (min: 500ms)
<motion.div animate={{ transition: { duration: 0.2 } }}>

// OK
<motion.div animate={{ transition: { duration: 0.8 } }}>
```

### input-physics (warn)

Warns about missing keyboard navigation in admin zones:

```jsx
// In admin zone:
// Warning: Interactive element should have onKeyDown and tabIndex
<div onClick={handleClick}>

// OK
<div onClick={handleClick} onKeyDown={handleKey} tabIndex={0}>
```

### Configuration

```js
// eslint.config.js
import sigil from 'eslint-plugin-sigil';

export default [
  sigil.configs.recommended,
];
```

---

## Vocabulary Layer

Define product terms for consistent language:

```yaml
# sigil-mark/vocabulary/vocabulary.yaml
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

### In /craft

When generating components, /craft checks vocabulary:
1. If component name matches a term, uses term's recommended physics
2. Surfaces undefined terms as gaps at end of output

---

## Physics Timing Reference

| Motion | Duration | Easing | Use Case |
|--------|----------|--------|----------|
| instant | 0ms | linear | Power user actions |
| snappy | 150ms | ease-out | Admin interfaces |
| warm | 300ms | ease-in-out | Marketing, default |
| deliberate | 800ms | ease-out | Critical zone base |
| reassuring | 1200ms | ease-in-out | Newcomer in critical |
| celebratory | 1200ms | bouncy | Success moments |
| reduced | 0ms | linear | Accessibility |

---

## Remote Soul (Optional)

Marketing-controlled vibes via LaunchDarkly:

### Kernel (Engineering-Locked)

- physics (all motion timings)
- sync (pessimistic/optimistic/hybrid)
- protected_zones (critical zone config)
- persona_overrides.accessibility

### Vibe (Marketing-Controlled)

- seasonal_theme
- color_temp
- hero_energy
- warmth_level
- celebration_intensity
- timing_modifier (0.5-2.0 multiplier)

### Usage

```tsx
<SigilProvider
  persona={persona}
  remoteConfigProvider="launchdarkly"
  remoteConfigKey="sigil-vibes"
>
  <App />
</SigilProvider>
```

See `docs/MARKETING-VIBES.md` for full setup.

---

## Process Layer (Agent-Only)

**IMPORTANT**: The Process layer (`sigil-mark/process`) is AGENT-ONLY.

- Uses Node.js `fs` to read YAML files
- Cannot run in browsers
- Runtime hooks were REMOVED in v4.1

For runtime context, use SigilProvider from `sigil-mark/providers`.

See `MIGRATION-v4.1.md` for migration guide.

---

## Philosophy

> "Sweat the art. We handle the mechanics. Return to flow."

### Decision Hierarchy

When concerns conflict:

| Conflict | Winner | Rationale |
|----------|--------|-----------|
| Trust vs Speed | Trust | Speed can be recovered. Trust cannot. |
| Newcomer vs Power User | Newcomer safety | Power users can customize. |
| Marketing vs Security | Security | Constitution exists for a reason. |

### Agent Role

The agent:
- Presents options with tradeoffs
- Does NOT make taste decisions
- Respects locked decisions
- Cites philosophy when relevant
- Surfaces gaps at end of output

---

## Deprecation Warnings

| Deprecated | Replacement | Message |
|------------|-------------|---------|
| useCriticalAction | useSigilMutation | "Use useSigilMutation for auto-resolved physics" |
| ProcessContextProvider | SigilProvider | "Process layer is agent-only" |
| useProcessContext | useSigilZoneContext | "Use SigilProvider hooks" |
| /setup | (automatic) | "Setup is automatic" |
| /inherit | /envision | "/envision auto-detects existing codebase" |

See `MIGRATION-v4.1.md` for full migration guide.

---

## Coexistence with Loa

Sigil and Loa can coexist. They have separate:
- State zones (sigil-mark/ vs loa-grimoire/)
- Config files (.sigilrc.yaml vs .loa.config.yaml)
- Skills (design-focused vs workflow-focused)

No automatic cross-loading - developer decides when to reference design context.

---

*Sigil v4.1.0 "Living Guardrails"*
*Last Updated: 2026-01-07*
