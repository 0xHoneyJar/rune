# OKLCH Color Principles

> OKLCH is a perceptually uniform color space. Use it for generating palettes, creating accessible contrast, and building consistent color scales.

## Why OKLCH?

### Color Space Comparison

| Property | RGB | HSL | OKLCH |
|----------|-----|-----|-------|
| Perceptually uniform | No | No | Yes |
| Consistent lightness | No | No | Yes |
| Gamut mapping | None | None | Built-in |
| Palette generation | Hard | Medium | Easy |
| Accessible contrast | Calculate | Calculate | Read L value |

### The Problem with HSL

```css
/* HSL: Same saturation, different perceived lightness */
--blue: hsl(220, 80%, 50%);   /* Looks dark */
--yellow: hsl(60, 80%, 50%);  /* Looks bright */

/* OKLCH: Same L value = same perceived lightness */
--blue: oklch(60% 0.15 250);   /* Looks similar brightness */
--yellow: oklch(60% 0.15 90);  /* Looks similar brightness */
```

---

## OKLCH Syntax

```css
oklch(L C H / A)
/*
  L = Lightness (0% to 100%)
  C = Chroma (0 to ~0.4, depends on hue)
  H = Hue (0 to 360, degrees)
  A = Alpha (optional, 0 to 1)
*/
```

### Key Values

| L Value | Meaning |
|---------|---------|
| 0% | Black |
| 50% | Mid-tone |
| 100% | White |
| ~55% | Good for text on white |
| ~85% | Good for backgrounds |

| C Value | Meaning |
|---------|---------|
| 0 | Gray (no color) |
| 0.1 | Muted |
| 0.2 | Saturated |
| 0.3+ | Vivid (may clip) |

---

## Generating Palettes

### Lightness Scale (Same Hue)

```css
:root {
  /* Blue palette - consistent perceptual steps */
  --blue-50:  oklch(97% 0.02 250);
  --blue-100: oklch(93% 0.04 250);
  --blue-200: oklch(85% 0.08 250);
  --blue-300: oklch(75% 0.12 250);
  --blue-400: oklch(65% 0.16 250);
  --blue-500: oklch(55% 0.18 250);  /* Base */
  --blue-600: oklch(48% 0.16 250);
  --blue-700: oklch(40% 0.14 250);
  --blue-800: oklch(32% 0.12 250);
  --blue-900: oklch(24% 0.10 250);
  --blue-950: oklch(16% 0.08 250);
}
```

### Dynamic Palette with CSS Variables

```css
:root {
  --hue: 250;  /* Blue */
  --chroma: 0.15;
}

.color-system {
  --50:  oklch(97% calc(var(--chroma) * 0.1) var(--hue));
  --100: oklch(93% calc(var(--chroma) * 0.3) var(--hue));
  --500: oklch(55% var(--chroma) var(--hue));
  --900: oklch(24% calc(var(--chroma) * 0.7) var(--hue));
}

/* Change entire palette by adjusting hue */
.theme-purple { --hue: 300; }
.theme-green { --hue: 150; }
```

---

## Tailwind CSS Integration

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'oklch(97% 0.02 var(--primary-hue))',
          100: 'oklch(93% 0.04 var(--primary-hue))',
          200: 'oklch(85% 0.08 var(--primary-hue))',
          300: 'oklch(75% 0.12 var(--primary-hue))',
          400: 'oklch(65% 0.16 var(--primary-hue))',
          500: 'oklch(55% 0.18 var(--primary-hue))',
          600: 'oklch(48% 0.16 var(--primary-hue))',
          700: 'oklch(40% 0.14 var(--primary-hue))',
          800: 'oklch(32% 0.12 var(--primary-hue))',
          900: 'oklch(24% 0.10 var(--primary-hue))',
        },
      },
    },
  },
}
```

### Usage in CSS

```css
@layer base {
  :root {
    --primary-hue: 250;  /* Blue */
  }

  .dark {
    --primary-hue: 250;  /* Same hue, palette adjusts */
  }
}
```

### Usage in Components

```html
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Click me
</button>
```

---

## Accessible Contrast

### Quick Contrast Check

WCAG contrast depends on lightness difference:

```
L difference needed:
- Large text (18px+): ~40% L difference
- Normal text: ~50% L difference
- AAA: ~60% L difference
```

```css
/* Accessible text on white (L=100%) */
--text-body: oklch(35% 0.05 0);      /* L=35%, diff=65% - AAA */
--text-muted: oklch(55% 0.03 0);     /* L=55%, diff=45% - AA large */
--text-subtle: oklch(65% 0.02 0);    /* L=65%, diff=35% - decorative only */

/* Accessible text on dark (L=15%) */
--dark-text-body: oklch(90% 0.02 0); /* L=90%, diff=75% - AAA */
--dark-text-muted: oklch(70% 0.02 0);/* L=70%, diff=55% - AA */
```

### Contrast Calculation

```js
// Rough contrast from L values (not exact WCAG, but useful guide)
function roughContrast(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// For exact WCAG, convert to luminance first
```

---

## Dark Mode with OKLCH

### Strategy: Flip Lightness, Keep Hue

```css
:root {
  /* Light mode */
  --surface: oklch(98% 0.01 var(--hue));
  --text: oklch(20% 0.02 var(--hue));
  --accent: oklch(55% 0.18 var(--hue));
}

.dark {
  /* Dark mode - flip L values */
  --surface: oklch(15% 0.02 var(--hue));
  --text: oklch(90% 0.02 var(--hue));
  --accent: oklch(65% 0.18 var(--hue));  /* Slightly lighter for dark bg */
}
```

### Automatic Dark Palette

```css
:root {
  --l-surface: 98%;
  --l-text: 20%;
  --l-accent: 55%;
}

.dark {
  --l-surface: 15%;
  --l-text: 90%;
  --l-accent: 65%;
}

.surface { background: oklch(var(--l-surface) 0.01 var(--hue)); }
.text { color: oklch(var(--l-text) 0.02 var(--hue)); }
.accent { color: oklch(var(--l-accent) 0.18 var(--hue)); }
```

---

## Browser Support

### Current Support (2024+)

| Browser | Support |
|---------|---------|
| Chrome 111+ | Full |
| Safari 15.4+ | Full |
| Firefox 113+ | Full |
| Edge 111+ | Full |

### Fallback Strategy

```css
/* Fallback for older browsers */
.button {
  background: #3b82f6;  /* Fallback hex */
  background: oklch(60% 0.18 250);  /* Modern */
}

/* Or use @supports */
@supports (color: oklch(0% 0 0)) {
  .button {
    background: oklch(60% 0.18 250);
  }
}
```

---

## Common Hue Values

| Color | Hue (H) |
|-------|---------|
| Red | 25-30 |
| Orange | 50-60 |
| Yellow | 85-95 |
| Green | 140-150 |
| Cyan | 190-200 |
| Blue | 250-260 |
| Purple | 290-300 |
| Pink | 0-10 or 350-360 |

---

## Quick Reference

```css
/* Generate a palette */
--base: oklch(55% 0.15 250);  /* Pick L, C, H */
--lighter: oklch(75% 0.12 250);  /* Increase L, decrease C slightly */
--darker: oklch(35% 0.12 250);   /* Decrease L */

/* Accessible text */
--on-light: oklch(35% 0.05 0);  /* L < 40% for white bg */
--on-dark: oklch(90% 0.02 0);   /* L > 85% for dark bg */

/* Muted variant */
--muted: oklch(55% 0.05 250);   /* Lower C = less saturated */

/* Vivid variant */
--vivid: oklch(55% 0.25 250);   /* Higher C = more saturated */
```

---

## Tools

- [oklch.com](https://oklch.com) - Interactive picker
- [huetone.ardov.me](https://huetone.ardov.me) - Palette generator
- [colorjs.io](https://colorjs.io) - JS library for color conversions

---

*Last updated: 2026-01-09*
