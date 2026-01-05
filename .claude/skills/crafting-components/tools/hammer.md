# Hammer Tool: Diagnosis

> "Diagnose before you act. Understand the physics before changing anything."

## Purpose

The Hammer is a diagnosis tool. Use it BEFORE making any changes to understand the physics context and determine the correct action.

## When to Use

Use Hammer when:
- User requests a UI change
- User complains about "feel" (slow, heavy, light, etc.)
- Before generating any new component
- Before modifying existing component behavior

## Workflow

### Step 1: Identify the Target

```
What is the user asking about?
- Component: [name]
- File path: [path]
- Request: [user's words]
```

### Step 2: Resolve Zone

```
Zone Resolution:
1. Check file path: [path]
2. Match against zone patterns
3. Zone: [critical/transactional/exploratory/marketing/admin/default]
```

### Step 3: Load Physics

```
Zone Physics:
- sync: [server_authoritative / client_authoritative / collaborative]
- tick: [discrete / continuous]
- tick_rate: [ms]
- material: [clay / machinery / glass]
- budget: [elements, decisions, animations]
```

### Step 4: Analyze Request

```
Request Analysis:

User wants: "[user's request]"

Physics says:
- [constraint 1]
- [constraint 2]
- [constraint 3]

Conflict? [YES / NO]
```

### Step 5: Classify Request

| Classification | Meaning | Action |
|---------------|---------|--------|
| WITHIN_PHYSICS | Request can be done within physics | Proceed to Chisel |
| BUDGET_VIOLATION | Exceeds budget but physics allows | Report, offer Taste Key override |
| IMPOSSIBLE | Violates physics constraints | Block, explain why |
| STRUCTURAL | Requires changing zone physics | Route to Loa |

### Step 6: Generate Diagnosis

```
HAMMER DIAGNOSIS
================

Target: [component/path]
Zone: [zone name]
Material: [material name]

User Request: "[request]"

Physics Context:
- Sync: [authority] → [implication]
- Tick: [mode] ([rate]) → [implication]
- Material: [material] → [implication]

Classification: [WITHIN_PHYSICS / BUDGET_VIOLATION / IMPOSSIBLE / STRUCTURAL]

Recommendation:
[Next action based on classification]
```

## Example: The Linear Test

```
User: "The claim button feels slow"

HAMMER DIAGNOSIS
================

Target: ClaimButton
Zone: critical (matches **/claim/**)
Material: clay

User Request: "feels slow"

Physics Context:
- Sync: server_authoritative → NO optimistic UI allowed
- Tick: discrete (600ms) → UI MUST wait for tick boundary
- Material: clay → Weight is INTENTIONAL (heavy spring, depress)

Classification: User is describing physics as a bug.

Recommendation:
The "slowness" is intentional. This is the TRUST mechanism.

Options:
A. Educate user on physics (explain why)
B. Route to Loa if structural change needed
C. Get Taste Key approval for override

The button is working as designed. Proceed with care.
```

## Physics Quick Reference

### server_authoritative

```
CONSTRAINTS:
- NO optimistic updates
- MUST wait for server confirmation
- MUST show pending state
- MUST disable interaction during pending

VIOLATIONS:
- Instant state change without server
- Hiding pending state
- Enabling interaction during pending
```

### client_authoritative

```
CONSTRAINTS:
- Optimistic updates EXPECTED
- Show instant feedback
- Background sync

VIOLATIONS:
- Unnecessary loading states
- Waiting for server before UI update
```

### discrete tick

```
CONSTRAINTS:
- Animations complete within tick boundary
- State changes happen on tick
- Visual delay matches tick rate

VIOLATIONS:
- Continuous animations
- Instant state changes
- Bypassing tick boundary
```

### continuous tick

```
CONSTRAINTS:
- Smooth, immediate feedback
- No artificial delays

VIOLATIONS:
- Adding unnecessary delays
- Discrete stepping
```

## Output Format

Always output in this format:

```
HAMMER DIAGNOSIS
================
Target: [what]
Zone: [zone]
Material: [material]

Request: "[what user asked]"

Physics:
- [key constraint 1]
- [key constraint 2]

Classification: [type]

Recommendation: [action]
```

Then decide: Proceed to Chisel, or escalate?
