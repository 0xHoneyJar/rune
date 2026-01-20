# Explore Mode

Discovery mode for understanding unknown codebases or domains. Use when codebase conventions are unclear or when entering unfamiliar territory.

## When to Activate

- User says "explore" or "discover"
- First craft in a new codebase
- No existing components match craft target
- User asks "what's the pattern here?"

## Behavior

```
┌─ EXPLORE MODE ─────────────────────────────────────────┐
│  Codebase discovery active                             │
│                                                        │
│  Scanning: {directory or pattern}                      │
│  Looking for: {patterns to discover}                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Discovery Protocol

### Phase 1: Package Analysis
```
Reading package.json...

Dependencies found:
  ✓ framer-motion (animation)
  ✓ @tanstack/react-query (data fetching)
  ✓ tailwindcss (styling)
  ✓ zustand (state management)

Convention implications:
  • Use motion components for animation
  • Use useMutation/useQuery patterns
  • Use Tailwind utility classes
  • Use zustand stores for global state
```

### Phase 2: Pattern Discovery
```
Scanning existing components...

Found 15 components in src/components/

High-usage patterns (Gold authority):
  • Button.tsx - 23 imports
  • Modal.tsx - 18 imports
  • Card.tsx - 15 imports

Component structure pattern:
  └─ imports
  └─ type definitions
  └─ hooks (useState, useMutation...)
  └─ derived state
  └─ handlers
  └─ render
```

### Phase 3: Style Discovery
```
Analyzing code style...

Import style: Named imports, no barrel files
Export style: export default ComponentName
Naming: PascalCase components, camelCase functions
Props: Interface with Props suffix, destructured
```

### Phase 4: Physics Baseline
```
Analyzing existing physics...

Financial components:
  • ClaimButton.tsx - 800ms, pessimistic ✓
  • WithdrawModal.tsx - 600ms, pessimistic (customized)

Standard components:
  • LikeButton.tsx - 200ms, optimistic ✓
  • SaveButton.tsx - 200ms, optimistic ✓

Animation patterns:
  • Modals use AnimatePresence + motion.div
  • Buttons use whileTap={{ scale: 0.98 }}
  • Spring config: stiffness: 500, damping: 30
```

## Output Format

```
┌─ Codebase Discovery Report ────────────────────────────┐
│                                                        │
│  Libraries:                                            │
│  • Animation: framer-motion                            │
│  • Data: @tanstack/react-query                         │
│  • Styling: tailwindcss                                │
│  • State: zustand                                      │
│                                                        │
│  Conventions:                                          │
│  • Import: named, no barrels                           │
│  • Export: default                                     │
│  • Props: Interface + Props suffix                     │
│                                                        │
│  Gold Components (learn from these):                   │
│  • Button.tsx (23 imports)                             │
│  • Modal.tsx (18 imports)                              │
│                                                        │
│  Physics Baseline:                                     │
│  • Financial: 800ms pessimistic                        │
│  • Standard: 200ms optimistic                          │
│  • Springs: stiffness 500, damping 30                  │
│                                                        │
│  Saved to: grimoires/sigil/context/codebase-{date}.md │
│                                                        │
│  Ready for /craft                                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Context Caching

Exploration results are cached to avoid repeated discovery:

```yaml
# grimoires/sigil/context/codebase-discovery.yaml
discovered_at: "2026-01-20T14:30:00Z"
expires_at: "2026-01-21T14:30:00Z"

libraries:
  animation: framer-motion
  data_fetching: "@tanstack/react-query"
  styling: tailwindcss
  state: zustand

conventions:
  import_style: named
  export_style: default
  props_style: interface_with_suffix

gold_components:
  - path: src/components/Button.tsx
    imports: 23
  - path: src/components/Modal.tsx
    imports: 18

physics_baseline:
  financial:
    timing: 800ms
    sync: pessimistic
  standard:
    timing: 200ms
    sync: optimistic
```

## Refresh Protocol

Discovery cache is refreshed when:
- Cache is >24 hours old
- User requests explicit refresh
- package.json modified (detected by git)
- /craft fails with library mismatch

## Token Budget

Estimated: ~1,000 tokens when loaded
