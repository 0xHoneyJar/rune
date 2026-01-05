# Sigil Agent: Crafting Components

> "Diagnose first, then execute. Physics, not opinions."

## Role

**Apprentice Smith** — Uses Hammer to diagnose, Chisel to execute. Limited by physics constraints.

## Command

```
/craft [prompt]                    # Diagnose and generate
/craft [prompt] --zone [zone]      # Force zone context
/craft [prompt] --material [mat]   # Force material
```

## Toolkit

The craft command uses two tools:

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **Hammer** | Diagnose | Before ANY change, ask "what's the physics?" |
| **Chisel** | Execute | After diagnosis, apply precise changes |

See:
- `tools/hammer.md` — Diagnosis workflow
- `tools/chisel.md` — Execution workflow

## The Linear Test

Before any change, apply The Linear Test:

```
User: "The claim button feels slow"

WRONG (Chisel-first):
- Add optimistic UI
- Speed up animation
- Reduce server calls

RIGHT (Hammer-first):
1. What zone is this button in? → critical
2. What's the zone's sync authority? → server_authoritative
3. What's the tick rate? → 600ms discrete
4. Is "slow" the problem, or is "heavy" the intent?

DIAGNOSIS:
The button IS supposed to feel slow. Discrete tick is intentional.
The "slowness" is communicating weight and trust.

If user still wants change → Route to Loa (structural change).
```

## Workflow

### Step 1: Detect Context

```python
def detect_context(prompt, file_path=None):
    # 1. Detect zone from file path
    zone = resolve_zone(file_path)

    # 2. Load zone physics
    physics = load_zone_physics(zone)

    # 3. Load material from zone
    material = load_material(physics.material)

    # 4. Load essence
    essence = load_essence()

    # 5. Load fidelity ceiling
    fidelity = load_fidelity()

    return Context(zone, physics, material, essence, fidelity)
```

### Step 2: Inject Context

Before generation, inject physics context:

```xml
<sigil_context version="4.0">
  <zone name="{{zone.name}}">
    <sync>{{zone.physics.sync}}</sync>
    <tick>{{zone.physics.tick}} ({{zone.physics.tick_rate_ms}}ms)</tick>
    <material>{{zone.physics.material}}</material>
    <budget>
      <interactive_elements max="{{zone.physics.budget.interactive_elements}}" />
      <decisions max="{{zone.physics.budget.decisions}}" />
      <animations max="{{zone.physics.budget.animations}}" />
    </budget>
  </zone>

  <material name="{{material.name}}">
    <physics>
      <light>{{material.physics.light}}</light>
      <weight>{{material.physics.weight}}</weight>
      <motion type="{{material.physics.motion.type}}" />
      <feedback>{{material.physics.feedback}}</feedback>
    </physics>
  </material>

  <tensions>
    <playfulness>{{tensions.playfulness}}</playfulness>
    <weight>{{tensions.weight}}</weight>
    <density>{{tensions.density}}</density>
    <speed>{{tensions.speed}}</speed>
  </tensions>

  <essence>
    <soul>{{essence.soul.statement}}</soul>
  </essence>
</sigil_context>
```

### Step 3: Apply Hammer (Diagnose)

Use Hammer to understand the problem:

```
HAMMER DIAGNOSIS:

Zone: critical
Physics: server_authoritative, discrete (600ms)
Material: clay (heavy, spring, depress)

User request: "Make the button faster"

Analysis:
1. Zone is server_authoritative → NO optimistic UI
2. Tick is discrete 600ms → UI must wait for tick
3. Material is clay → Weight is intentional

Diagnosis: User is asking to violate physics.
The "slowness" is the design, not a bug.

Options:
A. Explain physics constraint (educate)
B. Route to Loa for structural change
C. If user overrides, record Taste Key ruling
```

### Step 4: Apply Chisel (Execute)

If diagnosis allows, execute with Chisel:

```
CHISEL EXECUTION:

Creating button in critical zone with clay material.

Physics applied:
- shadow: soft, diffuse
- transform: scale(0.98) on press
- transition: spring (stiffness: 120, damping: 14)
- sync: server_authoritative (no optimistic)
- tick: waits for 600ms tick

Generated component follows physics constraints.
```

### Step 5: Physics Violations

Check for physics violations:

```python
def check_violations(generated_code, context):
    violations = []

    # IMPOSSIBLE violations (cannot override)
    if context.zone.physics.sync == "server_authoritative":
        if has_optimistic_update(generated_code):
            violations.append({
                "type": "IMPOSSIBLE",
                "message": "Optimistic UI in server_authoritative zone",
                "action": "BLOCK"
            })

    # BLOCK violations (Taste Key can override)
    if exceeds_budget(generated_code, context.zone.physics.budget):
        violations.append({
            "type": "BLOCK",
            "message": "Exceeds element budget",
            "action": "BLOCK (Taste Key can override)"
        })

    return violations
```

### Step 6: Loa Handoff

If request requires structural change:

```
LOA HANDOFF

The request "make claim button instant" requires changing:
- Zone sync authority (server → client)
- Tick mode (discrete → continuous)

This is a STRUCTURAL change, not a UI change.

Creating Loa consultation:
---
type: structural_change
request: "Change claim button from discrete to continuous"
impact: Trust model, data integrity
recommendation: Consult with Loa before proceeding
---

Would you like to:
1. Open Loa consultation (/consult)
2. Get Taste Key approval to override
3. Cancel and keep current physics
```

## Material-Specific Patterns

### Clay (Heavy, Spring)

```tsx
// Clay entrance
animate={{
  from: { opacity: 0, scale: 0.95, y: 8 },
  to: { opacity: 1, scale: 1, y: 0 },
}}
transition={{
  type: "spring",
  stiffness: 120,
  damping: 14
}}

// Clay interaction
className="
  bg-stone-50
  shadow-sm shadow-stone-200/50
  hover:shadow-md hover:-translate-y-0.5
  active:shadow-sm active:translate-y-0.5 active:scale-[0.98]
"
```

### Machinery (Instant, Flat)

```tsx
// Machinery entrance - NONE
// No animation, instant appearance

// Machinery interaction
className="
  bg-neutral-900
  border border-neutral-800
  hover:bg-neutral-800
  // NO transitions
"
```

### Glass (Ease, Glow)

```tsx
// Glass entrance
animate={{
  from: { opacity: 0, scale: 0.95, y: 8 },
  to: { opacity: 1, scale: 1, y: 0 },
}}
transition={{
  duration: 0.2,
  ease: "easeOut"
}}

// Glass interaction
className="
  backdrop-blur-xl
  bg-white/70
  border border-white/20
  hover:bg-white/80
  transition-all duration-200
"
```

## Server-Tick Pattern

For `server_authoritative` zones:

```tsx
function ServerTickButton({ action, children }) {
  const { execute, isPending, isSuccess } = useServerTick(action);

  return (
    <button
      onClick={() => execute()}
      disabled={isPending}  // MUST disable
      className={cn(
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <span>Processing...</span>  // NO spinner
      ) : isSuccess ? (
        <SuccessAnimation>{children}</SuccessAnimation>
      ) : (
        children
      )}
    </button>
  );
}
```

## Success Criteria

- [ ] Hammer diagnosis before Chisel execution
- [ ] Zone context detected correctly
- [ ] Material physics applied
- [ ] Sync strategy respected
- [ ] Budget constraints checked
- [ ] IMPOSSIBLE violations blocked
- [ ] BLOCK violations reported
- [ ] Loa handoff generated for structural changes

## Error Handling

| Situation | Response |
|-----------|----------|
| Unknown zone | Use default zone |
| Missing essence | Warn, use minimal defaults |
| Physics violation (IMPOSSIBLE) | Block, explain why |
| Budget violation (BLOCK) | Block, offer Taste Key override |
| Structural change requested | Generate Loa handoff |

## Next Step

After `/craft`: Run `/validate` to check generated code against physics.
