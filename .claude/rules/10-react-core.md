# Sigil: React Implementation Rules

Implementation knowledge for translating physics into correct React code.
Source: [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills/tree/react-best-practices)

<when_to_apply>
## When to Apply

These rules apply automatically when:
- `package.json` contains `react`, `next`, or `@tanstack/react-query`
- Files use `.tsx` or `.jsx` extensions
- Components involve data fetching, state management, or animations

Physics determines WHAT to build. These rules determine HOW to build it correctly.
</when_to_apply>

<priority_framework>
## Priority by Impact

| Priority | Category | File | When Applied |
|----------|----------|------|--------------|
| CRITICAL | Async waterfalls | 11-react-async.md | Any data fetching, server actions |
| CRITICAL | Bundle optimization | 12-react-bundle.md | All components, imports |
| HIGH | Server-side | 15-react-server.md | RSC, SSR, caching |
| MEDIUM-HIGH | Client fetching | 15-react-server.md | SWR, deduplication |
| MEDIUM | Re-render prevention | 14-react-rerender.md | Complex components, lists |
| MEDIUM | Rendering optimization | 13-react-rendering.md | Hydration, SVG, conditionals |
| LOW-MEDIUM | JS micro-optimizations | 16-react-js.md | Performance-critical paths |
</priority_framework>

<physics_to_rules>
## Physics → Implementation Rules

When Sigil detects physics, these implementation rules are triggered:

| Physics | Triggered Rules | Why |
|---------|-----------------|-----|
| **Pessimistic sync** | async-suspense-boundaries, async-defer-await | Loading states without blocking UI |
| **Optimistic sync** | rerender-memo, client-swr-dedup, rerender-transitions | Instant UI updates with deduplication |
| **Loading states** | async-suspense-boundaries, rendering-hydration-no-flicker | Progressive loading, no flicker |
| **High frequency** | rerender-memo, js-early-exit, rendering-hoist-jsx | Minimize work per interaction |
| **Server-rendered** | server-cache-react, rendering-hydration-no-flicker | Caching, hydration correctness |
| **Animation** | rendering-animate-svg-wrapper, js-batch-dom-css | GPU acceleration, batched updates |
| **Lists/tables** | rendering-content-visibility, js-index-maps | Virtual rendering, O(1) lookups |
| **Financial/Destructive** | async-suspense-boundaries, rerender-memo | Deliberate UX with correct patterns |
</physics_to_rules>

<rule_index>
## Rule Index

### 11-react-async.md (CRITICAL)
Eliminating waterfalls — the #1 performance killer.
- `async-api-routes` — Prevent waterfall chains in API routes
- `async-defer-await` — Defer await until needed
- `async-dependencies` — Dependency-based parallelization
- `async-parallel` — Promise.all() for independent operations
- `async-suspense-boundaries` — Strategic Suspense boundaries

### 12-react-bundle.md (CRITICAL)
Reducing bundle size for faster TTI and LCP.
- `bundle-barrel-imports` — Avoid barrel file imports (200-800ms savings)
- `bundle-conditional` — Conditional module loading
- `bundle-defer-third-party` — Defer non-critical libraries
- `bundle-dynamic-imports` — Dynamic imports for heavy components
- `bundle-preload` — Preload based on user intent

### 13-react-rendering.md (MEDIUM)
Optimizing the rendering process.
- `rendering-activity` — Use Activity for show/hide
- `rendering-animate-svg-wrapper` — Animate SVG wrapper for GPU acceleration
- `rendering-conditional-render` — Explicit conditional rendering
- `rendering-content-visibility` — CSS content-visibility for long lists
- `rendering-hoist-jsx` — Hoist static JSX elements
- `rendering-hydration-no-flicker` — Prevent hydration mismatch without flickering
- `rendering-svg-precision` — Optimize SVG precision

### 14-react-rerender.md (MEDIUM)
Reducing unnecessary re-renders.
- `rerender-defer-reads` — Defer state reads to usage point
- `rerender-dependencies` — Narrow effect dependencies
- `rerender-derived-state` — Subscribe to derived state
- `rerender-lazy-state-init` — Use lazy state initialization
- `rerender-memo` — Extract to memoized components
- `rerender-transitions` — Use transitions for non-urgent updates

### 15-react-server.md (HIGH)
Server-side and client-side data patterns.
- `server-cache-lru` — Cross-request LRU caching
- `server-cache-react` — Per-request deduplication with React.cache()
- `server-parallel-fetching` — Parallel data fetching with composition
- `server-serialization` — Minimize serialization at RSC boundaries
- `client-event-listeners` — Deduplicate global event listeners
- `client-swr-dedup` — Use SWR for automatic deduplication

### 16-react-js.md (LOW-MEDIUM)
JavaScript micro-optimizations for hot paths.
- `js-batch-dom-css` — Batch DOM CSS changes
- `js-cache-function-results` — Cache repeated function calls
- `js-cache-property-access` — Cache property access in loops
- `js-cache-storage` — Cache Storage API calls
- `js-combine-iterations` — Combine multiple array iterations
- `js-early-exit` — Early return from functions
- `js-hoist-regexp` — Hoist RegExp creation
- `js-index-maps` — Build index maps for repeated lookups
- `js-length-check-first` — Early length check for array comparisons
- `js-min-max-loop` — Use loop for min/max instead of sort
- `js-set-map-lookups` — Use Set/Map for O(1) lookups
- `js-tosorted-immutable` — Use toSorted() for immutability
- `advanced-event-handler-refs` — Store event handlers in refs
- `advanced-use-latest` — useLatest for stable callback refs
</rule_index>

<usage_in_craft>
## Usage in /craft

When generating components, the analysis box shows triggered rules:

```
┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    ClaimButton                             │
│  Effect:       Financial mutation                      │
│                                                        │
│  Behavioral    pessimistic, 800ms, confirmation        │
│  Animation     ease-out, deliberate                    │
│  Material      elevated, soft shadow                   │
│                                                        │
│  Implementation:                                       │
│  ✓ async-suspense-boundaries (loading state)          │
│  ✓ rendering-hydration-no-flicker (SSR)               │
│  ✓ rerender-memo (confirmation dialog)                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Rules are applied automatically based on detected physics and component context.
</usage_in_craft>
