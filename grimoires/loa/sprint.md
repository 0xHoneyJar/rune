# Sigil - Sprint Plan

```
    ╔═══════════════════════════════════════════════╗
    ║  ✦ SIGIL                                      ║
    ║  Loa Construct Migration                      ║
    ║                                               ║
    ║  Sprint Plan v2.0.0                           ║
    ╚═══════════════════════════════════════════════╝
```

**Version**: 2.0.0
**Created**: 2026-01-16
**Based On**: PRD v2.0.0, SDD v2.0.0
**Status**: Ready for Implementation
**Supersedes**: v10.1 "Usage Reality" Sprint Plan (completed)

---

## Executive Summary

This sprint plan breaks down the Sigil Loa Construct migration into 3 sprints. The key architectural decision is **separation of concerns**:
- **Pack Distribution** (manifest.json): Only Sigil-specific functionality
- **Development Tooling** (in repo): Loa commands/skills stay for maintaining Sigil

**Total Effort**: ~3-4 days
**Sprints**: 3
**Team**: 1 developer + Claude

---

## Sprint Overview

| Sprint | Focus | Duration | Tasks |
|--------|-------|----------|-------|
| Sprint 1 | Foundation | Day 1 | manifest.json, skill directories, skill renames |
| Sprint 2 | Skills | Days 2-3 | Create 8 new Sigil skills with 3-level structure |
| Sprint 3 | Polish | Day 4 | Command routing, README, validation, submission |

---

## Sprint 1: Pack Foundation

**Goal**: Establish valid Loa Construct pack structure with manifest.json

**Duration**: Day 1

### Task 1.1: Create manifest.json

**ID**: S1-T1
**Description**: Create the pack manifest file with all Sigil-specific skills, commands, and rules
**Acceptance Criteria**:
- [ ] manifest.json exists at root
- [ ] Includes all 11 Sigil skills (8 new + 2 renamed + agent-browser)
- [ ] Includes all 12 Sigil commands
- [ ] Includes all 18 Sigil rules (00-17)
- [ ] Valid JSON syntax
**Dependencies**: None
**Testing**: JSON lint validation

**File to Create**: `manifest.json`

```json
{
  "$schema": "https://constructs.network/schemas/pack-manifest.json",
  "name": "sigil",
  "version": "2.0.0",
  "description": "Design physics framework for AI-generated UI components. Three-layer physics: Behavioral + Animation + Material = Feel.",
  "longDescription": "Sigil teaches Claude how to generate UI components with correct design physics. It detects effect from keywords and types, applies timing/sync/confirmation based on physics rules, and accumulates user taste preferences without configuration.",
  "author": {
    "name": "THJ Team",
    "url": "https://thehoneyjar.xyz"
  },
  "repository": "https://github.com/0xHoneyJar/sigil",
  "homepage": "https://sigil.design",
  "license": "MIT",
  "tier": "free",
  "keywords": [
    "design-system",
    "ui-components",
    "physics",
    "animation",
    "react",
    "frontend",
    "ux",
    "accessibility",
    "framer-motion"
  ],
  "skills": [
    {
      "name": "crafting-physics",
      "path": ".claude/skills/crafting-physics",
      "description": "Generate components with full 3-layer design physics"
    },
    {
      "name": "styling-material",
      "path": ".claude/skills/styling-material",
      "description": "Apply material physics only (surface, shadow, typography)"
    },
    {
      "name": "animating-motion",
      "path": ".claude/skills/animating-motion",
      "description": "Apply animation physics only (timing, easing, springs)"
    },
    {
      "name": "applying-behavior",
      "path": ".claude/skills/applying-behavior",
      "description": "Apply behavioral physics only (sync, confirmation, timing)"
    },
    {
      "name": "validating-physics",
      "path": ".claude/skills/validating-physics",
      "description": "Ward against physics violations"
    },
    {
      "name": "surveying-patterns",
      "path": ".claude/skills/surveying-patterns",
      "description": "Survey pattern authority across codebase"
    },
    {
      "name": "inscribing-taste",
      "path": ".claude/skills/inscribing-taste",
      "description": "Inscribe learnings into permanent rules"
    },
    {
      "name": "distilling-components",
      "path": ".claude/skills/distilling-components",
      "description": "Bridge architecture to physics-ready components"
    },
    {
      "name": "mounting-sigil",
      "path": ".claude/skills/mounting-sigil",
      "description": "Mount Sigil onto existing repositories"
    },
    {
      "name": "updating-sigil",
      "path": ".claude/skills/updating-sigil",
      "description": "Update Sigil from upstream"
    },
    {
      "name": "agent-browser",
      "path": ".claude/skills/agent-browser",
      "description": "Visual validation of generated components"
    }
  ],
  "commands": [
    {
      "name": "/craft",
      "path": ".claude/commands/craft.md",
      "description": "Generate component with full design physics"
    },
    {
      "name": "/style",
      "path": ".claude/commands/style.md",
      "description": "Apply material physics only"
    },
    {
      "name": "/animate",
      "path": ".claude/commands/animate.md",
      "description": "Apply animation physics only"
    },
    {
      "name": "/behavior",
      "path": ".claude/commands/behavior.md",
      "description": "Apply behavioral physics only"
    },
    {
      "name": "/ward",
      "path": ".claude/commands/ward.md",
      "description": "Check for physics violations"
    },
    {
      "name": "/garden",
      "path": ".claude/commands/garden.md",
      "description": "Survey pattern authority"
    },
    {
      "name": "/inscribe",
      "path": ".claude/commands/inscribe.md",
      "description": "Inscribe taste learnings permanently"
    },
    {
      "name": "/distill",
      "path": ".claude/commands/distill.md",
      "description": "Distill tasks into craft-able components"
    },
    {
      "name": "/mount",
      "path": ".claude/commands/mount.md",
      "description": "Mount Sigil onto a repository"
    },
    {
      "name": "/update",
      "path": ".claude/commands/update.md",
      "description": "Update Sigil from upstream"
    },
    {
      "name": "/setup",
      "path": ".claude/commands/setup.md",
      "description": "First-time Sigil setup"
    },
    {
      "name": "/feedback",
      "path": ".claude/commands/feedback.md",
      "description": "Submit feedback about Sigil"
    }
  ],
  "rules": [
    {
      "name": "sigil-core",
      "path": ".claude/rules/00-sigil-core.md",
      "description": "Core physics principles and action defaults"
    },
    {
      "name": "sigil-physics",
      "path": ".claude/rules/01-sigil-physics.md",
      "description": "Behavioral physics - sync, timing, confirmation"
    },
    {
      "name": "sigil-detection",
      "path": ".claude/rules/02-sigil-detection.md",
      "description": "Effect detection from keywords and types"
    },
    {
      "name": "sigil-patterns",
      "path": ".claude/rules/03-sigil-patterns.md",
      "description": "Golden pattern implementations"
    },
    {
      "name": "sigil-protected",
      "path": ".claude/rules/04-sigil-protected.md",
      "description": "Non-negotiable protected capabilities"
    },
    {
      "name": "sigil-animation",
      "path": ".claude/rules/05-sigil-animation.md",
      "description": "Animation physics - easing, springs, frequency"
    },
    {
      "name": "sigil-taste",
      "path": ".claude/rules/06-sigil-taste.md",
      "description": "Taste accumulation system"
    },
    {
      "name": "sigil-material",
      "path": ".claude/rules/07-sigil-material.md",
      "description": "Material physics - surface, fidelity, grit"
    },
    {
      "name": "sigil-lexicon",
      "path": ".claude/rules/08-sigil-lexicon.md",
      "description": "Keyword and adjective lookup tables"
    },
    {
      "name": "react-core",
      "path": ".claude/rules/10-react-core.md",
      "description": "React implementation patterns"
    },
    {
      "name": "react-async",
      "path": ".claude/rules/11-react-async.md",
      "description": "Async patterns and waterfalls"
    },
    {
      "name": "react-bundle",
      "path": ".claude/rules/12-react-bundle.md",
      "description": "Bundle optimization"
    },
    {
      "name": "react-rendering",
      "path": ".claude/rules/13-react-rendering.md",
      "description": "Rendering optimization"
    },
    {
      "name": "react-rerender",
      "path": ".claude/rules/14-react-rerender.md",
      "description": "Re-render prevention"
    },
    {
      "name": "react-server",
      "path": ".claude/rules/15-react-server.md",
      "description": "Server-side patterns"
    },
    {
      "name": "react-js",
      "path": ".claude/rules/16-react-js.md",
      "description": "JavaScript micro-optimizations"
    },
    {
      "name": "semantic-search",
      "path": ".claude/rules/17-semantic-search.md",
      "description": "Semantic code search integration"
    }
  ],
  "minLoaVersion": "1.0.0"
}
```

### Task 1.2: Create skill directory structure

**ID**: S1-T2
**Description**: Create directory structure for all 8 new Sigil skills
**Acceptance Criteria**:
- [ ] `.claude/skills/crafting-physics/` exists
- [ ] `.claude/skills/styling-material/` exists
- [ ] `.claude/skills/animating-motion/` exists
- [ ] `.claude/skills/applying-behavior/` exists
- [ ] `.claude/skills/validating-physics/` exists
- [ ] `.claude/skills/surveying-patterns/` exists
- [ ] `.claude/skills/inscribing-taste/` exists
- [ ] `.claude/skills/distilling-components/` exists
**Dependencies**: None
**Testing**: Directory existence check

### Task 1.3: Rename existing skills

**ID**: S1-T3
**Description**: Rename mounting-framework and updating-framework to Sigil-specific names
**Acceptance Criteria**:
- [ ] `.claude/skills/mounting-sigil/` exists with updated content
- [ ] `.claude/skills/updating-sigil/` exists with updated content
- [ ] index.yaml name fields updated
- [ ] SKILL.md content updated for Sigil context
**Dependencies**: None
**Testing**: Skill invocation test

---

## Sprint 2: Skill Creation

**Goal**: Create all 8 new Sigil-specific skills with 3-level architecture

**Duration**: Days 2-3

### Task 2.1: Create crafting-physics skill

**ID**: S2-T1
**Description**: Primary skill for full 3-layer physics generation
**Acceptance Criteria**:
- [ ] `index.yaml` with metadata (~100 tokens)
- [ ] `SKILL.md` with full instructions (~2000 tokens)
- [ ] `resources/` directory created
- [ ] Triggers: `/craft`, "create component", "build a button"
- [ ] Context files include all sigil rules
- [ ] Outputs include taste.md
**Dependencies**: S1-T2
**Testing**: `/craft` invocation

**index.yaml template**:
```yaml
name: "crafting-physics"
version: "1.0.0"
model: "sonnet"
color: "purple"

description: |
  Apply design physics to any UX-affecting change. Three layers:
  Behavioral + Animation + Material = Feel. Use for new components,
  refinements, configurations, data patterns, and polish passes.

triggers:
  - "/craft"
  - "create component"
  - "build a button"
  - "generate UI"

inputs:
  - name: description
    type: string
    required: true
    description: "What to craft"
  - name: url
    type: string
    required: false
    description: "URL for visual verification"

outputs:
  - path: "src/components/*.tsx"
    description: "Generated component"
  - path: "grimoires/sigil/taste.md"
    description: "Updated taste signals"

context_files:
  - path: ".claude/rules/00-sigil-core.md"
    required: true
  - path: ".claude/rules/01-sigil-physics.md"
    required: true
  - path: ".claude/rules/02-sigil-detection.md"
    required: true
  - path: ".claude/rules/03-sigil-patterns.md"
    required: true
  - path: ".claude/rules/04-sigil-protected.md"
    required: true
  - path: ".claude/rules/05-sigil-animation.md"
    required: true
  - path: ".claude/rules/06-sigil-taste.md"
    required: true
  - path: ".claude/rules/07-sigil-material.md"
    required: true
  - path: ".claude/rules/08-sigil-lexicon.md"
    required: true
  - path: "grimoires/sigil/taste.md"
    required: false
  - path: "grimoires/sigil/constitution.yaml"
    required: false
```

### Task 2.2: Create styling-material skill

**ID**: S2-T2
**Description**: Material physics only (surface, shadow, typography)
**Acceptance Criteria**:
- [ ] `index.yaml` with material-focused metadata
- [ ] `SKILL.md` with material physics instructions
- [ ] Triggers: `/style`, "fix the styling", "change the look"
- [ ] Context files: 07-sigil-material.md, 08-sigil-lexicon.md
**Dependencies**: S1-T2
**Testing**: `/style` invocation

### Task 2.3: Create animating-motion skill

**ID**: S2-T3
**Description**: Animation physics only (timing, easing, springs)
**Acceptance Criteria**:
- [ ] `index.yaml` with animation-focused metadata
- [ ] `SKILL.md` with animation physics instructions
- [ ] Triggers: `/animate`, "fix the animation", "movement feels off"
- [ ] Context files: 05-sigil-animation.md
**Dependencies**: S1-T2
**Testing**: `/animate` invocation

### Task 2.4: Create applying-behavior skill

**ID**: S2-T4
**Description**: Behavioral physics only (sync, confirmation, timing)
**Acceptance Criteria**:
- [ ] `index.yaml` with behavioral-focused metadata
- [ ] `SKILL.md` with behavioral physics instructions
- [ ] Triggers: `/behavior`, "fix the timing", "sync is wrong"
- [ ] Context files: 01-sigil-physics.md, 02-sigil-detection.md
**Dependencies**: S1-T2
**Testing**: `/behavior` invocation

### Task 2.5: Create validating-physics skill

**ID**: S2-T5
**Description**: Ward against physics violations
**Acceptance Criteria**:
- [ ] `index.yaml` with validation-focused metadata
- [ ] `SKILL.md` with validation instructions
- [ ] Triggers: `/ward`, "check for physics violations"
- [ ] Context files: 00-sigil-core.md, 04-sigil-protected.md
**Dependencies**: S1-T2
**Testing**: `/ward` invocation

### Task 2.6: Create surveying-patterns skill

**ID**: S2-T6
**Description**: Garden authority across codebase
**Acceptance Criteria**:
- [ ] `index.yaml` with survey-focused metadata
- [ ] `SKILL.md` with pattern authority instructions
- [ ] Triggers: `/garden`, "show pattern authority"
**Dependencies**: S1-T2
**Testing**: `/garden` invocation

### Task 2.7: Create inscribing-taste skill

**ID**: S2-T7
**Description**: Record learnings into Sigil rules
**Acceptance Criteria**:
- [ ] `index.yaml` with taste-focused metadata
- [ ] `SKILL.md` with inscription instructions
- [ ] Triggers: `/inscribe`, "save these preferences"
- [ ] Outputs: `.claude/rules/*.md`
**Dependencies**: S1-T2
**Testing**: `/inscribe` invocation

### Task 2.8: Create distilling-components skill

**ID**: S2-T8
**Description**: Bridge architecture to physics
**Acceptance Criteria**:
- [ ] `index.yaml` with distilling-focused metadata
- [ ] `SKILL.md` with component analysis instructions
- [ ] Triggers: `/distill`, "break this down into components"
**Dependencies**: S1-T2
**Testing**: `/distill` invocation

---

## Sprint 3: Polish & Submission

**Goal**: Complete command routing, documentation, and submit to constructs.network

**Duration**: Day 4

### Task 3.1: Update command frontmatter

**ID**: S3-T1
**Description**: Ensure all 12 Sigil commands have proper agent routing frontmatter
**Acceptance Criteria**:
- [ ] craft.md has agent routing (already has good frontmatter - verify)
- [ ] style.md has agent: "styling-material"
- [ ] animate.md has agent: "animating-motion"
- [ ] behavior.md has agent: "applying-behavior"
- [ ] ward.md has agent: "validating-physics"
- [ ] garden.md has agent: "surveying-patterns"
- [ ] inscribe.md has agent: "inscribing-taste"
- [ ] distill.md has agent: "distilling-components"
- [ ] mount.md has agent: "mounting-sigil"
- [ ] update.md has agent: "updating-sigil"
- [ ] setup.md has appropriate routing
- [ ] feedback.md has appropriate routing
**Dependencies**: Sprint 2 complete
**Testing**: Command invocation verification

### Task 3.2: Update README for pack documentation

**ID**: S3-T2
**Description**: Update README.md with installation instructions and pack documentation
**Acceptance Criteria**:
- [ ] Installation section with constructs.network instructions
- [ ] Command reference table
- [ ] Skill overview
- [ ] Quick start guide
- [ ] Physics philosophy section
**Dependencies**: S3-T1
**Testing**: Manual review

### Task 3.3: Create PACK-SUBMISSION.md

**ID**: S3-T3
**Description**: Create submission documentation for constructs.network
**Acceptance Criteria**:
- [ ] Pack metadata summary
- [ ] Changelog from previous version
- [ ] Test results
- [ ] Known limitations
- [ ] Contact information
**Dependencies**: S3-T2
**Testing**: Manual review

### Task 3.4: Validate manifest against schema

**ID**: S3-T4
**Description**: Validate manifest.json against Loa Constructs schema
**Acceptance Criteria**:
- [ ] All skill paths exist
- [ ] All command paths exist
- [ ] All rule paths exist
- [ ] No duplicate entries
- [ ] Schema validation passes
**Dependencies**: S3-T1, S3-T2, S3-T3
**Testing**: Schema validation tool

### Task 3.5: End-to-end testing

**ID**: S3-T5
**Description**: Test complete pack installation and usage
**Acceptance Criteria**:
- [ ] `/craft` generates component with physics
- [ ] `/style` applies material only
- [ ] `/animate` applies animation only
- [ ] `/behavior` applies behavioral only
- [ ] `/ward` validates physics
- [ ] Rules load correctly on session start
- [ ] Taste accumulation works
**Dependencies**: S3-T4
**Testing**: Full workflow test

### Task 3.6: Submit to constructs.network

**ID**: S3-T6
**Description**: Submit pack for approval
**Acceptance Criteria**:
- [ ] Pack uploaded to constructs.network
- [ ] Submission form completed
- [ ] Confirmation received
**Dependencies**: S3-T5
**Testing**: N/A

---

## File Changes Summary

### Files to Create (19)

| File | Sprint | Task |
|------|--------|------|
| `manifest.json` | 1 | S1-T1 |
| `.claude/skills/crafting-physics/index.yaml` | 2 | S2-T1 |
| `.claude/skills/crafting-physics/SKILL.md` | 2 | S2-T1 |
| `.claude/skills/styling-material/index.yaml` | 2 | S2-T2 |
| `.claude/skills/styling-material/SKILL.md` | 2 | S2-T2 |
| `.claude/skills/animating-motion/index.yaml` | 2 | S2-T3 |
| `.claude/skills/animating-motion/SKILL.md` | 2 | S2-T3 |
| `.claude/skills/applying-behavior/index.yaml` | 2 | S2-T4 |
| `.claude/skills/applying-behavior/SKILL.md` | 2 | S2-T4 |
| `.claude/skills/validating-physics/index.yaml` | 2 | S2-T5 |
| `.claude/skills/validating-physics/SKILL.md` | 2 | S2-T5 |
| `.claude/skills/surveying-patterns/index.yaml` | 2 | S2-T6 |
| `.claude/skills/surveying-patterns/SKILL.md` | 2 | S2-T6 |
| `.claude/skills/inscribing-taste/index.yaml` | 2 | S2-T7 |
| `.claude/skills/inscribing-taste/SKILL.md` | 2 | S2-T7 |
| `.claude/skills/distilling-components/index.yaml` | 2 | S2-T8 |
| `.claude/skills/distilling-components/SKILL.md` | 2 | S2-T8 |
| `PACK-SUBMISSION.md` | 3 | S3-T3 |

### Files to Rename (2)

| From | To | Sprint | Task |
|------|-----|--------|------|
| `.claude/skills/mounting-framework/` | `.claude/skills/mounting-sigil/` | 1 | S1-T3 |
| `.claude/skills/updating-framework/` | `.claude/skills/updating-sigil/` | 1 | S1-T3 |

### Files to Update (13)

| File | Changes | Sprint | Task |
|------|---------|--------|------|
| `README.md` | Installation, command reference | 3 | S3-T2 |
| `.claude/commands/style.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/animate.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/behavior.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/ward.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/garden.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/inscribe.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/distill.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/mount.md` | Update agent to mounting-sigil | 3 | S3-T1 |
| `.claude/commands/update.md` | Update agent to updating-sigil | 3 | S3-T1 |
| `.claude/commands/setup.md` | Add agent routing | 3 | S3-T1 |
| `.claude/commands/feedback.md` | Add agent routing | 3 | S3-T1 |

### Files Unchanged (Dev Tooling - NOT in manifest)

These stay in repo for Sigil development but are excluded from manifest.json:

**Loa Commands** (not in manifest):
- architect.md, audit.md, audit-deployment.md, audit-sprint.md
- implement.md, plan-and-analyze.md, review-sprint.md
- ride.md, sprint-plan.md, translate.md, translate-ride.md
- oracle.md, oracle-analyze.md, mcp-config.md
- contribute.md, deploy-production.md

**Loa Skills** (not in manifest):
- auditing-security, deploying-infrastructure, designing-architecture
- discovering-requirements, implementing-tasks, planning-sprints
- reviewing-code, riding-codebase, translating-for-executives

---

## Task Summary

| ID | Task | Sprint | Priority | Dependencies |
|----|------|--------|----------|--------------|
| S1-T1 | Create manifest.json | 1 | P0 | None |
| S1-T2 | Create skill directory structure | 1 | P0 | None |
| S1-T3 | Rename existing skills | 1 | P0 | None |
| S2-T1 | Create crafting-physics skill | 2 | P0 | S1-T2 |
| S2-T2 | Create styling-material skill | 2 | P0 | S1-T2 |
| S2-T3 | Create animating-motion skill | 2 | P0 | S1-T2 |
| S2-T4 | Create applying-behavior skill | 2 | P0 | S1-T2 |
| S2-T5 | Create validating-physics skill | 2 | P0 | S1-T2 |
| S2-T6 | Create surveying-patterns skill | 2 | P0 | S1-T2 |
| S2-T7 | Create inscribing-taste skill | 2 | P0 | S1-T2 |
| S2-T8 | Create distilling-components skill | 2 | P0 | S1-T2 |
| S3-T1 | Update command frontmatter | 3 | P0 | Sprint 2 |
| S3-T2 | Update README for pack documentation | 3 | P0 | S3-T1 |
| S3-T3 | Create PACK-SUBMISSION.md | 3 | P0 | S3-T2 |
| S3-T4 | Validate manifest against schema | 3 | P0 | S3-T1, S3-T2, S3-T3 |
| S3-T5 | End-to-end testing | 3 | P0 | S3-T4 |
| S3-T6 | Submit to constructs.network | 3 | P0 | S3-T5 |

---

## Dependency Graph

```
Sprint 1:
  S1-T1 (manifest.json) ─ independent
  S1-T2 (skill directories) ─ independent
  S1-T3 (rename skills) ─ independent

Sprint 2:
  S1-T2 ─┬─► S2-T1 (crafting-physics)
         ├─► S2-T2 (styling-material)
         ├─► S2-T3 (animating-motion)
         ├─► S2-T4 (applying-behavior)
         ├─► S2-T5 (validating-physics)
         ├─► S2-T6 (surveying-patterns)
         ├─► S2-T7 (inscribing-taste)
         └─► S2-T8 (distilling-components)

Sprint 3:
  Sprint 2 ─► S3-T1 (command frontmatter)
                │
                └─► S3-T2 (README) ─► S3-T3 (PACK-SUBMISSION)
                         │                    │
                         └────────┬───────────┘
                                  │
                                  ▼
                            S3-T4 (validation)
                                  │
                                  ▼
                            S3-T5 (E2E testing)
                                  │
                                  ▼
                            S3-T6 (submit)
```

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Skill extraction complex | Medium | Low | Use craft.md as template |
| Command routing breaks existing | High | Low | Test each command after update |
| Manifest validation fails | Medium | Medium | Validate schema early |
| Missing skill dependency | Low | Low | Cross-check context_files |

---

## Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| Manifest validates | 100% | Schema tool |
| Skills have index.yaml | 11/11 | File check |
| Commands route correctly | 12/12 | Invocation test |
| E2E /craft works | Pass | Manual test |
| Pack submission approved | Yes | Registry response |

---

## Notes

### Key Architecture Decision

Loa development commands/skills **stay in the repository** but are **NOT included in manifest.json**. This allows:
- **Users**: Get focused Sigil design physics toolkit
- **Maintainers**: Keep full Loa development capabilities

### Command Frontmatter Pattern

Reference craft.md for the YAML frontmatter structure. Key fields:
- `name`, `version`, `description`
- `arguments` (with examples)
- `context_files` (with required/optional flags)
- `outputs`
- `workflow_next`

### Skill 3-Level Architecture

1. **index.yaml** (~100 tokens): Metadata for skill discovery
2. **SKILL.md** (~2000 tokens): Full instructions for skill execution
3. **resources/** (on-demand): Templates, references, examples

---

## Implementation Command

To start implementation:

```
/implement sprint-1
```

The implement command handles task state automatically.

---

```
    ╔═══════════════════════════════════════════════╗
    ║  SPRINT PLAN COMPLETE                         ║
    ║  Ready for /implement sprint-1                ║
    ╚═══════════════════════════════════════════════╝
```
