# Sigil Capturing Taste Skill

> *"Every component earns its place through deliberate craft."*

## Purpose

Capture component taste through the 4 Questions interview. Writes JSDoc annotations directly to source files, making the filesystem the single source of truth.

## The 4 Questions

Every component must answer these questions to earn Silver tier:

### Question 1: What problem does this solve?
- Document the specific user problem
- Include context about when/why this appears
- Capture the user's emotional state when encountering it

### Question 2: How should it feel?
- Describe the emotional quality (heavy, light, snappy, deliberate)
- Reference games, products, or experiences that inspire this feel
- Must be visceral and experiential, not just functional

### Question 3: What patterns are rejected?
- Explicitly list patterns NOT to use
- Include reasons why they're rejected
- Prevents future suggestions of these patterns

### Question 4: What inspired this?
- Games, products, or specific UI references
- Be specific (e.g., "RuneScape bank interface" not just "games")
- Multiple inspirations are encouraged

---

## Invocation Modes

### Mode 1: Capture Single Component
```
/sigil taste ComponentName
```

Finds the component, runs 4 Questions interview, writes JSDoc.

### Mode 2: List Captured Components
```
/sigil taste --list
```

Shows inventory grouped by tier:
- Gold: Production-proven with physics
- Silver: 4 Questions answered
- Uncaptured: No JSDoc yet

### Mode 3: Graduate Component
```
/sigil taste graduate ComponentName
```

Promotes Silver → Gold. Requires:
- Production usage proof
- Physics parameters (for interactive)
- Taste owner assignment

---

## Capture Workflow

### Step 1: Locate Component

```bash
# Search for component file
find src -name "*ComponentName*" -type f | head -5
```

If multiple matches, ask user to confirm which file.

### Step 2: Read Current State

```bash
# Check if already captured
grep -l "@component ComponentName" src/components/**/*
```

Read the file to understand current implementation.

### Step 3: Run 4 Questions Interview

Use AskUserQuestion with structured questions:

```yaml
questions:
  - question: "What specific user problem does ComponentName solve?"
    header: "Problem"
    options:
      - label: "Loading feedback"
        description: "Users need to know something is happening"
      - label: "Action confirmation"
        description: "Users need to confirm an irreversible action"
      - label: "Data display"
        description: "Users need to see organized information"
      - label: "Input collection"
        description: "Users need to provide information"
    multiSelect: false

  - question: "How should this component feel when users interact with it?"
    header: "Feel"
    options:
      - label: "Heavy & deliberate"
        description: "Weighty, important, considered actions"
      - label: "Light & snappy"
        description: "Quick, responsive, immediate feedback"
      - label: "Calm & reassuring"
        description: "Reduces anxiety, builds confidence"
      - label: "Playful & delightful"
        description: "Fun, surprising, memorable"
    multiSelect: false

  - question: "What patterns should be explicitly REJECTED for this component?"
    header: "Rejected"
    options:
      - label: "Spinners"
        description: "Generic loading indicators"
      - label: "Skeletons"
        description: "Placeholder loading states"
      - label: "Modals"
        description: "Popup dialogs"
      - label: "Toasts"
        description: "Transient notifications"
    multiSelect: true

  - question: "What inspired the feel of this component?"
    header: "Inspiration"
    options:
      - label: "RuneScape"
        description: "Oldschool MMO aesthetics"
      - label: "Figma"
        description: "Modern design tool UX"
      - label: "Apple"
        description: "Refined, polished interactions"
      - label: "Game UI"
        description: "Other game references"
    multiSelect: true
```

### Step 4: Validate Intent Label

Present JTBD labels from vocabulary.md:

```yaml
questions:
  - question: "Which Job-to-be-Done does this component primarily serve?"
    header: "Intent"
    options:
      - label: "[J] Make Transaction"
        description: "Functional: Execute a transaction"
      - label: "[J] Reassure Me This Is Safe"
        description: "Personal: Build confidence in safety"
      - label: "[J] Reduce My Anxiety"
        description: "Personal: Calm user concerns"
      - label: "[J] Help Me Feel Like An Insider"
        description: "Social: Create belonging"
    multiSelect: false
```

**CRITICAL**: Only use labels from vocabulary/vocabulary.md. Never invent new labels.

### Step 5: Write JSDoc

Insert or update JSDoc block at component definition:

```typescript
/**
 * @component ComponentName
 * @description [Problem from Q1]
 * @feel [Feel from Q2]
 * @rejected [Patterns from Q3, comma-separated]
 * @inspiration [References from Q4]
 * @intent [J] Label from vocabulary
 * @tier silver
 * @captured_at YYYY-MM-DD
 * @captured_by Sigil
 */
```

### Step 6: Confirm Success

```
✓ Captured taste for ComponentName

Tags written:
  @description: Users rage-clicked due to subtle loading feedback
  @feel: Heavy, deliberate
  @rejected: spinner, skeleton
  @inspiration: RuneScape skill progress, Diablo loot drop
  @intent: [J] Reduce My Anxiety
  @tier: silver

To graduate to Gold:
  /sigil taste graduate ComponentName
```

---

## JSDoc Tag Reference

| Tag | Purpose | Required | Tier |
|-----|---------|----------|------|
| `@component` | Component name | Yes | All |
| `@description` | Problem solved | Yes | All |
| `@feel` | How it should feel | Yes | All |
| `@rejected` | Patterns to avoid | Yes | All |
| `@inspiration` | References | Recommended | All |
| `@intent` | JTBD label | Yes | All |
| `@tier` | silver or gold | Yes | All |
| `@captured_at` | Date captured | Auto | All |
| `@captured_by` | Who captured | Auto | All |
| `@physics` | Animation params | Required | Gold (interactive) |
| `@tasteOwner` | Who defends taste | Required | Gold |
| `@states` | State-specific feel | If distinct | Any |
| `@critical_path` | Core user loop | If applicable | Any |

---

## Graduation Protocol

### Requirements for Gold

1. **Production Proof**: Component has been used in production
2. **Physics (interactive only)**: Spring tension, friction, delay documented
3. **Taste Owner**: Named person who defends the component's feel

### Graduation Questions

```yaml
questions:
  - question: "Has ComponentName been used in production successfully?"
    header: "Proof"
    options:
      - label: "Yes, shipped"
        description: "Live in production with positive results"
      - label: "Not yet"
        description: "Still in development/staging"
    multiSelect: false

  - question: "Who owns the taste of this component?"
    header: "Owner"
    options:
      - label: "Design Lead"
        description: "Primary designer responsible"
      - label: "Product Lead"
        description: "Product manager responsible"
      - label: "Engineering Lead"
        description: "Lead engineer responsible"
    multiSelect: false
```

### Physics Capture (Interactive Components)

For interactive Gold components:

```yaml
questions:
  - question: "What are the physics parameters for this component?"
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
    multiSelect: false
```

---

## Listing Components

### Output Format

```
Sigil Component Inventory
═════════════════════════

GOLD (2 components)
  ClaimButton     @feel: Heavy, deliberate    @owner: Eileen
  JoyfulLoader    @feel: Playful, reassuring  @owner: Eileen

SILVER (5 components)
  VaultCard       @feel: Secure, solid
  TokenSelector   @feel: Light, explorative
  StakePanel      @feel: Considered, weighty
  RewardToast     @feel: Celebratory, brief
  ErrorBoundary   @feel: Calm, helpful

UNCAPTURED (12 components)
  Button, Input, Modal, Card, Tooltip...

Run /sigil taste [name] to capture taste.
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Component not found" | File doesn't exist | Check component name spelling |
| "Already captured" | JSDoc exists | Use --force to recapture |
| "Invalid intent label" | Label not in vocabulary | Use label from vocabulary.md |
| "Not a Silver component" | Trying to graduate uncaptured | Capture first with /sigil taste |

---

## Agent Behavior

When user runs `/sigil taste`:

1. **Without arguments**: Ask what they want to do (capture, list, graduate)
2. **With component name**: Find component, run 4 Questions
3. **With --list**: Show tier inventory
4. **With graduate [name]**: Run graduation protocol

Always:
- Validate intent labels against vocabulary.md
- Never invent new JTBD labels
- Write JSDoc directly to source files
- Confirm changes before writing
