# Sigil Agent: Mapping Zones

> "Zones are physics contexts. Different zones, different rules."

## Role

**Zone Architect** — Configures path-based design zones with physics, materials, and budgets.

## Command

```
/map              # Review and update zone configuration
/map --add        # Add a new custom zone
/map --paths      # Focus on path mapping only
```

## Outputs

| Path | Description |
|------|-------------|
| `sigil-mark/resonance/zones.yaml` | Zone definitions and path mappings |

## Prerequisites

- Run `/sigil-setup` first
- Run `/envision` first (need essence.yaml)
- Run `/codify` first (optional, but recommended)

## Workflow

### Phase 1: Load Context

Read the following files:
- `sigil-mark/resonance/zones.yaml` — Current zone configuration
- `sigil-mark/resonance/essence.yaml` — Product feel for tension defaults
- `sigil-mark/core/sync.yaml` — Temporal Governor constraints

### Phase 2: Review Current Zones

Display current zone configuration:

```
Current Zone Configuration:

┌────────────────────────────────────────────────────────────────┐
│ CRITICAL                                                        │
│ Physics: server_authoritative, discrete (600ms)                 │
│ Material: clay | Budget: 5 elements, 2 decisions, 1 animation  │
│ Paths:                                                          │
│   - **/checkout/**                                              │
│   - **/claim/**                                                 │
│   - **/transaction/**                                           │
├────────────────────────────────────────────────────────────────┤
│ TRANSACTIONAL                                                   │
│ Physics: client_authoritative, continuous (0ms)                 │
│ Material: machinery | Budget: 12 elements, 5 decisions          │
│ Paths:                                                          │
│   - **/dashboard/**                                             │
│   - **/settings/**                                              │
├────────────────────────────────────────────────────────────────┤
│ EXPLORATORY                                                     │
│ Physics: client_authoritative, continuous (0ms)                 │
│ Material: glass | Budget: 20 elements, 10 decisions             │
│ Paths:                                                          │
│   - **/explore/**                                               │
│   - **/browse/**                                                │
├────────────────────────────────────────────────────────────────┤
│ MARKETING                                                       │
│ Physics: client_authoritative, continuous (0ms)                 │
│ Material: glass | Budget: 15 elements, 3 decisions              │
│ Paths:                                                          │
│   - **/landing/**                                               │
│   - **/home/**                                                  │
└────────────────────────────────────────────────────────────────┘

Modify a zone? Add paths? [zone name or 'done']
```

Use AskUserQuestion for zone selection.

### Phase 3: Add Paths to Zone

For the selected zone:

```
Zone: [selected_zone]

Current paths:
{{zone.paths | join "\n"}}

Add paths (glob patterns):
> src/features/wallet/**
> app/(app)/buy/**

[Added]
```

Update `zones.yaml`:
```yaml
definitions:
  [zone]:
    paths:
      - [existing paths]
      - src/features/wallet/**
      - app/(app)/buy/**
```

### Phase 4: Configure Zone Physics (Optional)

If user wants to modify zone physics:

```
Configure [zone]:

Physics:
  sync: [server_authoritative / client_authoritative / collaborative]
  tick: [discrete / continuous]
  tick_rate_ms: [600 / 0]
  material: [clay / machinery / glass]

Budget:
  interactive_elements: [5-30]
  decisions: [2-10]
  animations: [1-5]

Tensions:
  playfulness: [0-100]
  weight: [0-100]
  density: [0-100]
  speed: [0-100]
```

### Phase 5: Add Custom Zone (Optional)

If user runs `/map --add`:

```
Create new zone:

Name: [e.g., "gaming"]
Description: [What is this zone for?]

Paths (glob patterns):
> src/features/game/**
> src/features/combat/**

Physics:
  sync: [server_authoritative / client_authoritative]
  tick: [discrete / continuous]
  tick_rate_ms: [ms value]
  material: [clay / machinery / glass]

Budget:
  interactive_elements: [count]
  decisions: [count]
  animations: [count]

Tensions (0-100):
  playfulness: [value]
  weight: [value]
  density: [value]
  speed: [value]

[Zone 'gaming' created]
```

### Phase 6: Validate Configuration

After updates, validate:

```
Validating zone configuration...

✓ All paths are valid glob patterns
✓ No path conflicts (same path → different zones)
✓ All materials exist
✓ Physics constraints are consistent
✓ Default zone is configured

Zone configuration saved.
```

## Zone Resolution Algorithm

```
When agent needs zone for a file:

1. Check for @sigil-zone comment in file
   // @sigil-zone critical

2. Match path against zone patterns (priority order):
   - critical (check first)
   - admin
   - marketing
   - transactional
   - exploratory
   - default (fallback)

3. Return matching zone with all physics
```

## Path Conflict Detection

If same path matches multiple zones:

```
⚠️ PATH CONFLICT DETECTED

Path: src/features/checkout/settings/**

Matches:
  - critical (**/checkout/**)
  - transactional (**/settings/**)

Resolution options:
1. Keep critical (it has priority)
2. Add explicit path to transactional
3. Use @sigil-zone override in files

Choose [1/2/3]:
```

## Success Criteria

- [ ] All feature paths are mapped to zones
- [ ] Each zone has physics, material, and budget
- [ ] No path conflicts exist
- [ ] Critical paths use server_authoritative
- [ ] Default zone is configured

## Error Handling

| Situation | Response |
|-----------|----------|
| Invalid glob pattern | Show valid pattern syntax |
| Unknown material | List valid materials |
| Path conflict | Show conflict resolution options |
| Missing physics | Use zone defaults |

## Next Step

After `/map`: Ready to use `/craft` for component generation.
