# Vocabulary Governance Protocol

> *"Eileen owns the language. The guild speaks it."*

## Purpose

The vocabulary defines the Jobs-To-Be-Done (JTBD) labels used across all Sigil captures. This protocol governs how the vocabulary is maintained, extended, and applied.

---

## Vocabulary Structure

The vocabulary lives at `vocabulary/vocabulary.md` and contains:

1. **JTBD Labels** - The 10 canonical labels
2. **Categories** - Functional, Personal, Social groupings
3. **Descriptions** - What each label means
4. **Examples** - Sample component mappings

---

## The 10 Labels

### Functional [F]

| Label | Meaning |
|-------|---------|
| [F] Complete A Transaction | User wants to finish an action |
| [F] Access My Information | User wants to see their data |
| [F] Coordinate With Others | User wants to work with team |

### Personal [P]

| Label | Meaning |
|-------|---------|
| [P] Feel Like A Baller | User wants to feel successful |
| [P] Feel Informed | User wants to understand status |

### Social [S]

| Label | Meaning |
|-------|---------|
| [S] Signal Status | User wants others to see success |
| [S] Feel Like An Insider | User wants belonging |

### Job [J]

| Label | Meaning |
|-------|---------|
| [J] Reduce My Anxiety | User wants less stress |
| [J] Feel In Control | User wants agency |
| [J] Maintain Momentum | User wants flow state |

---

## Ownership Model

### Vocabulary Owner

**Eileen** (or designated design lead) owns the vocabulary:
- Can add new labels
- Can modify descriptions
- Can deprecate unused labels
- Approves all changes

### Contributors

Anyone can:
- Propose new labels
- Suggest description changes
- Report label confusion
- Map components to labels

### Agent Role

The agent:
- Suggests labels during taste capture
- Never adds new labels without approval
- References vocabulary during queries
- Maintains consistent usage

---

## Adding New Labels

### Process

1. **Proposal** - Document the need for a new label
2. **Justification** - Why existing labels don't fit
3. **Examples** - 3+ components that would use it
4. **Review** - Vocabulary owner approves
5. **Addition** - Add to vocabulary.md

### Proposal Template

```markdown
## Label Proposal: [X] New Label Name

### Need
[Why do we need this label?]

### Gap
[Why don't existing labels cover this?]

### Examples
- ComponentA: [explanation]
- ComponentB: [explanation]
- ComponentC: [explanation]

### Suggested Category
[Functional / Personal / Social / Job]

### Proposed by
[Name] - [Date]
```

---

## Deprecating Labels

If a label is:
- Never used in captures
- Confusingly similar to another
- No longer relevant to product

It can be deprecated:

1. Mark as `[DEPRECATED]` in vocabulary.md
2. Migrate existing captures to replacement label
3. Remove after 30 days if no objections

---

## Category Guidelines

### Functional [F]

Use when the job is about **completing a task**:
- Transactions
- Information retrieval
- Coordination

The user's goal is external - something happens in the world.

### Personal [P]

Use when the job is about **how the user feels**:
- Pride
- Understanding
- Accomplishment

The user's goal is internal - they feel something.

### Social [S]

Use when the job is about **how others perceive**:
- Status
- Belonging
- Recognition

The user's goal involves other people.

### Job [J]

Use when the job is about **emotional state management**:
- Anxiety reduction
- Control
- Flow

The user's goal is maintaining a mental state.

---

## Label Selection During Capture

### Agent Behavior

During taste interview Question 2 (Feel), the agent:

1. **Listens for keywords** - "confident", "in control", "celebrating"
2. **Suggests label** - Based on feel description
3. **Confirms with user** - "I suggest [J] Reduce My Anxiety. Does that fit?"
4. **Accepts correction** - User can choose different label

### Keyword Mapping

| Keywords | Suggested Label |
|----------|----------------|
| confident, assured, certain | [J] Reduce My Anxiety |
| heavy, deliberate, in control | [J] Feel In Control |
| quick, done, complete | [F] Complete A Transaction |
| proud, winning, baller | [P] Feel Like A Baller |
| informed, aware, understanding | [P] Feel Informed |
| showing off, flex, status | [S] Signal Status |
| insider, belonging, club | [S] Feel Like An Insider |
| flowing, uninterrupted, smooth | [J] Maintain Momentum |
| together, team, coordinated | [F] Coordinate With Others |
| my data, my info, access | [F] Access My Information |

---

## Vocabulary Sync

The vocabulary is stored in the Sigil framework repo:
- Location: `vocabulary/vocabulary.md`
- Synced to products via mount
- Products cannot modify (read-only)

Changes to vocabulary require:
1. PR to Sigil repo
2. Vocabulary owner approval
3. Release of new Sigil version
4. `/sigil update` on products

---

## Agent Instructions

When working with vocabulary:

1. **Always reference** - Check vocabulary before suggesting labels
2. **Never invent** - Don't create new labels without approval
3. **Be consistent** - Use exact label text including prefix
4. **Help discovery** - Suggest labels based on feel keywords
5. **Accept corrections** - User knows their intent better

---

## Related Protocols

- [taste-interview.md](taste-interview.md) - Uses vocabulary during capture
- [graduation.md](graduation.md) - Labels persist through graduation
