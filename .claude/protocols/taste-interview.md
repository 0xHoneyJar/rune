# Taste Interview Protocol

> *"Every component tells a story. The interview captures it."*

## Purpose

The taste interview is the core ritual of Sigil - a structured conversation that captures the design decisions behind a component. It transforms implicit knowledge into explicit, searchable, teachable taste.

---

## The 4 Questions

Every taste capture asks these four questions in order:

### Question 1: Problem

**What PROBLEM does this component solve?**

Maps to: `@description`

The answer should explain:
- What user pain this addresses
- What was broken/missing before
- Why this component exists

Example answer:
> "Users didn't know if their claim went through. They rage-clicked because feedback was too subtle."

### Question 2: Feel

**How should this component FEEL?**

Maps to: `@feel` + `@intent`

The answer should describe:
- The emotional quality (heavy, light, playful, serious)
- The tempo (fast, deliberate, patient)
- Any reference metaphors

Example answer:
> "Heavy and deliberate. Like confirming a bank transfer - sacrifice speed for certainty."

### Question 3: Rejection

**What patterns did you REJECT?**

Maps to: `@rejected`

The answer should list:
- Specific patterns considered and refused
- Why they were wrong for this context
- Common defaults that don't fit

Example answer:
> "Spinner - too generic, creates anxiety. Skeleton - feels hollow, clinical. Instant success - users don't trust it."

### Question 4: Reference

**Any REFERENCES or inspirations for this vibe?**

Maps to: `@inspiration`

The answer should include:
- Games, products, or experiences that evoke similar feelings
- Specific moments or interactions to reference
- Cultural touchstones that resonate

Example answer:
> "Bank vault doors - weight equals security. Old Mac startup chime - deliberate, confident."

---

## Interview Flow

### Entry Conditions

Before starting the interview:

1. **Component exists** - The file must exist
2. **Component is JSX/TSX** - Must be a React component (or Vue/Svelte)
3. **Not already captured** - Check for existing `@tier` tag
4. **Context loaded** - Read the component first

### During Interview

Use AskUserQuestion for each question:

```typescript
AskUserQuestion({
  questions: [{
    question: "What PROBLEM does ClaimButton solve?",
    header: "Problem",
    options: [
      { label: "Users were confused", description: "State feedback was unclear" },
      { label: "Actions felt risky", description: "No confirmation of success" },
      { label: "Custom answer", description: "I'll explain in my own words" }
    ],
    multiSelect: false
  }]
})
```

### After Interview

1. **Format JSDoc** - Convert answers to proper tag format
2. **Inject into file** - Write JSDoc above component
3. **Set tier** - Mark as `@tier silver`
4. **Confirm** - Show the user what was captured

---

## Interview Options

### Single Component

```
/sigil taste ClaimButton
```

Captures taste for one specific component.

### Core Loop (Multiple)

```
/sigil taste
```

Interactive loop that:
1. Shows uncaptured components
2. Lets user select one
3. Runs interview
4. Asks if they want to continue

### Deep Mode

```
/sigil taste ClaimButton --deep
```

Enables follow-up questions:
- "Can you elaborate on the feel?"
- "Any specific moment from that game?"
- "Why was that pattern rejected?"

---

## JSDoc Output Format

The interview produces JSDoc in this format:

```typescript
/**
 * @component ClaimButton
 *
 * @description
 * Users didn't know if their claim went through.
 * They rage-clicked because feedback was too subtle.
 *
 * @intent [J] Reduce My Anxiety
 *
 * @feel Heavy, deliberate. Sacrifice speed for certainty.
 *
 * @inspiration
 * - Bank vault doors: weight = security
 * - Old Mac startup chime: deliberate, confident
 *
 * @rejected instant-feedback, spinner, skeleton
 *
 * @tier silver
 * @capturedAt 2024-01-15
 */
export function ClaimButton() { ... }
```

---

## Intent Mapping

After Question 2 (Feel), map to JTBD vocabulary:

| Feel Keywords | Suggested Intent |
|--------------|------------------|
| confident, assured, certain | [J] Reduce My Anxiety |
| heavy, deliberate, weighty | [J] Feel In Control |
| quick, seamless, invisible | [F] Complete A Transaction |
| celebratory, rewarding, earned | [P] Feel Like A Baller |
| connected, shared, social | [S] Signal Status |

Use AskUserQuestion to confirm:
> "Based on the feel, I suggest '[J] Reduce My Anxiety'. Does that fit?"

---

## Error Recovery

### User says "I don't know"

Offer examples from similar components or the product moodboard.

### Answer is too vague

Ask follow-up:
> "Can you give a specific example? Like a game or product that has this feel?"

### Component is too simple

Some components don't need full interviews. Suggest:
> "This looks like a utility component. Mark as uncaptured or capture anyway?"

---

## Agent Behavior

During taste interview, the agent should:

1. **Be curious** - Follow up on interesting answers
2. **Reference vocabulary** - Use JTBD terms when suggesting intent
3. **Connect to moodboard** - If product moodboard exists, reference it
4. **Not judge** - Capture the taste, don't critique it
5. **Be efficient** - Don't over-interview simple components

---

## Related Protocols

- [graduation.md](graduation.md) - Silver → Gold promotion
- [vocabulary-governance.md](vocabulary-governance.md) - JTBD label management
