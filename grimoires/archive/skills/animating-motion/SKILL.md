# Animating Motion Skill

Apply animation physics to components. Animation = how it moves.

---

## Core Principle

```
Feel adjective → Spring/easing values → Animation code
```

Animation makes physics visible. The timing and curve communicate the weight of an action.

---

## Workflow

### Step 1: Read Component

Identify:
- Animation library used (framer-motion, react-spring, CSS)
- Current easing/spring settings
- Duration values
- Entrance/exit animations
- Reduced motion handling

### Step 2: Parse Animation Intent

| Keyword | Action |
|---------|--------|
| snappier, faster | Increase stiffness, reduce duration |
| organic, natural | Lower stiffness, moderate damping |
| bouncier | Lower damping (min 15) |
| stiffer, mechanical | Higher damping, or ease-out |
| smoother | Use ease-in-out instead of spring |
| slower, deliberate | Increase duration, lower stiffness |
| instant, none | Remove animation (0ms) |

### Step 3: Show Animation Analysis

```
┌─ Animation Analysis ───────────────────────────────────┐
│                                                        │
│  Component:    [ComponentName]                         │
│  Library:      [framer-motion/react-spring/CSS]        │
│                                                        │
│  Current:                                              │
│  Easing:       [spring/ease-out/etc]                   │
│  Values:       [stiffness, damping] or [duration]      │
│  Feel:         [~Xms perceived duration]               │
│                                                        │
│  Proposed:                                             │
│  Easing:       [spring/ease-out/etc]                   │
│  Values:       [new stiffness, damping] or [duration]  │
│  Feel:         [~Xms perceived duration]               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 4: Apply Animation Changes

Only modify animation-related code:
- `transition` props
- `animate` / `initial` / `exit` values
- Spring stiffness/damping
- Duration values
- Easing functions

Ensure reduced motion fallback:
```tsx
const prefersReducedMotion = useReducedMotion?.() ?? false
const transition = prefersReducedMotion
  ? { duration: 0 }
  : { type: 'spring', stiffness: 700, damping: 35 }
```

### Step 5: Collect Feedback

> "Does the motion match how this action should feel?"

Listen for motion language:
- "feels sluggish" → increase stiffness
- "feels rushed" → decrease stiffness
- "feels robotic" → switch to spring
- "feels wobbly" → increase damping

### Step 6: Log Taste Signal

```markdown
## [YYYY-MM-DD HH:MM] | [SIGNAL]
Component: [name]
Layer: Animation
Values: spring([stiffness],[damping]) or ease-[type] [duration]
---
```

---

## Animation Quick Reference

| Feel | Spring | Perceived |
|------|--------|-----------|
| Snappy | stiffness: 700, damping: 35 | ~100ms |
| Responsive | stiffness: 500, damping: 30 | ~200ms |
| Organic | stiffness: 300, damping: 25 | ~300ms |
| Deliberate | stiffness: 200, damping: 30 | ~500ms |

---

## Easing Blueprint

| Easing | When to Use |
|--------|-------------|
| ease-out | Elements ENTERING the screen |
| ease-in-out | Elements MORPHING on screen |
| spring | Organic, interruptible motion |
| linear | ONLY marquees, progress bars |
| ease-in | AVOID — feels sluggish |

---

## Frequency Rule

| Frequency | Duration |
|-----------|----------|
| High (50+/day) | 0ms — animation is friction |
| Medium (multi/session) | 150-200ms |
| Low (occasional) | 200-300ms |
| Financial/Destructive | 600-800ms |

---

## When NOT to Use /animate

- **Behavior is wrong**: Use `/behavior`
- **Styling is wrong**: Use `/style`
- **Everything is wrong**: Use `/craft`
- **Single value change**: Use Edit tool directly

Rule: /animate is for motion physics only.
