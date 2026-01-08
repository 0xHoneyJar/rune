# Marketing Vibes Guide

> "Marketing controls the feel. Engineering controls the physics."

This guide explains how marketing teams can use remote configuration to control product "vibes" without affecting core UX physics.

---

## The Kernel vs Vibe Boundary

Sigil divides configuration into two categories:

### Kernel (Engineering-Controlled)

These are NEVER exposed to remote config. Marketing must request changes through `/consult` decisions.

| Property | Why Protected |
|----------|---------------|
| `physics.*` | Inconsistent animation timing creates jarring UX |
| `sync.*` | Wrong sync strategy causes data loss |
| `zones.critical.*` | Critical zones handle money, cannot be A/B tested |
| `persona_overrides.accessibility.*` | Accessibility must be stable |

**To change kernel properties:**
```
/consult "Proposal: Increase deliberate timing to 1000ms"
```

### Vibes (Marketing-Controlled)

These CAN be controlled via LaunchDarkly/Statsig. Marketing can A/B test freely.

| Property | Description | Valid Values |
|----------|-------------|--------------|
| `seasonal_theme` | Visual theme for campaigns | `default`, `summer`, `winter`, `spring`, `fall` |
| `color_temp` | Color temperature | `warm`, `cool`, `neutral` |
| `hero_energy` | Hero section animation intensity | `playful`, `professional` |
| `warmth` | Onboarding friendliness | `friendly`, `direct` |
| `celebration_intensity` | Success moment intensity | `subtle`, `triumphant` |
| `timing_modifier` | Global timing multiplier | `0.5` - `2.0` |

---

## LaunchDarkly Setup

### 1. Create Feature Flags

Create these flags in LaunchDarkly (or your provider):

| Flag Key | Type | Default | Description |
|----------|------|---------|-------------|
| `sigil-seasonal-theme` | String | `default` | Current seasonal theme |
| `sigil-color-temp` | String | `neutral` | Color temperature |
| `sigil-hero-energy` | String | `professional` | Hero energy level |
| `sigil-onboarding-warmth` | String | `friendly` | Onboarding warmth |
| `sigil-celebration-intensity` | String | `subtle` | Celebration intensity |
| `sigil-timing-modifier` | Number | `1.0` | Timing multiplier |

### 2. Configure SigilProvider

```tsx
// app/providers.tsx
import { SigilProvider } from 'sigil-mark/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SigilProvider
      persona={detectUserPersona()}
      remoteConfigKey={process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID}
      remoteConfigProvider="launchdarkly"
      remoteConfigUser={{ key: userId, custom: { plan: userPlan } }}
      localVibes={{
        // Fallback if LaunchDarkly unavailable
        seasonal_theme: 'default',
        timing_modifier: 1.0,
      }}
    >
      {children}
    </SigilProvider>
  );
}
```

### 3. Use Vibes in Components

```tsx
import { useSigilRemoteSoulContext } from 'sigil-mark/providers';

function HeroSection() {
  const { vibes, isFallback } = useSigilRemoteSoulContext();

  return (
    <section
      data-theme={vibes.seasonal_theme}
      data-energy={vibes.hero_energy}
    >
      {/* Conditional styling based on vibes */}
      <h1 className={vibes.hero_energy === 'playful' ? 'animate-bounce' : ''}>
        Welcome
      </h1>

      {isFallback && (
        <span className="text-xs text-gray-400">
          Using default configuration
        </span>
      )}
    </section>
  );
}
```

---

## Available Vibe Flags

### `seasonal_theme`

Controls the overall visual theme for campaigns.

| Value | Description | Use Case |
|-------|-------------|----------|
| `default` | Standard product look | Year-round |
| `summer` | Warm, golden tones | Summer campaigns |
| `winter` | Cool, crisp tones | Winter/holiday |
| `spring` | Fresh, green accents | Spring campaigns |
| `fall` | Warm, amber tones | Fall campaigns |

**Example CSS usage:**
```css
[data-theme="summer"] {
  --accent-hue: 45; /* Golden */
}

[data-theme="winter"] {
  --accent-hue: 200; /* Cool blue */
}
```

### `hero_energy`

Controls animation intensity on marketing pages.

| Value | Description | Behavior |
|-------|-------------|----------|
| `professional` | Subtle, business-like | Minimal animation, clean transitions |
| `playful` | Energetic, engaging | Bouncy animations, more movement |

**Example usage:**
```tsx
const HeroButton = () => {
  const { vibes } = useSigilRemoteSoulContext();

  return (
    <button
      className={cn(
        'transition-transform',
        vibes.hero_energy === 'playful' && 'hover:scale-105 hover:rotate-1'
      )}
    >
      Get Started
    </button>
  );
};
```

### `warmth`

Controls tone in onboarding and interactions.

| Value | Description | Copy Style |
|-------|-------------|------------|
| `friendly` | Encouraging, supportive | "You're doing great!" |
| `direct` | Clear, efficient | "Step 3 of 5" |

**Example usage:**
```tsx
function OnboardingStep({ step }) {
  const { vibes } = useSigilRemoteSoulContext();

  return (
    <div>
      {vibes.warmth === 'friendly' ? (
        <p>You're making great progress! Just a few more steps.</p>
      ) : (
        <p>Step {step.current} of {step.total}</p>
      )}
    </div>
  );
}
```

### `celebration_intensity`

Controls success moment animations.

| Value | Description | Behavior |
|-------|-------------|----------|
| `subtle` | Understated success | Checkmark, brief highlight |
| `triumphant` | Big celebration | Confetti, longer animation |

**Example usage:**
```tsx
function ClaimSuccess() {
  const { vibes } = useSigilRemoteSoulContext();

  return (
    <div>
      {vibes.celebration_intensity === 'triumphant' && <Confetti />}
      <CheckIcon className={
        vibes.celebration_intensity === 'triumphant'
          ? 'animate-bounce text-6xl'
          : 'text-2xl'
      } />
      <p>Claimed successfully!</p>
    </div>
  );
}
```

### `timing_modifier`

Multiplier for all animation timing. Engineering-safe range: 0.5 - 2.0.

| Value | Effect | Use Case |
|-------|--------|----------|
| `0.8` | 20% faster | Snappier feel for tech-savvy audience |
| `1.0` | Normal | Default |
| `1.2` | 20% slower | More deliberate for new users |

**How it works:**
- Applied automatically to all Sigil-managed animations
- Base timing (e.g., 800ms deliberate) * modifier = final timing
- Example: 800ms * 1.2 = 960ms

**Important constraints:**
- Minimum: 0.5 (cannot go faster than 50% of base)
- Maximum: 2.0 (cannot go slower than 200% of base)
- Values outside range are clamped with console warning

---

## Example Campaign Configurations

### Summer Gold Campaign

```json
{
  "sigil-seasonal-theme": "summer",
  "sigil-color-temp": "warm",
  "sigil-hero-energy": "playful",
  "sigil-onboarding-warmth": "friendly",
  "sigil-celebration-intensity": "triumphant",
  "sigil-timing-modifier": 0.9
}
```

**Feel:** Warm, celebratory, energetic

### Enterprise Professional

```json
{
  "sigil-seasonal-theme": "default",
  "sigil-color-temp": "neutral",
  "sigil-hero-energy": "professional",
  "sigil-onboarding-warmth": "direct",
  "sigil-celebration-intensity": "subtle",
  "sigil-timing-modifier": 1.0
}
```

**Feel:** Clean, efficient, business-like

### New User Friendly

```json
{
  "sigil-seasonal-theme": "default",
  "sigil-color-temp": "warm",
  "sigil-hero-energy": "playful",
  "sigil-onboarding-warmth": "friendly",
  "sigil-celebration-intensity": "triumphant",
  "sigil-timing-modifier": 1.2
}
```

**Feel:** Encouraging, patient, celebratory

---

## What Marketing CANNOT Control

These properties are protected by engineering for stability:

### Physics Timing
Marketing cannot change the base timing values:
- `instant`: 0ms
- `snappy`: 150ms
- `warm`: 300ms
- `deliberate`: 800ms
- `reassuring`: 1200ms

The `timing_modifier` can scale these, but cannot redefine them.

### Sync Strategies
Marketing cannot change how data syncs:
- Critical zone always uses `pessimistic` (server-tick)
- Cannot make critical actions optimistic

### Zone Definitions
Marketing cannot:
- Change which paths belong to which zones
- Override critical zone behavior
- Modify accessibility persona settings

### To Request Kernel Changes

Use the `/consult` command:

```
/consult "Proposal: Make hero section use deliberate motion"

Topic: Hero section animation timing
Context: Current hero uses warm (300ms), want deliberate (800ms)
Question: Should we change base motion for hero, or is timing_modifier sufficient?
```

Engineering will review and lock the decision if approved.

---

## Monitoring and Debugging

### Check Current Vibes

```tsx
function DebugVibes() {
  const { vibes, isLoading, isFallback, error } = useSigilRemoteSoulContext();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <pre className="fixed bottom-4 left-4 text-xs bg-black/80 text-green-400 p-2">
      {JSON.stringify({ vibes, isLoading, isFallback, error }, null, 2)}
    </pre>
  );
}
```

### Timeout Behavior

Sigil uses a 100ms timeout for remote config:
- If LaunchDarkly responds within 100ms: Use remote values
- If timeout: Use `localVibes` fallback immediately
- UI never blocks waiting for config

### Error States

| State | `isFallback` | `error` | Behavior |
|-------|--------------|---------|----------|
| Loading | `true` | `null` | Using fallback, fetch in progress |
| Success | `false` | `null` | Using remote values |
| Timeout | `true` | `null` | Using fallback, remote too slow |
| Error | `true` | `Error` | Using fallback, remote failed |

---

## Best Practices

### 1. Always Provide Fallbacks

```tsx
<SigilProvider
  localVibes={{
    seasonal_theme: 'default',
    timing_modifier: 1.0,
    // Always define fallbacks for all vibes you use
  }}
>
```

### 2. Don't Rely on Vibes for Critical UX

Vibes are for feel, not function:
- OK: Change animation bounce
- NOT OK: Change whether button is disabled

### 3. Test Both States

Always test with:
- Remote config available
- Remote config unavailable (fallback)

### 4. Use Data Attributes for CSS

```tsx
// Good: CSS can target data attributes
<div data-theme={vibes.seasonal_theme}>

// Avoid: Inline styles harder to maintain
<div style={{ color: vibes.seasonal_theme === 'summer' ? 'gold' : 'blue' }}>
```

### 5. Document Campaign Intent

When setting up a campaign, document:
- What feeling you're trying to create
- Which vibes you're changing and why
- Expected user perception change

---

## Configuration Reference

See `sigil-mark/remote-soul.yaml` for the complete schema including:
- Kernel locked keys
- Vibe remote keys
- Flag mappings for providers
- Constraints and validation
- Example campaign configurations

---

*Last updated: v4.1.0*
*For technical implementation details, see `sigil-mark/providers/remote-soul.ts`*
