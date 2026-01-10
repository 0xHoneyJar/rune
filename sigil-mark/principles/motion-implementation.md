# Motion Implementation Principles

> Based on Emil Kowalski's approach: CSS animations by default, Framer Motion when needed.

## Decision Tree

```
Need animation?
├── Simple state change (hover, focus, appear)?
│   └── CSS transitions ✓
├── Needs orchestration (stagger, sequence)?
│   └── Framer Motion
├── Needs spring physics?
│   └── Framer Motion
├── Needs gesture (drag, pan)?
│   └── Framer Motion
├── Layout animation (shared layout)?
│   └── Framer Motion
└── Exit animation (AnimatePresence)?
    └── Framer Motion
```

## CSS First (90% of cases)

Most animations don't need a library:

```css
/* Hover states */
.button {
  transition: transform 150ms ease-out, background-color 150ms ease-out;
}
.button:hover {
  transform: scale(1.02);
}

/* Appear on load */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.card {
  animation: fade-in 300ms ease-out;
}

/* Skeleton pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Why CSS First

- **Zero bundle cost** - no JS shipped
- **GPU accelerated** - browser optimizes
- **No hydration flash** - works before React
- **Simpler mental model** - fewer abstractions

## Framer Motion (10% of cases)

Use when CSS can't do it:

### 1. Exit Animations

CSS can't animate elements being removed:

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### 2. Spring Physics

When you need natural, interruptible motion:

```tsx
<motion.div
  animate={{ scale: isPressed ? 0.95 : 1 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>
```

### 3. Staggered Children

Orchestrating multiple elements:

```tsx
<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={child} />
  ))}
</motion.ul>
```

### 4. Gestures

Drag, pan, tap interactions:

```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
  whileTap={{ scale: 0.95 }}
/>
```

### 5. Layout Animations

Animating layout changes (reordering, resize):

```tsx
<motion.div layout layoutId="shared-element" />
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using Framer for hover states | CSS `:hover` with transition |
| Using Framer for simple fades | CSS `@keyframes` or transition |
| Not using `will-change` | Add for complex animations |
| Animating `width`/`height` | Use `transform: scale()` instead |
| Animating `top`/`left` | Use `transform: translate()` |

## CSS Animation Patterns

### Keyframe Animations

```css
/* Fade in with slide */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (loading indicator) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin (loading spinner) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Scale pop */
@keyframes pop {
  0% { transform: scale(0.95); opacity: 0; }
  70% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}
```

### Transition Patterns

```css
/* Smooth hover */
.button {
  transition:
    transform 150ms ease-out,
    background-color 150ms ease-out,
    box-shadow 150ms ease-out;
}
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.button:active {
  transform: translateY(0);
  transition-duration: 50ms;  /* Faster on press */
}

/* Focus ring */
.interactive {
  transition: outline-offset 150ms ease-out;
  outline: 2px solid transparent;
}
.interactive:focus-visible {
  outline-color: var(--focus-color);
  outline-offset: 2px;
}

/* Accordion expand */
.content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-out;
}
.content.open {
  grid-template-rows: 1fr;
}
.content > div {
  overflow: hidden;
}
```

---

## Framer Motion Patterns

### Variants (Reusable Animations)

```tsx
// Define variants outside component
const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Use in component
<motion.ul
  initial="hidden"
  animate="visible"
  variants={stagger}
>
  {items.map(item => (
    <motion.li key={item.id} variants={fadeInUp} />
  ))}
</motion.ul>
```

### Gesture Patterns

```tsx
// Press feedback
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>

// Drag with constraints
<motion.div
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
/>

// Swipe to dismiss
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss();
    }
  }}
/>
```

### Layout Animations

```tsx
// Auto-animate layout changes
<motion.div layout>
  {isExpanded ? <ExpandedContent /> : <CollapsedContent />}
</motion.div>

// Shared element transitions
<motion.div layoutId="card-image">
  <img src={image} />
</motion.div>

// Layout with spring
<motion.div
  layout
  transition={{
    layout: { type: "spring", stiffness: 300, damping: 30 },
  }}
/>
```

### Exit Animations

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    />
  )}
</AnimatePresence>
```

---

## Performance Tips

### Compositor-Only Properties

```css
/* GOOD: GPU-accelerated, no layout/paint */
transform: translate(), scale(), rotate()
opacity: 0-1

/* AVOID: Triggers layout */
width, height
top, right, bottom, left
margin, padding
font-size

/* AVOID: Triggers paint */
background-color
border-color
box-shadow (sometimes OK)
```

### will-change Usage

```css
/* Only add before animation starts */
.element {
  will-change: auto;  /* Default */
}
.element.animating {
  will-change: transform, opacity;
}

/* Remove after animation completes */
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});

/* DON'T: Apply to everything */
/* BAD: * { will-change: transform; } */
```

### Framer Motion Performance

```tsx
// Use layout="position" for better perf (only animates position)
<motion.div layout="position" />

// Disable layout animation when not needed
<motion.div layout={shouldAnimate} />

// Use hardware acceleration
<motion.div
  style={{ x, y }}  /* Uses transform internally */
  initial={false}   /* Skip initial animation */
/>
```

---

## Reduced Motion

### CSS Approach

```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Or selectively disable */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

### Framer Motion Approach

```tsx
// Global setting
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>

// Per-component
<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: prefersReducedMotion ? 0 : 0.3,
  }}
/>

// Hook usage
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
    />
  );
}
```

### Testing Reduced Motion

```bash
# macOS: System Preferences > Accessibility > Display > Reduce motion
# Chrome DevTools: Rendering > Emulate CSS media > prefers-reduced-motion
```

---

## Timing Reference

### Sigil Physics Mapping

| Physics | Duration | Easing | Use Case |
|---------|----------|--------|----------|
| server-tick | 600ms | ease-out | Critical actions |
| deliberate | 800ms | cubic-bezier(0.4, 0, 0.2, 1) | Important actions |
| snappy | 150ms | ease-out | UI feedback |
| smooth | 300ms | ease-in-out | Transitions |

### Common Durations

| Duration | Feel | Use |
|----------|------|-----|
| 50-100ms | Instant | Button press, micro-feedback |
| 150-200ms | Snappy | Hovers, toggles |
| 250-350ms | Smooth | Page transitions, modals |
| 400-600ms | Deliberate | Important state changes |
| 800ms+ | Dramatic | Celebratory, onboarding |

---

## References

- Emil Kowalski - [animations.dev](https://animations.dev)
- Josh Comeau - [CSS animation guides](https://www.joshwcomeau.com/animation/css-transitions/)
- Framer Motion docs - [framer.com/motion](https://www.framer.com/motion/)
- Web.dev - [animations guide](https://web.dev/animations-guide/)

---

*Last updated: 2026-01-09*
*Drop more expert references in this folder as you find them.*
