# Sigil - Product Requirements Document

```
    ╔═══════════════════════════════════════════════╗
    ║  ✦ SIGIL                                      ║
    ║  "The Grimoire That Teaches AI Design Physics"║
    ║                                               ║
    ║  Effect is truth. Physics over preferences.   ║
    ╚═══════════════════════════════════════════════╝
```

**Version**: 2.0.0
**Last Updated**: 2026-01-16
**Status**: Discovery Phase Complete
**Owner**: THJ Team
**Supersedes**: v10.1 "Usage Reality" (internal)

---

## Executive Summary

Sigil is evolving from an internal design physics framework into a **Loa Construct** — a distributable AI agent skill pack that teaches Claude how to generate UI components with correct design physics.

**Key Objectives**:
1. Package Sigil as a Loa Construct for the constructs.network registry
2. Define Sigil-specific skills for design physics (craft, style, animate, behavior)
3. Preserve the three-layer physics model: Behavioral + Animation + Material = Feel
4. Enable taste accumulation across projects

---

## 1. Problem Statement

### 1.1 Current State

Sigil exists as a working framework within this repository with:

| Category | Count | Status |
|----------|-------|--------|
| Physics rules (`.claude/rules/`) | 18 files | Complete |
| Commands (`.claude/commands/`) | 29 files | Complete |
| Skills (`.claude/skills/`) | 14 skills | Complete |
| Protocols (`.claude/protocols/`) | 27 files | Complete |
| React implementation rules | 7 files | Complete |
| Reference patterns | 5+ golden examples | Complete |

**Total rule files**: ~100KB of design physics knowledge

### 1.2 Migration Gap

1. **No manifest.json** — Pack structure not defined for Loa Constructs
2. **No index.yaml for skills** — Skills lack the 3-level architecture metadata
3. **Skills not Sigil-specific** — Many are generic Loa skills, not design-physics focused
4. **No pack-level documentation** — README not structured for registry consumption
5. **No command routing metadata** — Commands lack YAML frontmatter for routing

### 1.3 Why Now?

- **Loa Constructs ready** — Distribution channel exists for internal tools
- **Ruggy Security paved the way** — Same migration pattern proven successful
- **Design physics complete** — The core physics rules are battle-tested
- **Taste system working** — `grimoires/sigil/taste.md` accumulates preferences

> **Source**: CONTRIBUTING-PACKS.md analysis + Ruggy Security PRD pattern

---

## 2. Vision & Goals

### 2.1 Product Vision

> "Sigil becomes the design immune system — always watching, always learning, always ensuring feel is physics."

From internal framework → Distributable construct that:
- **Teaches** Claude design physics (timing, sync, confirmation patterns)
- **Generates** components with correct physics based on effect detection
- **Accumulates** taste preferences across projects without configuration
- **Validates** generated code against physics constraints

### 2.2 Success Criteria

| Metric | Target | Timeline |
|--------|--------|----------|
| Loa Construct submission | Approved | 2 weeks |
| Skills with index.yaml | 100% | 1 week |
| Commands with YAML routing | 100% | 1 week |
| manifest.json validation | Passes schema | 1 week |
| First external installation | Working | 3 weeks |

### 2.3 Non-Goals (Explicit Out of Scope)

- **Runtime React components** — Sigil is agent-time, not runtime
- **UI library bundling** — Users bring their own Framer Motion / React Spring
- **Breaking physics changes** — The 800/600/200/100ms timings are fixed
- **Public marketplace distribution** — Internal THJ use only (for now)

---

## 3. User Personas

### 3.1 Primary: THJ Frontend Developers

**Role**: React/Next.js developers building web3 UIs
**Needs**:
- Generate components with correct physics (timing, sync, confirmation)
- Consistent design feel across ecosystem
- No configuration — physics determined from effect

**Current Tools**: Manual design decisions, inconsistent patterns
**Pain Points**: Every component reinvents timing, sync patterns vary

### 3.2 Secondary: Claude Code Users (Future)

**Role**: Developers using Claude Code with Sigil installed
**Needs**:
- `/craft` generates physics-correct components
- `/ward` validates existing code against physics
- `/garden` shows pattern authority across codebase

**Current Capabilities**: None (Sigil not yet packaged)
**Expansion**: Full design physics toolkit

---

## 4. Functional Requirements

### 4.1 Stream 1: Pack Structure (P0 - Immediate)

**Requirement**: Create valid Loa Construct pack structure

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| S1-01 | Create `manifest.json` | Valid JSON matching pack-manifest.json schema |
| S1-02 | Validate pack structure | All skills have index.yaml + SKILL.md |
| S1-03 | Add YAML frontmatter to commands | All commands route to skills |
| S1-04 | Pack documentation | README documents installation and usage |

**Dependencies**: None
**Effort**: 1-2 days

### 4.2 Stream 2: Sigil-Specific Skills (P0 - Short-term)

**Requirement**: Define Sigil's core design physics skills

| Skill | Purpose | Triggers |
|-------|---------|----------|
| `crafting-physics` | Full physics generation (behavioral + animation + material) | `/craft` |
| `styling-material` | Material physics only (surface, shadow, radius) | `/style` |
| `animating-motion` | Animation physics only (timing, easing, springs) | `/animate` |
| `applying-behavior` | Behavioral physics only (sync, confirmation, timing) | `/behavior` |
| `validating-physics` | Ward against physics violations | `/ward` |
| `surveying-patterns` | Garden authority across codebase | `/garden` |
| `inscribing-taste` | Record learnings into Sigil rules | `/inscribe` |
| `distilling-components` | Bridge architecture to physics | `/distill` |

**Dependencies**: S1 complete
**Effort**: 2-3 days

### 4.3 Stream 3: Skill Index Files (P0)

**Requirement**: Create index.yaml for each skill following 3-level architecture

Each skill needs:
```yaml
name: "skill-name"
version: "1.0.0"
model: "sonnet"  # or "opus" for complex tasks
description: |
  Brief description of what this skill does
  and when it should be used.

triggers:
  - "/command"
  - "natural language trigger"

inputs:
  - name: context_dir
    type: directory
    path: "grimoires/sigil/context/"
    required: false

outputs:
  - path: "grimoires/sigil/taste.md"
    description: "Taste signal log"

protocols:
  required:
    - name: "grounding-enforcement"
      path: ".claude/protocols/grounding-enforcement.md"
```

**Effort**: 1-2 days

### 4.4 Stream 4: Command Routing (P0)

**Requirement**: Add YAML frontmatter to all commands for routing

Example format:
```yaml
---
agent: "crafting-physics"
agent_path: ".claude/skills/crafting-physics"
description: "Generate component with full design physics"

context_files:
  - path: "grimoires/sigil/taste.md"
    optional: true
    description: "User taste preferences"
  - path: "grimoires/sigil/constitution.yaml"
    optional: false
    description: "Physics rules"

outputs:
  - path: "grimoires/sigil/taste.md"
    description: "Updated taste signals"
---
```

**Effort**: 1 day

---

## 5. Technical Requirements

### 5.1 Pack Structure

```
sigil/
├── manifest.json                 # Pack metadata (NEW)
├── README.md                     # Pack documentation (UPDATE)
├── LICENSE.md                    # MIT License
├── CLAUDE.md                     # Internal documentation
├── .claude/
│   ├── commands/                 # Slash commands (UPDATE frontmatter)
│   │   ├── craft.md             # /craft command
│   │   ├── style.md             # /style command
│   │   ├── animate.md           # /animate command
│   │   ├── behavior.md          # /behavior command
│   │   ├── ward.md              # /ward command
│   │   ├── garden.md            # /garden command
│   │   └── inscribe.md          # /inscribe command
│   ├── skills/                   # Skill definitions (UPDATE index.yaml)
│   │   ├── crafting-physics/
│   │   │   ├── index.yaml       # Skill metadata (NEW)
│   │   │   ├── SKILL.md         # Skill instructions
│   │   │   └── resources/       # Templates, references
│   │   ├── styling-material/
│   │   ├── animating-motion/
│   │   ├── applying-behavior/
│   │   ├── validating-physics/
│   │   ├── surveying-patterns/
│   │   └── inscribing-taste/
│   ├── rules/                    # Physics rules (KEEP)
│   │   ├── 00-sigil-core.md
│   │   ├── 01-sigil-physics.md
│   │   ├── ...
│   │   └── 17-semantic-search.md
│   └── protocols/                # Agent protocols (KEEP)
└── grimoires/
    └── sigil/
        ├── taste.md              # Taste accumulation
        ├── constitution.yaml     # Physics config
        └── context/              # User context
```

### 5.2 manifest.json Schema

```json
{
  "$schema": "https://constructs.network/schemas/pack-manifest.json",
  "name": "sigil",
  "version": "2.0.0",
  "description": "Design physics framework for AI-generated UI components. Three-layer physics: Behavioral + Animation + Material = Feel.",
  "author": "THJ Team",
  "repository": "https://github.com/0xHoneyJar/sigil",
  "license": "MIT",
  "tier": "free",
  "keywords": [
    "design-system",
    "ui-components",
    "physics",
    "animation",
    "react",
    "frontend",
    "ux"
  ],
  "skills": [
    {
      "name": "crafting-physics",
      "path": ".claude/skills/crafting-physics",
      "description": "Generate components with full design physics"
    }
  ],
  "commands": [
    {
      "name": "/craft",
      "path": ".claude/commands/craft.md",
      "description": "Generate component with physics analysis"
    }
  ],
  "rules": [
    {
      "name": "sigil-core",
      "path": ".claude/rules/00-sigil-core.md",
      "description": "Core physics principles and effect detection"
    }
  ]
}
```

### 5.3 Skill Migration Mapping

| Current Skill | New Skill Name | Purpose |
|--------------|----------------|---------|
| `auditing-security` | REMOVE | Not Sigil-specific |
| `deploying-infrastructure` | REMOVE | Not Sigil-specific |
| `designing-architecture` | REMOVE | Not Sigil-specific |
| `discovering-requirements` | REMOVE | Not Sigil-specific |
| `implementing-tasks` | REMOVE | Not Sigil-specific |
| `mounting-framework` | `mounting-sigil` | Mount Sigil onto repos |
| `planning-sprints` | REMOVE | Not Sigil-specific |
| `reviewing-code` | REMOVE | Not Sigil-specific |
| `riding-codebase` | REMOVE | Not Sigil-specific |
| `translating-for-executives` | REMOVE | Not Sigil-specific |
| `agent-browser` | KEEP | Visual validation |
| `updating-framework` | `updating-sigil` | Update Sigil |
| NEW | `crafting-physics` | Full physics generation |
| NEW | `styling-material` | Material physics only |
| NEW | `animating-motion` | Animation physics only |
| NEW | `applying-behavior` | Behavioral physics only |
| NEW | `validating-physics` | Ward validation |
| NEW | `surveying-patterns` | Garden authority |
| NEW | `inscribing-taste` | Taste inscription |

### 5.4 Command Migration Mapping

| Current Command | Action | New Routing |
|-----------------|--------|-------------|
| `/craft` | KEEP | `crafting-physics` |
| `/style` | KEEP | `styling-material` |
| `/animate` | KEEP | `animating-motion` |
| `/behavior` | KEEP | `applying-behavior` |
| `/ward` | KEEP | `validating-physics` |
| `/garden` | KEEP | `surveying-patterns` |
| `/inscribe` | KEEP | `inscribing-taste` |
| `/distill` | KEEP | `distilling-components` |
| `/mount` | KEEP | `mounting-sigil` |
| `/update` | KEEP | `updating-sigil` |
| `/architect` | REMOVE | Not Sigil-specific |
| `/audit` | REMOVE | Not Sigil-specific |
| `/audit-deployment` | REMOVE | Not Sigil-specific |
| `/audit-sprint` | REMOVE | Not Sigil-specific |
| `/contribute` | REMOVE | Not Sigil-specific |
| `/deploy-production` | REMOVE | Not Sigil-specific |
| `/feedback` | KEEP (modify) | Sigil feedback |
| `/implement` | REMOVE | Not Sigil-specific |
| `/mcp-config` | REMOVE | Not Sigil-specific |
| `/oracle*` | REMOVE | Not Sigil-specific |
| `/plan-and-analyze` | REMOVE | Not Sigil-specific |
| `/review-sprint` | REMOVE | Not Sigil-specific |
| `/ride` | REMOVE | Not Sigil-specific |
| `/setup` | KEEP | `setup-sigil` |
| `/sprint-plan` | REMOVE | Not Sigil-specific |
| `/translate*` | REMOVE | Not Sigil-specific |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Requirement |
|--------|-------------|
| Physics analysis time | <5 seconds per component |
| Rule loading | <2 seconds on session start |
| Taste log append | Immediate |

### 6.2 Compatibility

| Metric | Requirement |
|--------|-------------|
| Claude Code version | 1.0.0+ |
| Node.js | Not required (agent-time only) |
| React | 18+ (for generated code) |

### 6.3 Data

| Metric | Requirement |
|--------|-------------|
| Taste log format | Append-only markdown |
| Constitution format | YAML |
| No external data | All rules self-contained |

---

## 7. Scope & Prioritization

### 7.1 Phase 1: Foundation (Days 1-2)

- [x] Sigil physics rules complete (18 files)
- [x] Core commands complete (craft, style, animate, behavior, ward)
- [ ] Create manifest.json for Loa Constructs
- [ ] Add YAML frontmatter to core commands
- [ ] Create index.yaml for crafting-physics skill

### 7.2 Phase 2: Skill Migration (Days 3-4)

- [ ] Create crafting-physics skill (from existing craft.md)
- [ ] Create styling-material skill
- [ ] Create animating-motion skill
- [ ] Create applying-behavior skill
- [ ] Create validating-physics skill
- [ ] Create surveying-patterns skill

### 7.3 Phase 3: Cleanup & Submission (Days 5-7)

- [ ] Remove non-Sigil-specific skills
- [ ] Remove non-Sigil-specific commands
- [ ] Update README for pack documentation
- [ ] Validate manifest.json against schema
- [ ] Submit to constructs.network

### 7.4 Future Phases (Backlog)

- Public marketplace distribution
- Taste sharing between projects
- Visual validation with agent-browser
- Physics preset marketplace

---

## 8. Risks & Dependencies

### 8.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skill removal breaks flows | Missing functionality | Document which skills move to Loa |
| Command routing changes | User confusion | Clear migration guide |
| Manifest validation fails | Submission blocked | Test against schema early |

### 8.2 Operational Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Team bandwidth | Delayed delivery | P0 scope only |
| Physics rule changes | Breaking changes | Version lock physics timings |
| Taste format changes | Lost preferences | Migration script |

### 8.3 Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Loa Constructs registry | THJ | Available |
| pack-manifest.json schema | THJ | Available |
| Ruggy Security migration | THJ | Complete (reference) |

---

## 9. Open Questions

1. **Skill deduplication**: Should generic Loa skills (architect, audit, etc.) be removed entirely or kept as references?
2. **Taste portability**: How do users migrate taste.md between projects?
3. **Physics versioning**: Should physics timings be versioned (v1, v2)?
4. **Visual validation**: Keep agent-browser skill for Sigil or move to separate pack?

---

## 10. Appendices

### A. Physics Rules Index

| Rule | Patterns | Purpose |
|------|----------|---------|
| 00-sigil-core.md | Core principles | Effect detection, sync strategies |
| 01-sigil-physics.md | Behavioral | Timing, sync, confirmation |
| 02-sigil-detection.md | Detection | Effect → physics mapping |
| 03-sigil-patterns.md | Golden patterns | Reference implementations |
| 04-sigil-protected.md | Protected caps | Non-negotiable accessibility |
| 05-sigil-animation.md | Animation | Easing, springs, duration |
| 06-sigil-taste.md | Taste | Learning from usage |
| 07-sigil-material.md | Material | Surface, shadow, typography |
| 08-sigil-lexicon.md | Lexicon | Keyword → effect mapping |
| 10-react-core.md | React rules | React implementation patterns |
| 11-react-async.md | Async | Suspense, waterfalls |
| 12-react-bundle.md | Bundle | Dynamic imports, tree shaking |
| 13-react-rendering.md | Rendering | Hydration, content visibility |
| 14-react-rerender.md | Rerenders | Memo, transitions, deps |
| 15-react-server.md | Server | RSC, caching, dedup |
| 16-react-js.md | JavaScript | Micro-optimizations |
| 17-semantic-search.md | Search | ck integration |

### B. Command Reference

| Command | Purpose | Physics Layer |
|---------|---------|---------------|
| `/craft` | Full physics generation | All three |
| `/style` | Material only | Material |
| `/animate` | Animation only | Animation |
| `/behavior` | Behavioral only | Behavioral |
| `/ward` | Validation | All three |
| `/garden` | Authority survey | None (meta) |
| `/inscribe` | Taste learning | Taste |
| `/distill` | Component analysis | All three |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-11 | Claude | v10.1 "Usage Reality" PRD |
| 2.0.0 | 2026-01-16 | Claude | Loa Construct migration PRD |

---

*"Effect is truth. What the code does determines its physics."* — Sigil

```
    ╔═══════════════════════════════════════════════╗
    ║  PRD COMPLETE                                 ║
    ║  Ready for /architect                         ║
    ╚═══════════════════════════════════════════════╝
```
