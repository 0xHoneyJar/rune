---
name: "craft"
version: "12.1.0"
description: |
  Generate UI components with design physics.
  Shows physics analysis before generating, like RAMS shows accessibility issues.

arguments:
  - name: "description"
    type: "string"
    required: true
    description: "What to build"
    examples:
      - "claim button"
      - "like button for posts"
      - "delete with undo"
      - "dark mode toggle"

context_files:
  - path: ".claude/rules/01-sigil-physics.md"
    required: true
    purpose: "Physics table and rationale"
  - path: ".claude/rules/02-sigil-detection.md"
    required: true
    purpose: "Effect detection rules with examples"
  - path: ".claude/rules/03-sigil-patterns.md"
    required: true
    purpose: "Golden pattern templates"
  - path: ".claude/rules/04-sigil-protected.md"
    required: true
    purpose: "Protected capabilities checklist"

outputs:
  - path: "src/components/$COMPONENT_NAME.tsx"
    type: "file"
    description: "Generated component with correct physics"

workflow_next: "garden"
---

# /craft

Generate UI components with correct design physics.

## Workflow

Execute these steps in order:

### Step 1: Discover Codebase Conventions

Before generating anything, check what libraries exist:

```bash
# Check animation library
grep -E "framer-motion|react-spring|@emotion" package.json

# Check data fetching
grep -E "@tanstack/react-query|swr|apollo" package.json

# Check toast library
grep -E "sonner|react-hot-toast|react-toastify" package.json
```

Read one existing component to understand:
- Import style (named vs default, path aliases)
- File structure (single file vs folder)
- Naming conventions (PascalCase, kebab-case files)

### Step 2: Detect Effect Type

Parse the user's description for effect indicators:

| Priority | Check | Example |
|----------|-------|---------|
| 1. Types | Props with `Currency`, `Money`, `Wei`, `Balance` | Always financial |
| 2. Keywords | "claim", "delete", "like", "toggle" | See detection rules |
| 3. Context | "with undo", "for checkout", "wallet" | Modifies effect |

### Step 3: Show Physics Analysis

Display analysis in this exact format, then wait for confirmation:

```
┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    [ComponentName]                         │
│  Effect:       [Effect type]                           │
│  Detected by:  [keyword/type/context that triggered]   │
│                                                        │
│  ┌─ Applied Physics ────────────────────────────────┐  │
│  │  Sync:         [Pessimistic/Optimistic/Immediate]│  │
│  │  Timing:       [Xms] [why this timing]           │  │
│  │  Confirmation: [Required/None/Toast+Undo]        │  │
│  │  Animation:    [curve type]                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Codebase:     [animation lib] + [data fetching lib]   │
│  Template:     [pattern from 03-sigil-patterns.md]     │
│                                                        │
│  Protected capabilities:                               │
│  [✓/✗] Cancel button                                  │
│  [✓/✗] Error recovery                                 │
│  [✓/✗] Balance display (if financial)                │
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed with these physics? (yes / or describe what's different)
```

### Step 4: Wait for Confirmation

Do not generate code until user confirms or corrects.

If user corrects: Update analysis and show again.
If user confirms: Proceed to generation.

### Step 5: Generate Component

Generate code that:
- Uses discovered libraries (not assumed ones)
- Matches existing code style exactly
- Applies physics from analysis
- Includes all protected capabilities
- Has no comments (unless explaining physics override)

### Step 6: Suggest Next Step

After generating:
```
Component generated. Run /garden to check if it's becoming canonical.
```

---

## Detection Quick Reference

| Keywords | Effect | Sync | Timing |
|----------|--------|------|--------|
| claim, deposit, withdraw, transfer, swap, stake | Financial | Pessimistic | 800ms |
| delete, remove, destroy, revoke, burn | Destructive | Pessimistic | 600ms |
| archive, trash, soft-delete, dismiss | Soft Delete | Optimistic | 200ms |
| save, update, like, follow, create, bookmark | Standard | Optimistic | 200ms |
| toggle, switch, expand, collapse, select | Local State | Immediate | 100ms |

**Type Override**: `Currency`, `Money`, `Balance`, `Wei`, `Token`, `BigInt` in props → always Financial.

---

## Examples

### Example 1: Financial Component

```
User: /craft "claim button for staking rewards"

[Step 1: Discover] Found framer-motion, @tanstack/react-query, sonner
[Step 2: Detect] "claim" + "staking" → Financial

┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    StakingClaimButton                      │
│  Effect:       Financial mutation                      │
│  Detected by:  "claim" keyword + "staking" context     │
│                                                        │
│  ┌─ Applied Physics ────────────────────────────────┐  │
│  │  Sync:         Pessimistic (server confirms)     │  │
│  │  Timing:       800ms (time to verify amount)     │  │
│  │  Confirmation: Required (two-phase)              │  │
│  │  Animation:    Deliberate ease-out               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Codebase:     framer-motion + tanstack-query          │
│  Template:     ClaimButton from 03-sigil-patterns.md   │
│                                                        │
│  Protected capabilities:                               │
│  ✓ Cancel button                                      │
│  ✓ Error recovery                                     │
│  ✓ Amount display                                     │
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed with these physics? (yes / or describe what's different)

User: yes

[Generates component with framer-motion, useMutation, two-phase confirmation]
```

### Example 2: Correction Flow

```
User: /craft "rewards toggle"

┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    RewardsToggle                           │
│  Effect:       Financial mutation                      │
│  Detected by:  "rewards" context (potential money)     │
│  ...                                                   │
└────────────────────────────────────────────────────────┘

Proceed with these physics?

User: no, this just toggles visibility of the rewards section, no server call

┌─ Physics Analysis (Corrected) ─────────────────────────┐
│                                                        │
│  Component:    RewardsToggle                           │
│  Effect:       Local state                             │
│  Detected by:  User override (UI visibility only)      │
│                                                        │
│  ┌─ Applied Physics ────────────────────────────────┐  │
│  │  Sync:         Immediate (no server)             │  │
│  │  Timing:       100ms instant                     │  │
│  │  Confirmation: None                              │  │
│  │  Animation:    Snappy spring                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed with these physics?

User: yes

[Generates local state toggle]
```

### Example 3: Ambiguous Detection

```
User: /craft "fancy button"

┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  ⚠ Could not detect effect from "fancy button"        │
│                                                        │
│  Help me understand:                                   │
│  • What happens when clicked?                          │
│  • Does it call a server?                              │
│  • Can it be undone?                                   │
│  • Does it involve money/tokens?                       │
│                                                        │
└────────────────────────────────────────────────────────┘

User: it submits a form to save user preferences

┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    FancyButton                             │
│  Effect:       Standard mutation                       │
│  Detected by:  "save preferences" (user clarification) │
│  ...                                                   │
└────────────────────────────────────────────────────────┘
```

---

## Code Style

Generated code follows these rules:
- **No comments** unless explaining a physics override
- **No JSDoc** unless the project uses it
- **Match imports** to existing component style
- **Match naming** to existing conventions
- **Use discovered libraries** only (never assume)

---

## Automatic Inference

Infer these from effect type without asking:
- **Sync strategy** → from physics table
- **Timing** → from physics table
- **Confirmation** → from physics table
- **Animation library** → from package.json discovery
- **Data fetching** → from package.json discovery
- **Toast library** → from package.json discovery

---

<user-request>
$ARGUMENTS
</user-request>
