# Sigil: Animation Physics

Animation is how physics becomes visible. The timing, curve, and behavior of an animation communicates the weight of an action.

## The Easing Blueprint

| Easing | When to Use | Why |
|--------|-------------|-----|
| **ease-out** | Elements ENTERING the screen | Fast start feels responsive, slow end feels settled |
| **ease-in-out** | Elements MORPHING on screen | Natural acceleration/deceleration like a car |
| **spring** | Organic, interruptible motion | Physics-based, no fixed duration, natural feel |
| **linear** | ONLY marquees, progress bars, timers | Constant speed for time visualization |
| **ease-in** | AVOID | Slow start makes UI feel sluggish |

**Why ease-out feels faster**: At the same duration, ease-out feels ~30% faster than ease-in because the initial acceleration gives immediate feedback.

## Timing by Frequency

The more often an animation is seen, the faster it should be (or removed entirely).

| Frequency | Examples | Duration | Rationale |
|-----------|----------|----------|-----------|
| **High (50+/day)** | Command palette, keyboard nav, frequent hovers | 0ms | Animation becomes friction |
| **Medium (multi/session)** | Dropdowns, tooltips, tabs | 150-200ms | Fast but noticeable |
| **Low (occasional)** | Modals, dialogs, state transitions | 200-300ms | Can afford deliberate feel |
| **Rare (once/session)** | Feedback morphs, celebrations | 300-500ms | Delight is acceptable |
| **Financial/Destructive** | Claim, withdraw, delete | 600-800ms | Weight communicates importance |

**The Raycast principle**: For tools used hundreds of times daily, the best animation is no animation.

## Spring Animation Values

Springs feel more natural than CSS easings because they're physics-based and interruptible.

```
SNAPPY (local state, toggles)
stiffness: 700, damping: 35
Perceptual duration: ~100ms

RESPONSIVE (standard mutations)
stiffness: 500, damping: 30
Perceptual duration: ~200ms

ORGANIC (drag gestures, morphs)
stiffness: 300, damping: 25
Perceptual duration: ~300ms

DELIBERATE (financial, important)
stiffness: 200, damping: 30
Perceptual duration: ~500ms
```

**Bounce**: Avoid in most cases. Reserve small bounce values (0.1) only for drag gesture releases where physical force was applied.

## The Complete Table

| Effect | Sync | Timing | Easing | Interrupt | Blur |
|--------|------|--------|--------|-----------|------|
| Financial | Pessimistic | 800ms | ease-out | No | Optional |
| Destructive | Pessimistic | 600ms | ease-out | No | No |
| Soft Delete | Optimistic | 200ms | spring(500) | Yes | No |
| Standard | Optimistic | 200ms | spring(500) | Yes | Optional |
| Navigation | Immediate | 150ms | ease | Yes | No |
| Local State | Immediate | 100ms | spring(700) | Yes | No |
| Keyboard Nav | Immediate | 0ms | none | N/A | No |
| High-freq Hover | Immediate | 0ms | none | N/A | No |

## Entrance vs Exit Asymmetry

Entrances deserve attention (new information). Exits should get out of the way.

```
ENTRANCE (full attention)
opacity: 0 → 1
y: 8px → 0
duration: 300ms
easing: ease-out

EXIT (quicker, less attention)
opacity: 1 → 0
y: 0 → -4px
duration: 150ms
easing: ease-in
```

## Details That Elevate

### Blur
Fills the visual gap between states, makes motion feel smoother. Use sparingly (max 20px for Safari performance).

### Stagger/Orchestration
Sequential reveals create a wave effect. Delay between items should be 30-50ms. Too much stagger slows down interaction.

### Scale on Press
Subtle scale down (0.97-0.98) on button press provides immediate tactile feedback before the actual action completes.

### Reduced Motion
Always respect `prefers-reduced-motion`. Non-negotiable accessibility requirement.

```tsx
const prefersReducedMotion = useReducedMotion()
const transition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.3, ease: "easeOut" }
```

## Performance Rules

### Animate Only Transform and Opacity
These properties skip layout recalculation and can be GPU-accelerated.

```
SAFE (composite only)
transform: translate, scale, rotate
opacity

AVOID (triggers layout)
width, height, padding, margin
top, left, right, bottom
```

### Hardware Acceleration
Use `will-change: transform` for animations that need to stay smooth under load.

### CSS vs JavaScript
- CSS animations: Hardware-accelerated, won't drop frames under load
- JS animations (requestAnimationFrame): Can drop frames if main thread busy
- Use CSS for simple animations, JS libraries for springs and complex orchestration

### React Performance
Animate outside React's render cycle. Avoid updating state on every animation frame.

## Animation Communicates Brand

| Brand Feel | Animation Approach |
|------------|-------------------|
| Premium/Reliable | Slower (400-600ms), deliberate ease-out |
| Fast/Efficient | Instant (0-150ms), or no animation |
| Elegant/Polished | Slightly slower ease curves, subtle blur |
| Playful/Fun | Springs with subtle bounce, stagger effects |

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| ease-in on UI elements | Feels sluggish | Use ease-out |
| linear on UI elements | Feels robotic | Use ease-out or spring |
| Animating padding/margin | Layout recalc, jank | Use transform |
| Animation on keyboard nav | Feels disconnected from input | Use 0ms |
| Bounce on everything | Unprofessional, distracting | Reserve for drag releases |
| Same timing regardless of frequency | High-freq feels slow | Scale by frequency |
| Spinner during financial ops | Uncertainty, rage-clicking | Staged progress with copy |
| blur > 20px | Safari performance issues | Cap at 20px |

## Purpose Check

Before adding animation, ask:

1. **What's the purpose?** (Feedback, transition, delight, explanation)
2. **How often will users see it?** (High frequency = less or no animation)
3. **Does it improve or impede the goal?** (Users want to complete tasks, not be delighted)
4. **Would removing it make things worse?** (If not, remove it)

**The goal is not to animate for animation's sake. The best interfaces sometimes have no animation at all.**
