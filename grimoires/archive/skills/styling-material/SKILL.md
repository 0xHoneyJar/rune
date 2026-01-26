# Styling Material Skill

Apply material physics to components. Material = how it looks.

---

## Core Principle

```
Surface keywords → Material physics → Style code
```

Material is the third layer of design physics. It determines surface treatment, shadows, typography, and grit.

---

## Workflow

### Step 1: Discover Context

**1a. Read taste log** (if exists):
- Shadow preferences (soft vs none)
- Border styles (outline vs filled)
- Radius preferences
- Grit level

**1b. Check styling approach**:
- `tailwindcss` → utility classes
- `styled-components` / `@emotion` → CSS-in-JS
- `css-modules` → scoped CSS

**1c. Read existing component** for conventions.

### Step 2: Detect Material Intent

| Keyword | Treatment |
|---------|-----------|
| glassmorphism | blur backdrop, transparency, subtle border |
| neumorphism | soft inner/outer shadows, same-color depth |
| flat | no shadows, solid colors |
| elevated | shadow, slight lift |
| outlined | border only, transparent bg |
| ghost | no border, no bg, text only |
| gradient | brand gradient, max 2 stops |
| minimal | reduce all visual elements |
| retro, pixel | apply grit signatures |

### Step 3: Show Material Analysis

```
┌─ Material Analysis ────────────────────────────────────┐
│                                                        │
│  Component:    [ComponentName]                         │
│  Surface:      [glassmorphism/flat/elevated/etc]       │
│                                                        │
│  Fidelity:     Gradient: [None/2-stop]                │
│                Shadow: [None/soft/elevated]           │
│                Border: [None/subtle/solid]            │
│                Radius: [Xpx]                          │
│                                                        │
│  Grit:         [Clean/Subtle/Retro/Pixel]             │
│                                                        │
│  Ergonomics:                                           │
│  [✓/✗] Touch ≥44px  [✓/✗] Focus ring  [✓/✗] Contrast │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 4: Apply Styles

Only modify style-related code:
- className / style props
- CSS variables / tokens
- Shadow, border, radius, background values

Do NOT modify:
- Event handlers
- State management
- Animation timing/easing
- Data fetching logic

### Step 5: Collect Feedback

> "Does this look right for your product's personality?"

Listen for material language:
- "too heavy/light" → shadow adjustment
- "feels cold/warm" → color palette
- "too sharp/soft" → radius and edges

### Step 6: Log Taste Signal

```markdown
## [YYYY-MM-DD HH:MM] | [SIGNAL]
Component: [name]
Layer: Material
Surface: [treatment type]
Values: shadow=[value], radius=[Xpx], grit=[profile]
---
```

---

## Material Quick Reference

| Surface | Shadow | Border | Blur | Radius |
|---------|--------|--------|------|--------|
| glassmorphism | lg | white/20 | Yes | 16px |
| flat | None | Optional | No | 8px |
| elevated | md-lg | None | No | 8px |
| outlined | None | solid | No | 8px |
| ghost | None | None | No | 4px |

---

## Fidelity Constraints

Never exceed:
- Gradients: 2 stops max
- Shadows: 1 layer max
- Borders: 1px solid (2px only for focus)
- Border-radius: 16px max (pill = 9999px OK for pills only)

---

## When NOT to Use /style

- **Behavior is wrong**: Use `/behavior`
- **Animation is wrong**: Use `/animate`
- **Everything is wrong**: Use `/craft`
- **Single value change**: Use Edit tool directly

Rule: /style is for surface treatment only.
