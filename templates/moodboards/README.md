# Moodboards

This directory contains the product and feature moodboards that define the "taste" of your product.

## Structure

```
moodboards/
├── product.md          # Product-level moodboard (required)
├── features/           # Feature-specific moodboards
│   ├── transactions.md
│   ├── onboarding.md
│   └── ...
├── assets/             # Reference images (Git LFS tracked)
│   ├── screenshots/
│   ├── inspirations/
│   └── anti-patterns/
└── README.md           # This file
```

## Getting Started

1. **Create product moodboard** (`/sigil moodboard` or edit manually)
2. **Add reference images** to `assets/`
3. **Create feature moodboards** as needed

## What Goes Here

### Product Moodboard
- North stars (games, products that inspire the feel)
- Core feelings by context (transactions, success, loading, errors)
- Anti-patterns to avoid
- Visual references and color inspiration

### Feature Moodboards
- Specific feel for a feature area
- Component mapping
- Interaction states
- Physics notes for animations

## Linking to Components

Moodboards connect to components via the `@intent` JSDoc tag:

```tsx
/**
 * @tier silver
 * @intent [F] Complete A Transaction
 * @feel Heavy, deliberate - like RuneScape skill confirm
 * @moodboard features/transactions.md
 */
export function ClaimButton() { ... }
```

## Git LFS

Image assets are tracked with Git LFS. The `.gitattributes` file is included in this template.

To set up LFS:
```bash
git lfs install
git lfs track "*.png" "*.jpg" "*.gif"
```

## Quick Reference

| File | Purpose |
|------|---------|
| `product.md` | Overall product feel |
| `features/*.md` | Feature-specific feel |
| `assets/*` | Reference images |
