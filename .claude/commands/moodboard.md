---
name: moodboard
description: Create and manage product and feature moodboards
agent: sigil-moodboarding
agent_path: .claude/skills/sigil-moodboarding/SKILL.md
preflight:
  - sigil_mounted
---

# /sigil moodboard

Create and manage moodboards that define your product's "taste" at a high level.

## Usage

```
/sigil moodboard                # Create product moodboard
/sigil moodboard product        # Same as above
/sigil moodboard [feature]      # Create feature moodboard
/sigil moodboard --list         # List all moodboards
```

## Arguments

| Argument | Description |
|----------|-------------|
| (none) | Create product moodboard |
| `product` | Create product moodboard (explicit) |
| `[feature]` | Create feature moodboard (e.g., `transactions`) |
| `--list` | Show all existing moodboards |

## What is a Moodboard?

Moodboards capture the high-level "taste" of your product before you dive into individual components:

- **North Stars**: Games and products that inspire the feel
- **Core Feelings**: How key moments should feel (transactions, success, errors)
- **Anti-Patterns**: What your product should NEVER do

## Workflow

```
/sigil moodboard              # Define product taste
      ↓
/sigil moodboard transactions # Define feature taste
      ↓
/sigil taste ClaimButton      # Capture component taste
```

## Product Moodboard Interview

The agent will ask about:

1. **North Stars** - What games/products inspire this product?
2. **Core Feelings** - How should transactions, success, loading, errors feel?
3. **Anti-Patterns** - What patterns should never appear?
4. **References** - Any images or screenshots to include?

## Feature Moodboard Interview

For a feature moodboard, the agent will ask about:

1. **Feature Purpose** - What does this feature do?
2. **Emotional Goal** - What should users feel?
3. **Feel Profile** - The primary feel (with reference)
4. **Components** - What components are involved?

## Output

### Product Moodboard
```
sigil-showcase/moodboards/product.md
```

### Feature Moodboard
```
sigil-showcase/moodboards/features/{feature}.md
```

### Assets
```
sigil-showcase/moodboards/assets/
├── screenshots/      # App screenshots
├── inspirations/     # Reference images
└── anti-patterns/    # What not to do
```

## Examples

### Create Product Moodboard
```
/sigil moodboard

# Interview answers:
# North Stars: RuneScape, Diablo, Linear
# Core Feelings: Heavy transactions, triumphant success
# Anti-Patterns: Generic spinners, fast toasts
```

### Create Feature Moodboard
```
/sigil moodboard transactions

# Interview answers:
# Purpose: Handle staking and claiming
# Emotional Goal: Confident, assured
# Feel: Heavy, deliberate like RuneScape skill confirm
# Components: StakeButton, ClaimButton, TxProgress
```

### List Moodboards
```
/sigil moodboard --list

Sigil Moodboards
================

Product Moodboard:
  - sigil-showcase/moodboards/product.md
    Product: S&F
    Created: 2024-01-15

Feature Moodboards (2):
  - transactions [active]
    Created: 2024-01-16
  - onboarding [draft]
    Created: 2024-01-17

Assets: 5 files
```

## Error Handling

| Condition | Message |
|-----------|---------|
| Not mounted | "Sigil not mounted. Run /sigil mount first." |
| Product exists | "Product moodboard exists. Edit or delete to recreate." |
| Feature exists | "Feature moodboard exists. Edit or delete to recreate." |

## Next Steps

After creating moodboards:
- Add reference images to `assets/`
- Start capturing component taste: `/sigil taste ComponentName`
- View in showcase: `/sigil showcase`
