# Image Tooling Principles

> Expert knowledge for CLI-based image processing. ImageMagick by default, parallel for batch, vips for heavy work.

## Tool Selection

| Operation | Tool | When |
|-----------|------|------|
| Single image | `magick` | Always |
| Batch (<10) | `magick` loop | Simple cases |
| Batch (>10) | `parallel` + magick | Default for batch |
| Heavy work | `vips` | Large files, many ops |
| Video frames | `ffmpeg` extract, `magick` process | Never ffmpeg for WebP with alpha |

---

## Animated WebP with Transparency

**CRITICAL**: ffmpeg corrupts alpha channel in animated WebP. Always use ImageMagick.

### Wrong Approach (ffmpeg)

```bash
# DO NOT DO THIS - corrupts alpha, causes white flash
ffmpeg -framerate 25 -i frames/%04d.png -c:v libwebp output.webp
```

### Correct Approach (ImageMagick)

```bash
# Correct: ImageMagick preserves transparency
magick -delay 4 -loop 0 frames/*.png output.webp

# With specific timing (centiseconds: 4 = 25fps, 10 = 10fps)
magick -delay 4 -loop 0 -dispose Background frames/*.png output.webp
```

### Delay Values

| FPS | Delay Value |
|-----|-------------|
| 60 | 2 |
| 30 | 3 |
| 25 | 4 |
| 20 | 5 |
| 10 | 10 |

---

## Composition Patterns

### Layer Composition

```bash
# Composite foreground over background
magick background.png foreground.png -compose Over -composite output.png

# With positioning
magick background.png foreground.png -geometry +100+50 -compose Over -composite output.png

# Multiple layers
magick background.png \
  \( layer1.png -geometry +10+10 \) -compose Over -composite \
  \( layer2.png -geometry +50+50 \) -compose Over -composite \
  output.png
```

### Transparency Handling

```bash
# Ensure alpha channel exists
magick input.png -alpha on output.png

# Remove background (simple)
magick input.png -fuzz 10% -transparent white output.png

# Preserve transparency in operations
magick input.png -resize 50% -background none -flatten output.png
# WARNING: -flatten destroys transparency. Use -layers merge instead:
magick input.png -resize 50% -background none output.png
```

---

## Batch Processing with GNU Parallel

### Installation

```bash
# macOS
brew install parallel

# Ubuntu/Debian
apt install parallel
```

### Basic Patterns

```bash
# Resize all PNGs
parallel magick {} -resize 400x out/{/} ::: *.png

# Convert format
parallel magick {} {.}.webp ::: *.png

# With progress
parallel --bar magick {} -resize 800x out/{/} ::: *.png
```

### Complex Operations

```bash
# Resize + optimize
parallel 'magick {} -resize 800x -strip -quality 85 out/{/}' ::: *.png

# Multiple operations
parallel 'magick {} -resize 800x -colorspace sRGB -strip out/{/}' ::: *.jpg

# Custom output names
parallel 'magick {} -resize 400x out/{/.}_thumb.{.##*.}' ::: *.png
```

### Performance Comparison

| Files | Sequential | Parallel | Speedup |
|-------|------------|----------|---------|
| 10 | 5s | 2s | 2.5x |
| 50 | 25s | 6s | 4x |
| 143 | 72s | 15s | 4.8x |

---

## High-Performance: vips (libvips)

For heavy workloads (large files, many operations), vips is 5-10x faster than ImageMagick.

### Installation

```bash
# macOS
brew install vips

# Ubuntu/Debian
apt install libvips-tools
```

### Basic Operations

```bash
# Resize
vips resize input.png output.png 0.5  # 50% scale

# Thumbnail (smart crop)
vips thumbnail input.png output.png 400

# Convert to WebP
vips webpsave input.png output.webp
```

### When to Use vips

| Use vips | Use ImageMagick |
|----------|-----------------|
| Files >10MB | Complex compositions |
| Batch >100 files | Animated images |
| Simple transforms | Text/drawing operations |
| Memory constrained | Color space conversions |

---

## Common Gotchas

### 1. Color Space Issues

```bash
# Convert to sRGB for web
magick input.png -colorspace sRGB output.png

# Strip ICC profile but keep sRGB
magick input.png -strip -colorspace sRGB output.png
```

### 2. Resize Quality

```bash
# High quality resize (Lanczos)
magick input.png -filter Lanczos -resize 800x output.png

# Fast resize (for thumbnails)
magick input.png -thumbnail 200x output.png
```

### 3. Memory Limits

```bash
# Set memory limit for large batches
magick -limit memory 2GiB -limit map 4GiB input.png output.png

# Or use streaming with vips
vips resize huge.tif output.png 0.1
```

### 4. File Naming in Loops

```bash
# WRONG: spaces break
for f in *.png; do magick $f out/$f; done

# RIGHT: quote variables
for f in *.png; do magick "$f" "out/$f"; done

# BEST: use parallel (handles edge cases)
parallel magick {} out/{/} ::: *.png
```

---

## Animated WebP Workflow (Full Example)

Complete workflow for creating animated WebP from frames:

```bash
# 1. Extract frames from video (if needed)
ffmpeg -i video.mp4 -vf "fps=25" frames/%04d.png

# 2. Process frames (resize, optimize)
mkdir -p processed
parallel magick {} -resize 400x processed/{/} ::: frames/*.png

# 3. Create animated WebP (ALWAYS use magick, not ffmpeg)
magick -delay 4 -loop 0 processed/*.png output.webp

# 4. Optimize final WebP (optional)
# Use cwebp for additional compression if needed
```

### Multi-tier Output

```bash
# Create multiple sizes
for size in 200 400 800; do
  mkdir -p "tier_${size}"
  parallel magick {} -resize "${size}x" "tier_${size}/{/}" ::: frames/*.png
  magick -delay 4 -loop 0 "tier_${size}/*.png" "output_${size}.webp"
done
```

---

## Quick Reference

```bash
# Resize
magick in.png -resize 800x out.png

# Convert
magick in.png out.webp

# Composite
magick bg.png fg.png -compose Over -composite out.png

# Batch resize
parallel magick {} -resize 400x out/{/} ::: *.png

# Animated WebP
magick -delay 4 -loop 0 frames/*.png out.webp

# High-perf resize
vips resize in.png out.png 0.5
```

---

*Last updated: 2026-01-09*
*Source: Real-world S&F project learnings*
