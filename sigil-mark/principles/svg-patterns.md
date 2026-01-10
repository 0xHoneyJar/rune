# SVG Patterns Principles

> Common SVG gotchas and best practices for icons, illustrations, and graphics.

## Common Gotchas

### 1. ClipPath Fill Destroys Transparency

**Problem**: Using `fill="white"` in clipPath causes transparency loss.

```xml
<!-- WRONG: White fill bleeds through -->
<clipPath id="clip">
  <rect fill="white" width="100" height="100"/>
</clipPath>

<!-- RIGHT: No fill needed in clipPath -->
<clipPath id="clip">
  <rect width="100" height="100"/>
</clipPath>
```

**Why**: ClipPath defines a clipping region by shape, not by color. Fill is ignored but can cause rendering bugs in some browsers.

### 2. ViewBox Must Match Content

**Problem**: Incorrect viewBox causes clipping or scaling issues.

```xml
<!-- WRONG: viewBox doesn't match content -->
<svg viewBox="0 0 100 100" width="24" height="24">
  <path d="M0 0 L200 200"/>  <!-- Path extends beyond viewBox -->
</svg>

<!-- RIGHT: viewBox matches content bounds -->
<svg viewBox="0 0 200 200" width="24" height="24">
  <path d="M0 0 L200 200"/>
</svg>
```

**Fix**: Use design tool's "Fit to content" or calculate bounds manually.

### 3. Stroke Scaling

**Problem**: Strokes scale with viewBox, becoming too thick/thin.

```xml
<!-- Problem: 2px stroke becomes 0.5px at 24x24 -->
<svg viewBox="0 0 96 96" width="24" height="24">
  <circle stroke-width="2" .../>
</svg>

<!-- Fix: Use vector-effect for non-scaling stroke -->
<circle stroke-width="2" vector-effect="non-scaling-stroke" .../>

<!-- Or: Calculate stroke for target size -->
<circle stroke-width="8" .../>  <!-- 8px / 4 scale = 2px visual -->
```

### 4. currentColor for Theming

**Problem**: Hardcoded colors don't theme.

```xml
<!-- WRONG: Hardcoded color -->
<svg>
  <path fill="#000000" d="..."/>
</svg>

<!-- RIGHT: Inherits from CSS color -->
<svg>
  <path fill="currentColor" d="..."/>
</svg>
```

```css
.icon { color: blue; }
.dark .icon { color: white; }
```

---

## ViewBox Best Practices

### Understanding ViewBox

```xml
<svg viewBox="minX minY width height">
<!--
  viewBox="0 0 24 24"
  - Origin at (0, 0)
  - Canvas is 24x24 units
  - Content scales to fit svg width/height
-->
```

### Common Patterns

```xml
<!-- Icon (24x24 standard) -->
<svg viewBox="0 0 24 24" width="24" height="24">

<!-- Icon with padding (content in 20x20, 2px padding) -->
<svg viewBox="-2 -2 28 28" width="24" height="24">

<!-- Preserve aspect ratio (default) -->
<svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">

<!-- Stretch to fill (rarely wanted) -->
<svg viewBox="0 0 100 50" preserveAspectRatio="none">
```

### Calculating ViewBox from Path

```js
// Get bounds from path
const path = document.querySelector('path');
const bbox = path.getBBox();

// viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
```

---

## Stroke vs Fill

### When to Use Each

| Use Stroke | Use Fill |
|------------|----------|
| Line icons | Solid icons |
| Outlines | Shapes |
| Adjustable weight | Simpler paths |
| Variable thickness | Better file size |

### Stroke-Based Icons

```xml
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 12h18M3 6h18M3 18h18"/>
</svg>
```

```css
.icon {
  stroke-width: 2;     /* Default */
}
.icon-bold {
  stroke-width: 2.5;   /* Bolder */
}
.icon-light {
  stroke-width: 1.5;   /* Lighter */
}
```

### Fill-Based Icons

```xml
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2L2 22h20L12 2z"/>
</svg>
```

---

## Transparency Preservation

### Export Settings

When exporting from Figma/Sketch/Illustrator:
- Export as SVG, not PNG
- Disable "Flatten" option
- Keep transparency (no background)

### Checking Transparency

```xml
<!-- Has transparency issues -->
<svg style="background: white">  <!-- Remove this -->
<rect fill="white" .../>          <!-- Remove if not needed -->

<!-- Clean SVG -->
<svg>
  <path fill="currentColor" d="..."/>
</svg>
```

### Embedding Transparent SVGs

```css
/* Background image - transparency works */
.icon {
  background-image: url('icon.svg');
  background-color: transparent;
}

/* Mask - for coloring */
.icon {
  background-color: currentColor;
  mask-image: url('icon.svg');
  mask-size: contain;
}
```

---

## Optimization with SVGO

### Installation

```bash
npm install -g svgo
```

### Basic Usage

```bash
# Optimize single file
svgo icon.svg

# Optimize with output
svgo icon.svg -o icon.min.svg

# Optimize directory
svgo -f ./icons -o ./icons-optimized
```

### Recommended Config

```js
// svgo.config.js
module.exports = {
  plugins: [
    'preset-default',
    'removeDimensions',        // Use viewBox instead of width/height
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name', 'class'],  // Remove unnecessary attrs
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'aria-hidden': 'true' }],
      },
    },
  ],
};
```

### What SVGO Removes

- Editor metadata (Illustrator, Sketch cruft)
- Empty groups and defs
- Unnecessary whitespace
- Redundant attributes
- Comments

### What to Keep

```js
// Preserve these for accessibility/theming
{
  name: 'removeViewBox',
  active: false,  // Keep viewBox
},
{
  name: 'removeUnknownsAndDefaults',
  params: {
    keepRoleAttr: true,  // Keep role="img"
  },
},
```

---

## React SVG Components

### Inline SVG (Preferred)

```tsx
// Icon component
export function CheckIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      {...props}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Usage
<CheckIcon className="w-5 h-5 text-green-500" />
```

### SVGR Setup (Auto-conversion)

```js
// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

```tsx
import CheckIcon from './check.svg';

<CheckIcon className="w-5 h-5" />
```

---

## Accessibility

### Decorative Icons

```xml
<!-- Hide from screen readers -->
<svg aria-hidden="true" focusable="false">
  <path d="..."/>
</svg>
```

### Meaningful Icons

```xml
<!-- With accessible name -->
<svg role="img" aria-label="Success">
  <title>Success</title>
  <path d="..."/>
</svg>

<!-- Or with aria-labelledby -->
<svg role="img" aria-labelledby="success-title">
  <title id="success-title">Success</title>
  <path d="..."/>
</svg>
```

### Icon Buttons

```tsx
// Icon-only button needs label
<button aria-label="Close menu">
  <CloseIcon aria-hidden="true" />
</button>
```

---

## Quick Reference

```xml
<!-- Standard icon template -->
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="..."/>
</svg>

<!-- Filled icon template -->
<svg
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="..."/>
</svg>
```

### Checklist

- [ ] viewBox matches content bounds
- [ ] Using `currentColor` for theming
- [ ] No hardcoded fills/strokes
- [ ] Optimized with SVGO
- [ ] Accessible (aria-hidden or aria-label)
- [ ] No white fills in clipPaths
- [ ] Tested at target sizes

---

*Last updated: 2026-01-09*
