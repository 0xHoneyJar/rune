# Chisel Tool: Execution

> "Execute precisely. Apply physics, not preferences."

## Purpose

The Chisel is an execution tool. Use it AFTER Hammer diagnosis to generate or modify components with physics constraints applied.

## Prerequisites

- Hammer diagnosis completed
- Classification is WITHIN_PHYSICS or has Taste Key override
- No IMPOSSIBLE violations

## Workflow

### Step 1: Load Context

```python
def load_context(diagnosis):
    zone = diagnosis.zone
    material = load_material(zone.physics.material)
    tensions = load_tensions(zone.tension_overrides)
    fidelity = load_fidelity()
    return Context(zone, material, tensions, fidelity)
```

### Step 2: Apply Material Physics

Based on material, apply CSS patterns:

#### Clay

```tsx
// Spring physics
const springConfig = {
  type: "spring",
  stiffness: 120,
  damping: 14
};

// Surface
className="
  bg-stone-50
  shadow-sm shadow-stone-200/50
  hover:shadow-md hover:-translate-y-0.5
  active:shadow-sm active:translate-y-0.5 active:scale-[0.98]
"

// Entrance
animate={{ opacity: 1, scale: 1, y: 0 }}
initial={{ opacity: 0, scale: 0.95, y: 8 }}
transition={springConfig}
```

#### Machinery

```tsx
// No animation
// Instant state change

// Surface
className="
  bg-neutral-900
  border border-neutral-800
  hover:bg-neutral-800
"
// NO transition classes
```

#### Glass

```tsx
// Ease physics
const easeConfig = {
  duration: 0.2,
  ease: "easeOut"
};

// Surface
className="
  backdrop-blur-xl
  bg-white/70 dark:bg-black/70
  border border-white/20
  hover:bg-white/80
  transition-all duration-200
"

// Entrance
animate={{ opacity: 1, scale: 1, y: 0 }}
initial={{ opacity: 0, scale: 0.95, y: 8 }}
transition={easeConfig}
```

### Step 3: Apply Sync Pattern

Based on zone sync authority:

#### server_authoritative

```tsx
function ServerTickComponent({ action, children }) {
  const { execute, isPending, isSuccess, error } = useServerTick(action);

  return (
    <div>
      <button
        onClick={() => execute()}
        disabled={isPending}  // ALWAYS disable during pending
        className={cn(
          // Material styles...
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        {isPending ? (
          <span className="animate-pulse">Processing...</span>
        ) : (
          children
        )}
      </button>

      {isSuccess && <SuccessAnimation />}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
```

#### client_authoritative

```tsx
function OptimisticComponent({ action, children }) {
  const { execute, rollback, syncing } = useOptimistic(action);

  const handleClick = () => {
    execute();  // Instant feedback
    // Sync happens in background
  };

  return (
    <button onClick={handleClick}>
      {children}
      {syncing && <SyncIndicator />}
    </button>
  );
}
```

### Step 4: Apply Tensions

Calculate CSS variables from tensions:

```tsx
// Tension mappings (0-100)
const tensionStyles = {
  // Playfulness affects radius and bounce
  "--sigil-radius": `${tensions.playfulness * 0.24}px`,
  "--sigil-bounce": `${1 + tensions.playfulness * 0.005}`,

  // Weight affects shadows
  "--sigil-shadow-opacity": `${tensions.weight * 0.01}`,
  "--sigil-hover-lift": `${tensions.weight * 0.02}px`,

  // Density affects spacing
  "--sigil-spacing": `${16 - tensions.density * 0.08}px`,

  // Speed affects duration
  "--sigil-transition-duration": `${300 - tensions.speed * 2}ms`,
};
```

### Step 5: Respect Budget

Check component complexity:

```python
def check_budget(component, budget):
    counts = analyze_component(component)

    if counts.interactive_elements > budget.interactive_elements:
        raise BudgetViolation("Too many interactive elements")

    if counts.decisions > budget.decisions:
        raise BudgetViolation("Too many decisions")

    if counts.animations > budget.animations:
        raise BudgetViolation("Too many animations")
```

### Step 6: Apply Fidelity Ceiling

Respect fidelity constraints:

```python
# From fidelity.yaml
constraints = {
    "gradients": 2,      # max stops
    "shadows": 3,        # max layers
    "animation": 800,    # max ms
    "blur": 16,          # max px
    "border_radius": 24  # max px
}

# Generate at ceiling, not above
```

### Step 7: Output Component

```
CHISEL EXECUTION
================

Component: [name]
Zone: [zone]
Material: [material]

Physics Applied:
✓ Material physics (clay spring / machinery instant / glass ease)
✓ Sync pattern (server_tick / optimistic)
✓ Tensions calculated
✓ Budget respected
✓ Fidelity ceiling applied

Generated:
[code block]
```

## Quick Reference: Zone to Code

| Zone | Sync | Material | Key Pattern |
|------|------|----------|-------------|
| critical | server_authoritative | clay | Disabled during pending, no optimistic |
| transactional | client_authoritative | machinery | Instant, no animation |
| exploratory | client_authoritative | glass | Smooth ease, glow |
| marketing | client_authoritative | glass | Playful, bouncy |
| admin | client_authoritative | machinery | Dense, efficient |

## Error Handling

If execution fails:

```
CHISEL BLOCKED
==============

Reason: [violation type]
Details: [explanation]

Resolution:
- [option 1]
- [option 2]

Cannot proceed without resolution.
```

## Output Format

Always output in this format:

```
CHISEL EXECUTION
================
Component: [name]
Zone: [zone]
Material: [material]

Physics Applied:
✓/✗ [constraint]: [status]

Generated:
```tsx
[code]
```

Notes:
- [any relevant notes]
```
