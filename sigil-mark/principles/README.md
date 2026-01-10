# Principles

> Expert knowledge and implementation wisdom that applies universally across projects.

This is different from `moodboard/` (visual references) or `rules.md` (project-specific design rules).

---

## Principles Index

| Principle | File | Load When |
|-----------|------|-----------|
| Motion Implementation | `motion-implementation.md` | Animations, transitions, Framer Motion usage |
| OKLCH Colors | `color-oklch.md` | Color palettes, theming, dark mode, contrast |
| SVG Patterns | `svg-patterns.md` | Icons, illustrations, SVG optimization |
| Image Tooling | `image-tooling.md` | CLI image processing, batch operations, WebP |

---

## Quick Reference

### Motion Implementation
**When:** Any animation or transition work

- CSS-first approach (90% of cases): hover states, simple fades, keyframe animations
- Framer Motion (10% of cases): exit animations, spring physics, staggered children, gestures, layout animations
- Performance: Use `transform` and `opacity` only, avoid `width`/`height` animations
- Accessibility: Always handle `prefers-reduced-motion`

### OKLCH Colors
**When:** Creating color palettes, theming, accessibility contrast checks

- Perceptually uniform: Same L value = same perceived lightness
- Palette generation: Adjust L for lightness scale, keep H consistent
- Contrast: L difference ~50% for normal text, ~40% for large text
- Dark mode: Flip L values, keep H the same
- Browser support: Chrome 111+, Safari 15.4+, Firefox 113+

### SVG Patterns
**When:** Working with icons, illustrations, or inline SVGs

- ClipPath gotcha: Never use `fill="white"` in clipPath (destroys transparency)
- ViewBox: Must match content bounds exactly
- Theming: Always use `currentColor` for fill/stroke
- Stroke scaling: Use `vector-effect="non-scaling-stroke"` when needed
- Accessibility: `aria-hidden="true"` for decorative, `aria-label` for meaningful
- Optimization: Run through SVGO, keep viewBox and role attributes

### Image Tooling
**When:** CLI image processing, batch operations, animated images

- **CRITICAL**: ffmpeg corrupts alpha in animated WebP - always use ImageMagick
- Animated WebP: `magick -delay 4 -loop 0 frames/*.png output.webp`
- Batch processing: Use GNU Parallel for >10 files
- Large files: Use vips (libvips) for 5-10x performance
- Composition: `magick bg.png fg.png -compose Over -composite out.png`

---

## What Goes Here

- **Implementation approaches** - CSS vs Framer Motion, when to use what
- **Expert patterns** - distilled wisdom from practitioners (Emil, Josh Comeau, etc.)
- **Architecture decisions** - how to structure things that scale
- **Anti-patterns** - common mistakes and how to avoid them
- **Tool expertise** - CLI tools, optimization, workflows

## How Agent Uses This

Agent loads principles **contextually** based on task:

| Task Type | Loads |
|-----------|-------|
| Animation code | `motion-implementation.md` |
| Color/theming work | `color-oklch.md` |
| Icon/SVG work | `svg-patterns.md` |
| Image processing | `image-tooling.md` |
| Multiple concerns | Multiple files as needed |

**Gold Registry Integration (v7.5):** When the agent reads Gold registry and encounters a component with animations, colors, or SVGs, it should load the relevant principle file for implementation guidance.

## Adding New Principles

Drop markdown files here. Use clear naming:
- `{topic}-{aspect}.md` - e.g., `motion-implementation.md`, `form-patterns.md`

Suggested future principles:
- `form-patterns.md` - Form UX and validation
- `accessibility.md` - a11y implementation wisdom
- `api-design.md` - Backend structure patterns
- `responsive-layout.md` - Breakpoints and fluid design
- `performance-web.md` - Web vitals and optimization

No registration needed. Agent discovers contextually from this index.

---

*Last updated: 2026-01-09*
