# Physics Defaults

Default animation parameters by feel pattern. Use for Gold-tier interactive components.

---

## Spring Parameters

Format: `spring(tension, friction)` with optional `delay` in milliseconds.

### By Feel

| Feel | Tension | Friction | Delay | Description |
|------|---------|----------|-------|-------------|
| **Heavy & deliberate** | 120 | 14 | 200ms | Weighty, considered |
| **Light & snappy** | 200 | 20 | 0ms | Quick, responsive |
| **Calm & reassuring** | 80 | 12 | 100ms | Soft, gentle |
| **Playful & delightful** | 150 | 18 | 50ms | Bouncy, fun |

### By Component Type

| Type | Tension | Friction | Delay | Notes |
|------|---------|----------|-------|-------|
| **Button** | 180 | 20 | 0ms | Immediate feedback |
| **Modal** | 120 | 14 | 100ms | Deliberate appearance |
| **Toast** | 200 | 22 | 0ms | Quick in/out |
| **Loader** | 100 | 10 | 200ms | Patient, calm |
| **Card** | 150 | 16 | 50ms | Responsive hover |
| **Input** | 200 | 24 | 0ms | Snappy focus |

---

## Preset Configurations

### Snappy Spring
```json
{
  "type": "spring",
  "tension": 200,
  "friction": 20,
  "delay": 0
}
```
Best for: Buttons, inputs, toggles, quick interactions

### Heavy Spring
```json
{
  "type": "spring",
  "tension": 120,
  "friction": 14,
  "delay": 200
}
```
Best for: Transactions, confirmations, important actions

### Gentle Spring
```json
{
  "type": "spring",
  "tension": 80,
  "friction": 12,
  "delay": 100
}
```
Best for: Loaders, progress, background animations

### Bouncy Spring
```json
{
  "type": "spring",
  "tension": 150,
  "friction": 10,
  "delay": 0
}
```
Best for: Celebrations, rewards, success states

---

## Usage in JSDoc

```typescript
/**
 * @component ClaimButton
 * @feel Heavy, deliberate
 * @physics {"type":"spring","tension":120,"friction":14,"delay":200}
 * @tier gold
 */
```

---

## Mapping Feel to Physics

When graduating a Silver component to Gold:

1. **Identify the feel** from the `@feel` tag
2. **Select matching physics** from the table above
3. **Adjust delay** based on context:
   - 0ms: Immediate interactions (clicks, hovers)
   - 50-100ms: Transitions (modals, panels)
   - 150-200ms: Important actions (transactions)
4. **Test the feel** - physics should reinforce the emotional quality

---

## Custom Physics

For components that don't fit presets:

```yaml
question: "What are the physics parameters for this component?"
header: "Physics"
options:
  - label: "Snappy spring"
    description: "spring(200, 20) - Quick response"
  - label: "Heavy spring"
    description: "spring(120, 14) - Weighty feel"
  - label: "Gentle spring"
    description: "spring(80, 12) - Soft, calm"
  - label: "Custom"
    description: "Specify custom parameters"
```

When "Custom" selected, prompt for:
- Tension (60-300, higher = faster)
- Friction (8-30, higher = less bouncy)
- Delay (0-500ms)

---

## Physics Libraries

Sigil physics work with:
- **Framer Motion**: `spring` config object
- **React Spring**: `useSpring` config
- **Motion One**: `spring()` function
- **CSS**: `cubic-bezier()` approximation

### Framer Motion Example
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 120, damping: 14 }}
>
  Claim
</motion.button>
```

### React Spring Example
```tsx
const props = useSpring({
  config: { tension: 120, friction: 14 },
  delay: 200,
  ...
})
```
