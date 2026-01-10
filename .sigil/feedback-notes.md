# Sigil Feedback Notes

Observations from using Sigil on S&F project.

---

## 2026-01-09

### Background processing for flow state

**Context:** Favicon generation workflow - sequential bash commands (read SVG, create square version, magick resize to multiple sizes, verify output).

**Observation:** User waits for each step to complete even though the operations don't require attention. This interrupts flow state.

**Potential improvement:** Non-blocking operations (image processing, file transformations, build tasks) could run in background with completion notification. Aligns with Law #7: "Never Interrupt Flow."

**Example operations that could background:**
- Image conversion/resizing
- Favicon generation
- Asset optimization
- Workshop rebuilds (already targets <2s, but still blocks)

---

### Design CLI tool expertise

**Context:** Favicon conversion required multiple attempts - SVG had `fill="white"` in clipPath causing transparency loss. Took several magick invocations to diagnose and fix.

**Observation:** Sigil is a "Design Context Framework" but doesn't currently encode expertise in design-adjacent CLI tools (ImageMagick, svgo, sharp, etc.). An agent using Sigil still fumbles through SVG quirks and conversion flags.

**Question:** Should Sigil include:
- Common SVG gotchas (clipPath fills, viewBox issues, stroke vs fill)
- ImageMagick patterns for transparency, resizing, format conversion
- Asset pipeline best practices

**Decision:** YES - Sigil should include design tooling expertise.

**Rationale:** To collaborate efficiently with design teams and optimize for experience, need technical layer that can:
- Compose images together
- Crop and resize
- Optimize for web (compression, formats, responsive sizes)
- Handle SVG manipulation
- Convert between formats with correct transparency/color handling

This makes Sigil the **full design workflow assistant**, not just design system guardian.

**Action needed:** Add `.sigil/tooling.md` or similar with:
- ImageMagick recipes (transparency, composition, batch processing)
- SVG gotchas and fixes
- Web optimization patterns (WebP, AVIF, srcset generation)
- Sharp/squoosh patterns for Node pipelines

**Open question:** Best implementation approach?

Options:
1. **More skills** - dedicated skills for image manipulation, SVG handling, etc.
   - Pro: Modular, clear triggers
   - Con: Feels hard to maintain, skill proliferation

2. **Knowledge file** - `.sigil/tooling.md` with recipes agent references
   - Pro: Single source, easy to update
   - Con: Agent must know to look there

3. **Hybrid** - thin skill that loads tooling knowledge contextually
   - Pro: Best of both?
   - Con: Complexity

**Key insight:** Sigil designs for AI agent implementation layer, not human layer. The agent should be expert at implementation - so tooling knowledge should be optimized for agent consumption (structured, parseable, action-oriented) not human readability.

**Next step:** Deep research on Claude Code skills capabilities to inform architecture decision.

---

### Capturing design references and visualization

**Context:** Mentioned Uniswap/Family as design references during /craft. Screenshots compared typography, navbar width, spacing approaches.

**Observation:** No workflow to capture these references and make them queryable later. Each reference is ephemeral in conversation.

**Potential features:**
- Capture reference sites to a structured format (not just moodboard.md prose)
- Visualize available materials and zones - wireframe-level view
- Mermaid diagrams for flow/zone mapping
- Query "what references have we looked at for navbar patterns?"

**Concern:** Bloat. But this is the vision of what Sigil could do.

---

### Skill architecture and UX philosophy

**Context:** Skills are now callable as commands in CC. But CC seems to be moving away from commands toward natural language.

**Observation:** The only "command" humans should need is basic. Reality should be natural language conversation - the muse.

**Implications for Sigil:**
- Skills should be invisible to user - agent knows when to invoke
- User says "make the navbar like Uniswap" not "/capture-reference uniswap"
- Skills are implementation detail, not UX surface
- If skills are scalable and maintainable, add more - but they should feel seamless

**Challenge:** Multiple architecture layers (skills, hooks, knowledge files, workshop) easy to get lost. Need clear mental model of when each layer applies.

**Requirement:** Must be "drop skill file → agent discovers contextually". No manual registration, no orchestration updates. Plug and play.

---

### What's working well

**Observation:** Sigil feels fluid and fast for prototyping. The current flow doesn't interrupt.

This is the baseline to protect. New features (tooling expertise, reference capture, visualization) must not sacrifice this fluidity.

---

### Chaining simple operations faster

**Context:** Image organization workflow - fix path → mkdir → mv files → search refs → update refs. Each step waited for the previous.

**Observation:** These are predictable, chainable operations. Agent could:
1. Recognize "organize images" as a known workflow
2. Execute mkdir + mv in parallel where possible
3. Pre-compute what references need updating before moving
4. Batch the reference updates

**Positive:** Sigil went the extra mile to organize everything (good initiative). But the sequential execution feels slower than necessary.

**Question:** Can common workflows (asset reorganization, bulk renames, format conversions) have optimized execution paths? Not blocking - just faster.

---

### Vercel's "80% tools removed" insight

**Source:** https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools

**Key findings:**
- Over-engineering with 15+ specialized tools made agent fragile and slow
- Simple approach (bash on well-structured files) was 3.5x faster, 37% fewer tokens, 100% success
- "The best agents might be the ones with the fewest tools"
- "We were constraining the model's reasoning because we didn't trust the model to reason"
- Tools represent choices you're making FOR the model - modern LLMs make better decisions with raw, well-documented data

**Recommended approach:**
1. Start minimal: Model + file system + goal
2. Invest in foundations: Documentation quality, naming conventions, data structure > sophisticated tooling
3. Build for tomorrow's models, not today's constraints

**Implications for Sigil:**
- Maybe fewer skills with better documentation/structure wins
- Workshop index + well-structured files might be more valuable than skill proliferation
- The quality of `.sigil/` data structures matters more than how many skills reference them
- Trust the model to reason over good data rather than constrain it with many tools

**Tension with earlier "drop skill file" idea:**
- Maybe it's not "drop more skill files" but "have one excellent data layer the model reasons over directly"
- Skills become thin wrappers at most, not complex logic

---

### Knowledge hierarchy - beyond design

**Context:** There's tacit/expert knowledge that would be helpful by default. References for "taste at an even higher level than design" - how to structure products that scale (backend to frontend). Valuable lessons from deep research.

**Question:** Where does this live?

Current layers:
1. **Design system** (Sigil focus) - physics, zones, patterns, materials
2. **??? Product taste** - how to structure scalable products, architecture patterns
3. **??? Expert knowledge** - research insights, lessons learned, tacit knowledge

**Is moodboard for this?**
- moodboard.md is currently product feel, visual references
- Could it hold higher-level product structure wisdom?
- Or does that need a separate layer (context/, wisdom/, principles/)?

**Decision:** Separate folders for knowledge layers.

Proposed structure:
- `sigil-mark/moodboard.md` - visual/feel references (current)
- `sigil-mark/principles/` - product architecture wisdom, scaling patterns
- `sigil-mark/context/` - drop-in research, deep dives, expert insights

Agent loads contextually from each based on what's relevant to the task.

**Clarification on default loading:**

Architecture:
- **Sigil repo (mounted)** → universal knowledge/defaults, symlinked to each project
- **Project's sigil-mark/** → project-specific overrides/additions
- **MCPs (Exa, Firecrawl)** → dynamic context fetching (WIP, needs completion/testing)

Mental model (borrowed from Loa as example):
- L1: Active work context (what human curates as relevant NOW)
- L2: Available as secondary (broader knowledge base)
- Human sorts what recent context to pull from, agent has L2 available when needed

Loa has `context/` for task-specific research drops - Sigil could have similar pattern in `sigil-mark/context/` for design-specific research.

**Action:** Exa + Firecrawl MCP integration needs to be completed/tested for dynamic context capture.

**Update:** Created `sigil-mark/principles/` and `sigil-mark/context/` folders. Added `motion-implementation.md` with Emil's CSS-first approach.

---

### OKLCH color expertise

**Observation:** OKLCH is the modern color space for web - perceptually uniform, better for generating palettes, increasingly standard in CSS.

**Question:** Should this be a skill or just knowledge in principles?

Per Vercel insight: probably NOT a dedicated skill. Instead:
- Add `principles/color-oklch.md` with expert knowledge
- Agent reasons over it when color work is needed
- No tool, just good documentation

**What it would cover:**
- OKLCH vs HSL vs RGB - when to use
- Generating harmonious palettes in OKLCH
- Lightness/chroma relationships
- Tailwind integration patterns
- Browser support considerations

---

### ImageMagick stability

**Observation:** ImageMagick (`magick`) has proven more stable in output than alternatives (sharp, jimp, etc. in Node).

**Implication:** When writing design tooling principles, prefer ImageMagick recipes for:
- Format conversion
- Resizing/cropping
- Composition
- Transparency handling

This is practical wisdom from use - should be encoded in `principles/image-tooling.md`.

**Specific example:** Animated WebP with transparency
- ffmpeg WebP encoder corrupted alpha channel (white flash glitches)
- ImageMagick `magick -delay X -loop 0 frames/*.png output.webp` worked perfectly
- Also: `magick -resize` for frame resizing before encoding
- Lesson: ffmpeg is great for video, but ImageMagick for image sequences with alpha

**Workflow that worked:**
1. Composite frames with ImageMagick (preserves colorspace, alpha)
2. Resize frames with ImageMagick
3. Encode animated WebP with ImageMagick (NOT ffmpeg)

This took multiple iterations to figure out - exactly the kind of thing principles should encode so agent doesn't repeat the trial-and-error.

---

### Script performance optimization

**Observation:** Scripts get written correctly but not always optimized for speed. Example: processing 143 frames × 5 tiers sequentially when could parallelize.

**Principles for fast scripts:**
- Use GNU `parallel` for batch operations
- Parallelize independent operations (resize multiple tiers simultaneously)
- Avoid unnecessary subshells in loops
- Use built-in bash features over external commands where possible
- For ImageMagick: batch operations where possible, avoid repeated process spawning

**Example pattern:**
```bash
# Slow: sequential
for f in *.png; do magick "$f" -resize 400x "out/$f"; done

# Fast: parallel
parallel magick {} -resize 400x out/{/} ::: *.png
```

Agent should default to writing performant scripts, not just correct ones.

**Also:** For long-running scripts, run in background (`run_in_background: true`) so user can continue working. Don't block flow waiting for 4+ minute operations. Notify when done.

---

### Rust + GPU for heavy processing

**Question:** Is Rust better/faster than Bash? Is GPU available on Mac?

**Answer:**
- **Rust vs Bash:** Yes, Rust is significantly faster for compute-heavy tasks. Bash is orchestration glue; Rust is actual compute. But Rust has compilation overhead.
- **Mac GPU:** Yes, Metal is available. Can accelerate image processing.

**Options by complexity:**

| Approach | Speed | Complexity | When to use |
|----------|-------|------------|-------------|
| Bash + ImageMagick | Baseline | Low | Most cases, good enough |
| Bash + parallel | 2-4x | Low | Batch operations |
| ImageMagick + OpenCL | 2-5x | Medium | Heavy image ops, needs config |
| `vips` (libvips) | 5-10x | Medium | High volume image processing |
| Rust + `image` crate | 10x+ | High | Custom pipelines, worth compiling |
| Rust + Metal/GPU | 50x+ | High | Video, real-time, massive batches |

**For Sigil context:**
- Default to Bash + parallel (covers 90% of cases)
- Mention vips as faster alternative when relevant
- Rust + GPU is overkill unless user is doing video/real-time

**Real example:** 143 frames × 5 tiers animated WebP took 4-10 minutes. Too slow.
- Should have used parallel from the start
- Should have run in background
- vips might cut this to <1 minute

This is a concrete case where "correct but slow" hurt flow. Agent should proactively optimize for this scale of work.

**Mac-specific fast path:**
- `sips` is built-in and fast for basic operations
- `vips` via homebrew for heavy lifting
- Metal available via Rust crates (`metal-rs`) if truly needed

**Status:** Being addressed - parallel, background, vips optimizations in progress.

---

### Design variant storage (like Figma)

**Context:** Created docs/STATION_MANAGE_DIALOG_LAYOUTS.md to store both vertical and horizontal layout options as reference.

**Observation:** Would be useful to store/save design variants like Figma does:
- Multiple layout options for a component
- A/B test candidates
- Before/after states
- Alternative approaches explored but not chosen

**Question:** Where should these live?
- `docs/` (current approach) - mixed with other docs
- `sigil-mark/variants/` - dedicated space for design alternatives
- `.sigil/variants/` - runtime tracking of explored options

**Potential features:**
- Tag variants with status (exploring, rejected, chosen)
- Link variants to components they're for
- Query "what alternatives did we explore for X?"

---

### File search speed (CK comparison)

**Context:** Loa uses CK for file operations. Sigil uses workshop index + live grep.

**Observation:** Could Sigil better utilize or bypass search for design-related queries? Workshop index is <5ms but discovery still does ripgrep scans.

**Potential:** Pre-index common design file patterns (icons/, assets/, components/) for instant lookup rather than grep on each query.

---
