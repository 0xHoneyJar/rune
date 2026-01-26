# Sprint Plan: Agentation Core Simplification

**Version:** 1.0
**Date:** 2026-01-26
**Based on:** PRD v1.0, SDD v1.0

---

## Overview

| Attribute | Value |
|-----------|-------|
| Total Sprints | 4 |
| Sprint Duration | ~1 session each |
| MVP Sprint | Sprint 2 (working package with core features) |
| Full Feature | Sprint 3 (wagmi integration + polish) |
| Cleanup | Sprint 4 (remove old packages, documentation) |

---

## Sprint 1: Package Foundation ✅ REVIEW_APPROVED

**Goal:** Create the `packages/agentation` structure with stores and provider.

### Tasks

#### Task 1.1: Create Package Structure ✅
**Description:** Initialize the agentation package with package.json, tsconfig, and tsup config.

**Acceptance Criteria:**
- [x] `packages/agentation/package.json` exists with correct exports config
- [x] `packages/agentation/tsconfig.json` extends root config
- [x] `packages/agentation/tsup.config.ts` configured for ESM output
- [x] Package builds without errors (`pnpm build`)

#### Task 1.2: Create Theme & Types ✅
**Description:** Port theme.ts and create unified types.ts from hud/lens sources.

**Acceptance Criteria:**
- [x] `src/theme.ts` contains simplified design tokens
- [x] `src/types.ts` contains all shared types (AgentationConfig, LensState, etc.)
- [x] Types exported from index.ts

**Source Files:**
- `packages/hud/src/styles/theme.ts` → `src/theme.ts`
- `packages/hud/src/types.ts` + `packages/lens/src/types.ts` → `src/types.ts`

#### Task 1.3: Create Zustand Stores ✅
**Description:** Port and simplify toolbar store from hud, lens store from lens.

**Acceptance Criteria:**
- [x] `src/store/toolbar.ts` with isOpen, activeTab, position
- [x] `src/store/lens.ts` with impersonatedAddress, savedAddresses
- [x] Storage keys updated to `agentation-*` prefix
- [x] Only persist position and savedAddresses (not session state)

**Source Files:**
- `packages/hud/src/store.ts` → `src/store/toolbar.ts`
- `packages/lens/src/store.ts` → `src/store/lens.ts`

#### Task 1.4: Create AgentationProvider ✅
**Description:** Create the main context provider that initializes stores.

**Acceptance Criteria:**
- [x] `src/provider.tsx` exports AgentationProvider
- [x] Accepts `AgentationConfig` props
- [x] Initializes keyboard shortcuts hook
- [x] Context exposes store state and actions

**Source Files:**
- `packages/hud/src/providers/HudProvider.tsx` → `src/provider.tsx`

---

## Sprint 2: Core Components (MVP) ✅ REVIEW_APPROVED

**Goal:** Implement Trigger, Toolbar, and LensPanel. Working address impersonation.

### Tasks

#### Task 2.1: Create Trigger Component ✅
**Description:** Port HudTrigger as the floating button to open toolbar.

**Acceptance Criteria:**
- [x] `src/components/Trigger.tsx` renders 44px floating button
- [x] Position based on config (bottom-right default)
- [x] Hidden when toolbar is open
- [x] Inline styles only (no external CSS)

**Source Files:**
- `packages/hud/src/components/HudTrigger.tsx` → `src/components/Trigger.tsx`

#### Task 2.2: Create Toolbar Component ✅
**Description:** Create the main toolbar panel with tab navigation.

**Acceptance Criteria:**
- [x] `src/components/Toolbar.tsx` renders fixed panel
- [x] Header with Lens/Inspector tabs
- [x] Close button (X)
- [x] Renders LensPanel or InspectorPanel based on activeTab
- [x] Position matches config

#### Task 2.3: Create LensPanel Component ✅
**Description:** Port LensPanel with address input and saved addresses.

**Acceptance Criteria:**
- [x] `src/components/LensPanel.tsx` with address input
- [x] Impersonate/Stop buttons
- [x] Saved addresses list
- [x] Quick-select from saved addresses
- [x] Works without wagmi

**Source Files:**
- `packages/hud/src/components/LensPanel.tsx` → `src/components/LensPanel.tsx`

#### Task 2.4: Create Lens Hooks ✅
**Description:** Port lens hooks for consuming impersonated address.

**Acceptance Criteria:**
- [x] `src/lens/hooks.ts` exports useLens, useEffectiveAddress, etc.
- [x] `src/lens/service.ts` for non-React usage
- [x] All hooks read from Zustand store

**Source Files:**
- `packages/lens/src/hooks.ts` → `src/lens/hooks.ts`
- `packages/lens/src/service.ts` → `src/lens/service.ts`

#### Task 2.5: Create Main Agentation Component ✅
**Description:** Compose Trigger + Toolbar into single export.

**Acceptance Criteria:**
- [x] `src/components/Agentation.tsx` renders Trigger when closed, Toolbar when open
- [x] Exported from index.ts
- [x] Example usage works: `<AgentationProvider><Agentation /></AgentationProvider>`

#### Task 2.6: Create Keyboard Shortcuts Hook ✅
**Description:** Port keyboard shortcuts for toolbar toggle.

**Acceptance Criteria:**
- [x] `src/hooks/useKeyboardShortcuts.ts`
- [x] Ctrl+Shift+D toggles toolbar
- [x] Escape closes toolbar
- [x] 1/2 switches tabs when open

**Source Files:**
- `packages/hud/src/hooks/useKeyboardShortcuts.ts` → `src/hooks/useKeyboardShortcuts.ts`

---

## Sprint 3: Inspector & wagmi Integration ✅ REVIEW_APPROVED

**Goal:** Add element inspector panel and optional wagmi integration.

### Tasks

#### Task 3.1: Port useElementInspector Hook ✅
**Description:** Port the core element inspection logic.

**Acceptance Criteria:**
- [x] `src/inspector/useElementInspector.ts` with start/stop/toggle
- [x] Hover detection with element info extraction
- [x] CSS selector generation
- [x] React component name extraction from fiber

**Source Files:**
- `packages/hud/src/inspector/useElementInspector.ts` → `src/inspector/useElementInspector.ts`

#### Task 3.2: Port useAnnotationSession Hook ✅
**Description:** Port annotation session management.

**Acceptance Criteria:**
- [x] `src/inspector/useAnnotationSession.ts`
- [x] Add/remove/clear annotations
- [x] Markdown export function
- [x] Category support (bug, suggestion, ux, etc.)

**Source Files:**
- `packages/hud/src/inspector/useAnnotationSession.ts` → `src/inspector/useAnnotationSession.ts`

#### Task 3.3: Create ElementInspector Component ✅
**Description:** Port the highlight overlay for inspected elements.

**Acceptance Criteria:**
- [x] `src/inspector/ElementInspector.tsx` renders highlight overlay
- [x] Shows element info on hover
- [x] Click captures element to annotations

**Source Files:**
- `packages/hud/src/inspector/ElementInspector.tsx` → `src/inspector/ElementInspector.tsx`

#### Task 3.4: Create AnnotationMarker Component ✅
**Description:** Port the annotation marker UI.

**Acceptance Criteria:**
- [x] `src/inspector/AnnotationMarker.tsx` renders marker on annotated elements
- [x] Shows annotation count
- [x] Clickable to view/edit annotation

**Source Files:**
- `packages/hud/src/inspector/AnnotationMarker.tsx` → `src/inspector/AnnotationMarker.tsx`

#### Task 3.5: Create InspectorPanel Component ✅
**Description:** Compose inspector UI into panel.

**Acceptance Criteria:**
- [x] `src/components/InspectorPanel.tsx`
- [x] Start/Stop inspection button
- [x] Annotation list
- [x] Copy markdown button
- [x] Clear all button

#### Task 3.6: Create wagmi Subpath Export ✅
**Description:** Create optional wagmi integration.

**Acceptance Criteria:**
- [x] `wagmi/index.ts` exports useEffectiveAddress, useLensAwareAccount
- [x] Reads from wagmi's useAccount when lens not active
- [x] Falls back to impersonated address when lens enabled
- [x] Builds as separate entry point

**Source Files:**
- `packages/lens/src/wagmi.ts` → `wagmi/index.ts`

---

## Sprint 4: Cleanup & Documentation ✅ REVIEW_APPROVED

**Goal:** Remove old packages, update documentation, verify bundle size.

### Tasks

#### Task 4.1: Update Main Index Exports ✅
**Description:** Ensure all public API is exported from index.ts.

**Acceptance Criteria:**
- [x] Core: AgentationProvider, Agentation, useAgentation
- [x] Lens: useLens, useEffectiveAddress, useSavedAddresses
- [x] Inspector: useElementInspector, useAnnotationSession
- [x] Types: All public types exported

#### Task 4.2: Verify Bundle Size ✅
**Description:** Ensure bundle meets <10KB gzipped target.

**Acceptance Criteria:**
- [x] `pnpm build` succeeds
- [x] Main bundle <30KB uncompressed
- [x] Main bundle <10KB gzipped
- [x] wagmi bundle <5KB gzipped

#### Task 4.3: Add README ✅
**Description:** Create package README with integration examples.

**Acceptance Criteria:**
- [x] Installation instructions
- [x] Basic usage example (<20 LOC)
- [x] wagmi integration example
- [x] Available hooks and components documented

#### Task 4.4: Deprecate Old Packages ✅
**Description:** Mark old packages as deprecated in their package.json.

**Acceptance Criteria:**
- [x] `@thehoneyjar/sigil-hud` marked deprecated
- [x] `@thehoneyjar/sigil-lens` marked deprecated
- [x] Deprecation points to `@thehoneyjar/agentation`

#### Task 4.5: E2E Validation ✅
**Description:** Verify all PRD goals are met.

**Acceptance Criteria:**
- [x] G-1: Package count reduced (verify 1 active package)
- [x] G-2: Integration <20 LOC (verify README example)
- [x] G-3: <5 min to add to repo (test in clean project)
- [x] G-4: Bundle <10KB gzipped (measure)

---

## Appendix A: File Migration Reference

| Source | Destination | Sprint |
|--------|-------------|--------|
| `hud/src/styles/theme.ts` | `src/theme.ts` | 1 |
| `hud/src/types.ts` | `src/types.ts` | 1 |
| `hud/src/store.ts` | `src/store/toolbar.ts` | 1 |
| `lens/src/store.ts` | `src/store/lens.ts` | 1 |
| `hud/src/providers/HudProvider.tsx` | `src/provider.tsx` | 1 |
| `hud/src/components/HudTrigger.tsx` | `src/components/Trigger.tsx` | 2 |
| `hud/src/components/LensPanel.tsx` | `src/components/LensPanel.tsx` | 2 |
| `lens/src/hooks.ts` | `src/lens/hooks.ts` | 2 |
| `lens/src/service.ts` | `src/lens/service.ts` | 2 |
| `hud/src/hooks/useKeyboardShortcuts.ts` | `src/hooks/useKeyboardShortcuts.ts` | 2 |
| `hud/src/inspector/useElementInspector.ts` | `src/inspector/useElementInspector.ts` | 3 |
| `hud/src/inspector/useAnnotationSession.ts` | `src/inspector/useAnnotationSession.ts` | 3 |
| `hud/src/inspector/ElementInspector.tsx` | `src/inspector/ElementInspector.tsx` | 3 |
| `hud/src/inspector/AnnotationMarker.tsx` | `src/inspector/AnnotationMarker.tsx` | 3 |
| `lens/src/wagmi.ts` | `wagmi/index.ts` | 3 |

---

## Appendix B: Not Migrated (Out of Scope)

| File | Reason |
|------|--------|
| `hud/src/components/DiagnosticsPanel.tsx` | Physics checking via rules |
| `hud/src/components/SimulationPanel.tsx` | Separate concern |
| `hud/src/components/StateComparison.tsx` | Not core to annotation |
| `hud/src/components/ObservationCaptureModal.tsx` | Sigil-specific |
| `hud/src/components/FeedbackPrompt.tsx` | Sigil-specific |
| `hud/src/components/PhysicsAnalysis.tsx` | Diagnostics feature |
| `hud/src/hooks/useSignalCapture.ts` | Sigil-specific learning |
| `hud/src/hooks/useObservationCapture.ts` | Sigil-specific |
| `hud/src/hooks/useDataSource.ts` | Diagnostics feature |

---

## Appendix C: Goal Traceability

| Goal | Contributing Tasks |
|------|-------------------|
| G-1: Reduce package count (8→1) | Task 1.1, Task 4.4 |
| G-2: Simplify integration (<20 LOC) | Task 2.5, Task 4.3 |
| G-3: Faster iteration (<5 min) | Task 2.6, Task 4.5 |
| G-4: Smaller bundle (<10KB) | Task 1.2, Task 4.2 |

---

*Sprint plan generated by Claude Opus 4.5*
*Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>*
