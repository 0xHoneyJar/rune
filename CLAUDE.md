# Sigil: Design Context Framework

> "Make the right path easy. Make the wrong path visible. Don't make the wrong path impossible."

## What is Sigil?

Sigil is a design context framework that helps AI agents make consistent design decisions by:

1. **Providing zone context** - Knowing if you're in "critical" vs "marketing" context
2. **Surfacing design rules** - Colors, typography, spacing, motion patterns
3. **Capturing product feel** - Moodboard with references and anti-patterns
4. **Human accountability** - All validation is human approval, not automation

---

## The Seven Laws

1. **Filesystem is Truth** - Never use cached indexes. Always live grep.
2. **Type Dictates Physics** - Money → server-tick, Task → crdt, Toggle → local-first.
3. **Zone is Layout, Not Business Logic** - Zone determines feel, not behavior.
4. **Status Propagates** - Your tier is only as good as your weakest dependency.
5. **One Good Reason > 15% Silent Mutiny** - Capture bypasses, don't block them.
6. **Never Refuse Outright** - Always offer COMPLY / BYPASS / AMEND.
7. **Let Artists Stay in Flow** - Never auto-fix on save. Polish is deliberate.

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

### Commands (v5.0)

| Command | Purpose | Description |
|---------|---------|-------------|
| `/envision` | Capture product moodboard | Interview to capture feel, references, anti-patterns |
| `/codify` | Define design rules | Define zone constraints and motion patterns |
| `/craft` | Get design guidance | Auto-context aware generation |
| `/observe` | Visual feedback loop | Capture screen for drift detection |
| `/refine` | Incremental updates | Update personas, zones, vocabulary |
| `/consult` | Record decisions | Lock decisions with expiry |
| `/garden` | Health monitoring | Run all audits (cohesion + timing + propagation) |
| `/polish` | JIT standardization | Scan violations, generate diffs, apply on approval |
| `/amend` | Constitution change | Propose changes to constitution rules |

### v5.0 Command Details

| Command | Basic | Options |
|---------|-------|---------|
| `/garden` | Run all audits | `--drift` (visual only) |
| `/polish` | Show violations | `--check`, `--apply`, `--staged` |
| `/amend <rule>` | Create proposal | `--change`, `--reason`, `--author` |

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

## v5.0 Component Discovery (Scanning Sanctuary)

### Law: "Filesystem is Truth"

**NEVER use cached component indexes.** Always use live ripgrep.

Why:
- Branch switches don't update caches
- Uncommitted changes are invisible to cached indexes
- Deleted files still appear in stale caches
- ripgrep < 50ms is faster than cache lookup + validation

### JSDoc Pragmas

Add these pragmas to components for discovery:

```typescript
/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-data-type Money
 * ClaimButton - Handles claim transactions
 */
```

| Pragma | Values | Purpose |
|--------|--------|---------|
| `@sigil-tier` | gold, silver, bronze, draft | Component quality tier |
| `@sigil-zone` | critical, glass, machinery, standard | Physics zone |
| `@sigil-data-type` | Money, Health, Task, etc. | Data type for physics |

### Ripgrep Commands

Find components by tier:
```bash
rg "@sigil-tier gold" -l --type ts
```

Find components by zone:
```bash
rg "@sigil-zone critical" -l --type ts
```

Find components by data type:
```bash
rg "@sigil-data-type Money" -l --type ts
```

Combined search (Gold tier in critical zone):
```bash
rg "@sigil-tier gold" -l --type ts | xargs rg "@sigil-zone critical" -l
```

### Anti-Patterns

| DO NOT | Why |
|--------|-----|
| Use `sigil.map` | Becomes stale on branch switch |
| Use `.sigil-cache` | Can hallucinate deleted components |
| Use component registries | Need manual sync with filesystem |
| Trust prebuilt indexes | Git history doesn't update them |

### Performance

- Target: < 50ms for 10k files
- Use `-l` for file paths only (faster)
- Use `--type ts` to limit to TypeScript
- Use `-g 'src/**'` to limit search scope

---

## v5.0 JIT Polish Workflow

### Law: "Never Auto-fix on Save"

**NEVER configure auto-formatting that fixes Sigil violations on save.**

Why:
- Messy code IS debugging context
- `border: 1px solid red;` is a valid debugging technique
- Auto-fix removes debugging state before developer can use it
- Breaking flow destroys productivity and trust

### /polish Command

```bash
# Show violations with suggested fixes
npx sigil polish

# Check mode (CI/pre-commit) - exits non-zero if errors
npx sigil polish --check

# Check staged files only
npx sigil polish --check --staged

# Apply fixes after review
npx sigil polish --apply

# Target specific files
npx sigil polish --files 'src/components/**/*.tsx'
```

### Workflow

1. **Scan** - Find taste violations against fidelity/constitution
2. **Generate** - Create fix diff for each violation
3. **Present** - Show before/after diff
4. **Apply** - ONLY on explicit user approval

### Violation Types

| Type | Severity | Examples |
|------|----------|----------|
| ergonomic | error | hitbox < 44px, missing focus ring |
| constitution | error | wrong physics for data type |
| fidelity | warning | animation duration exceeded |
| cohesion | warning | shadow mismatch with neighbors |

### Pre-commit Hook

```bash
# Install hook
./sigil-mark/scripts/install-hooks.sh

# Or manually:
npx husky add .husky/pre-commit "npx sigil polish --check --staged"
```

### Anti-Patterns

| DO NOT | Why |
|--------|-----|
| Configure ESLint auto-fix for Sigil rules | Breaks debugging flow |
| Configure Prettier to fix on save | Removes debugging context |
| Block commits without showing fixes | Developer loses state |
| Auto-apply fixes silently | Surprise changes cause distrust |

---

## v5.0 Status Propagation & Negotiation

### Status Propagation Rule

**Law: Your status is only as good as your weakest dependency.**

```
Tier(Component) = min(DeclaredTier, Tier(Dependencies))
```

If a `@sigil-tier gold` component imports a `@sigil-tier draft` component, its effective tier becomes `draft`.

```typescript
import { analyzeComponentStatus } from 'sigil-mark/process';

const status = analyzeComponentStatus('src/components/ClaimButton.tsx');
if (status.downgrade) {
  console.log('Downgrade:', status.warnings);
  // ⚠️ Tier downgrade: gold → draft due to import of ./DraftHelper (tier: draft)
}
```

### Tier Hierarchy

| Tier | Priority | Description |
|------|----------|-------------|
| gold | 4 (highest) | Production-ready, fully tested |
| silver | 3 | Reviewed, minor gaps |
| bronze | 2 | Functional, needs polish |
| draft | 1 (lowest) | Work in progress |

### Scanning for Downgrades

```bash
# Find all components with tier downgrades
import { scanStatusPropagation } from 'sigil-mark/process';

const issues = scanStatusPropagation();
for (const issue of issues) {
  console.log(`${issue.file}: ${issue.declaredTier} → ${issue.effectiveTier}`);
}
```

### Negotiating Integrity

When a request conflicts with the Constitution, **never refuse outright**. Present options:

```
This request conflicts with the Constitution.

VIOLATION: Using useOptimistic with Money type
ARTICLE: constitution.financial.forbidden[0]
RISK: critical

OPTIONS:
1. COMPLY - Use useSigilMutation with simulation flow
2. BYPASS - Override with justification (will be logged)
3. AMEND - Propose constitution change

Which do you prefer?
```

### BYPASS Option

Overrides are logged to `governance/justifications.log`:

```typescript
import { handleBypass } from 'sigil-mark/process';

const { comment, logged } = handleBypass(
  {
    file: 'src/features/swap/SwapPanel.tsx',
    article: 'constitution.financial.forbidden[0]',
    violation: 'Using useOptimistic with Money type',
    risk: 'critical',
  },
  'Demo account, no real funds at risk',
  { author: '@zksoju' }
);

// Adds to code:
// @sigil-override: constitution.financial.forbidden[0]
// Reason: Demo account, no real funds at risk
// Author: @zksoju
// Date: 2026-01-08
```

### AMEND Option

Creates an amendment proposal in `governance/amendments/`:

```typescript
import { handleAmend } from 'sigil-mark/process';

const proposal = handleAmend(
  context,
  'Allow useOptimistic for demo accounts with isDemoAccount flag',
  'Demo accounts have no real funds at risk',
  { author: '@zksoju' }
);
// Creates: governance/amendments/AMEND-2026-001.yaml
```

### Governance Files

| Path | Purpose |
|------|---------|
| `governance/justifications.log` | Append-only log of all BYPASS overrides |
| `governance/amendments/*.yaml` | Amendment proposals with status tracking |

### Anti-Patterns

| DO NOT | Why |
|--------|-----|
| Refuse requests outright | User disables the tool |
| Skip justification capture | We lose learning opportunity |
| Auto-approve bypasses | Defeats accountability purpose |
| Block without options | Always offer COMPLY/BYPASS/AMEND |

---

## v5.0 Garden Command

### System Health Check

The `/garden` command runs all audits and returns a health report:

```typescript
import { garden, formatGardenResult } from 'sigil-mark/process';

const result = await garden();
console.log(formatGardenResult(result));
// # Garden Health Report
// **Scanned:** 47 components
// **Health Score:** 85%
//
// ## Summary
// - Errors: 2
// - Warnings: 7
// - Info: 3
```

### What Garden Checks

| Audit | Category | Severity |
|-------|----------|----------|
| Fidelity ceiling violations | fidelity | warning/error |
| Cohesion variances | cohesion | warning |
| Timing anti-patterns | timing | warning |
| Status propagation | propagation | warning |

### CLI Usage

```bash
# Full garden check
npx sigil garden

# Visual drift only
npx sigil garden --drift
```

---

## v5.0 Amend Command

### Constitution Amendment Proposals

The `/amend` command creates formal proposals to change constitution rules:

```typescript
import { amend, formatAmendResult } from 'sigil-mark/process';

const result = amend(
  'constitution.financial.forbidden[0]',
  'Allow useOptimistic for demo accounts with isDemoAccount flag',
  'Demo accounts have no real funds at risk',
  { author: '@zksoju' }
);

console.log(formatAmendResult(result));
// # Amendment Proposal Created
// **ID:** AMEND-2026-001
// **File:** sigil-mark/governance/amendments/AMEND-2026-001.yaml
```

### Amendment Workflow

1. **Propose** - `/amend` creates proposal in `governance/amendments/`
2. **Review** - Stakeholders review the proposal
3. **Discussion** - 1 week minimum discussion period
4. **Decision** - Update status to `approved` or `rejected`
5. **Apply** - If approved, update `constitution.yaml`

### CLI Usage

```bash
# List pending amendments
npx sigil amend --list

# Create new amendment
npx sigil amend constitution.financial.forbidden[0] \
  --change "Allow useOptimistic for demo accounts" \
  --reason "Demo accounts have no real funds" \
  --author "@zksoju"
```

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

*Sigil v5.0.0 "The Lucid Flow"*
*Last Updated: 2026-01-08*
