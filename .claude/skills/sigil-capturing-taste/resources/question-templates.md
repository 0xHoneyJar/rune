# Question Templates

Templates for the 4 Questions interview. Use with AskUserQuestion tool.

---

## Question 1: Problem

```yaml
question: "What specific user problem does {ComponentName} solve?"
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
```

---

## Question 2: Feel

```yaml
question: "How should this component feel when users interact with it?"
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
```

---

## Question 3: Rejected Patterns

```yaml
question: "What patterns should be explicitly REJECTED for this component?"
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
```

---

## Question 4: Inspiration

```yaml
question: "What inspired the feel of this component?"
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

---

## Question 5: Intent (JTBD)

```yaml
question: "Which Job-to-be-Done does this component primarily serve?"
header: "Intent"
options:
  # Functional
  - label: "[J] Make Transaction"
    description: "Functional: Execute a transaction"
  - label: "[J] Find Information"
    description: "Functional: Locate data"
  - label: "[J] Organize Assets"
    description: "Functional: Arrange items"
  # Personal
  - label: "[J] Reassure Me This Is Safe"
    description: "Personal: Build confidence in safety"
  - label: "[J] Help Me Feel Smart"
    description: "Personal: Feel capable"
  - label: "[J] Give Me Peace of Mind"
    description: "Personal: Anxiety reduction"
  - label: "[J] Reduce My Anxiety"
    description: "Personal: Calm user concerns"
  # Social
  - label: "[J] Help Me Look Smart, Cool"
    description: "Social: Seek social approval"
  - label: "[J] Help Me Feel Like An Insider"
    description: "Social: Create belonging"
  - label: "[J] Let Me Express My Identity"
    description: "Social: Personalization"
multiSelect: false
```

---

## Graduation Questions

### Production Proof

```yaml
question: "Has {ComponentName} been used in production successfully?"
header: "Proof"
options:
  - label: "Yes, shipped"
    description: "Live in production with positive results"
  - label: "Not yet"
    description: "Still in development/staging"
multiSelect: false
```

### Taste Owner

```yaml
question: "Who owns the taste of this component?"
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

### Physics

```yaml
question: "What are the physics parameters for this component?"
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

## Custom Questions

When default options don't fit, allow "Other" with free-form input:

```yaml
questions:
  - question: "What problem does this solve?"
    header: "Problem"
    options:
      - label: "Loading feedback"
        description: "Users need to know something is happening"
      - label: "Action confirmation"
        description: "Users need to confirm an irreversible action"
      # User can always select "Other" and type custom response
    multiSelect: false
```

The AskUserQuestion tool automatically adds an "Other" option for custom input.
