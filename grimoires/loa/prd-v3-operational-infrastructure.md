# Sigil v3: Operational Infrastructure Upgrade - PRD

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  SIGIL v3.0 - OPERATIONAL INFRASTRUCTURE                  ║
    ║                                                           ║
    ║  "From Domain Expert to Production-Grade Agent Framework" ║
    ╚═══════════════════════════════════════════════════════════╝
```

**Version**: 3.0.0
**Created**: 2026-01-20
**Status**: Discovery Complete
**Owner**: THJ Team
**Reference Analysis**: Loa Framework, Compound Engineering Plugin, Claude Code System Prompt

---

## Executive Summary

Sigil has excellent domain expertise in design physics but lacks the operational infrastructure that makes frameworks like Loa production-grade. This PRD defines the upgrade path from "impressive framework" to "production-grade agent infrastructure" by implementing 10 critical capabilities identified through comparative analysis.

**Core Insight**: Sigil treats UI generation as a domain problem (correct). The upgrade treats agent orchestration as a systems engineering problem (missing).

**Target Outcome**: 40% reduction in debugging loops, session recovery in <100 tokens, self-improving framework through continuous learning.

---

## 1. Problem Statement

### 1.1 Current State Assessment

| Dimension | Sigil (Current) | Reference Frameworks | Gap |
|-----------|-----------------|---------------------|-----|
| Domain Knowledge | Excellent (design physics) | Limited | None |
| State Recovery | craft-state.md (partial) | Lossless Ledger Protocol | Critical |
| Session Memory | taste.md (preferences only) | Structured NOTES.md | Critical |
| Quality Gates | /ward (single validator) | Multi-subagent validation | High |
| Learning Loop | Manual /inscribe | Automatic extraction | High |
| Context Hygiene | RLM (good) | Attention budget + minimal output | Medium |
| Safety Defense | Protected capabilities | Circuit breaker + opt-in | Medium |

### 1.2 Evidence of Gaps

**Loop Detection Triggers**: craft-state.md shows 3+ iteration loops are common, indicating:
- Lost context between invocations
- No structured memory of decisions made
- No proactive feedback checking

**Reference Benchmark**: Loa claims 40% reduction in debugging loops after implementing Lossless Ledger Protocol.

### 1.3 Root Cause Analysis

| Symptom | Root Cause | Reference Solution |
|---------|------------|-------------------|
| Repeated iterations on same component | No decision trajectory logging | Trajectory files with citations |
| Context lost after /clear | No truth hierarchy | Lossless state protocol |
| Same mistakes repeated | No feedback-first check | Mandatory Step -1 |
| Framework doesn't improve | No learning extraction | Continuous learning skill |

---

## 2. Vision & Goals

### 2.1 Vision Statement

Transform Sigil from a design physics expert into a production-grade agent framework that:
- **Recovers gracefully** from context clears
- **Learns continuously** from each session
- **Validates rigorously** before shipping code
- **Operates safely** in autonomous modes

### 2.2 Success Metrics

| Metric | Current Baseline | Target | Measurement |
|--------|------------------|--------|-------------|
| Iterations to completion | 3.2 avg | 2.0 avg | craft-state.md analysis |
| Loop detection triggers | 15% of sessions | 5% of sessions | taste.md audit |
| Session recovery time | Manual (5+ min) | <30 sec (~100 tokens) | NOTES.md + craft-state |
| Learning extraction rate | 0 (manual only) | 2 per week (auto) | pending-learnings.md |
| Validation pass rate | Unknown | 95% first-pass | Subagent reports |

### 2.3 Non-Goals (Explicit)

- **Not** changing the design physics model (behavioral + animation + material)
- **Not** replacing taste.md accumulation system
- **Not** removing RLM (on-demand rule loading)
- **Not** changing protected capabilities
- **Not** copying Loa's multi-agent architecture wholesale

---

## 3. User & Stakeholder Context

### 3.1 Primary Persona: Framework Developer

**Profile**: Developer using Sigil to generate UI components with correct physics

**Current Pain Points**:
1. "I ran /craft 4 times and it kept making similar mistakes"
2. "After /clear, I had to re-explain everything"
3. "I wish it remembered what worked last time"
4. "Sometimes the generated code doesn't match our codebase patterns"

**Desired Outcome**: Faster iteration, persistent memory, self-improving suggestions

### 3.2 Secondary Persona: Framework Maintainer

**Profile**: Developer evolving Sigil rules and skills

**Current Pain Points**:
1. "Hard to debug why it chose wrong physics"
2. "No way to A/B test rule changes"
3. "Learnings from one session don't propagate"
4. "craft.md is 110KB—hard to maintain"

**Desired Outcome**: Decision visibility, testable changes, automatic learning capture

---

## 4. Functional Requirements

### FR-1: Lossless State Protocol

**Priority**: P0 (Critical)
**Effort**: Medium (3-5 days)

**Description**: Implement explicit truth hierarchy and grounding enforcement.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-1.1 | Define truth hierarchy in CLAUDE.md | Code > taste.md > craft-state.md > NOTES.md > context window |
| FR-1.2 | Add grounding enforcement | Claims cite rule files, taste.md, or file:line |
| FR-1.3 | Implement recovery protocol | Resume from NOTES.md + craft-state in <100 tokens |
| FR-1.4 | Add checkpoint command | /checkpoint saves current understanding |

**User Story**: As a developer, when I run /clear and return to a component, Sigil should resume where it left off without re-explaining context.

---

### FR-2: Structured Agentic Memory (NOTES.md)

**Priority**: P0 (Critical)
**Effort**: Low (1-2 days)

**Description**: Create persistent session memory with mandatory sections.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-2.1 | Create NOTES.md template | Sections: Current Focus, Decisions, Blockers, Learnings, Continuity |
| FR-2.2 | Auto-populate on /craft start | Read NOTES.md before Step 0 |
| FR-2.3 | Auto-update on /craft end | Write NOTES.md after Step 12 |
| FR-2.4 | Integrate with session recovery | NOTES.md is truth source for session state |

**Template**:
```markdown
# Sigil Session Memory

## Current Focus
[Component name and craft type]

## Physics Decisions
- Effect: {why chosen}
- Timing: {why this value}
- Animation: {approach rationale}

## Blockers
- [Any unresolved questions]

## Learnings
- [Discoveries that should inform future work]

## Session Continuity
Last: [action completed]
Next: [action planned]
Context: [what's needed to continue]
```

---

### FR-3: Subagent Validation Architecture

**Priority**: P1 (High)
**Effort**: High (5-7 days)

**Description**: Create validation subagents that run as quality gates.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-3.1 | Create physics-validator subagent | Validates effect, timing, protected capabilities |
| FR-3.2 | Create codebase-validator subagent | Validates imports, conventions, patterns |
| FR-3.3 | Define verdict levels | COMPLIANT / DRIFT_DETECTED / CRITICAL_VIOLATION |
| FR-3.4 | Wire into /craft Step 5.5 | Run validators after applying changes |
| FR-3.5 | Block on CRITICAL_VIOLATION | User must acknowledge before proceeding |

**Subagent Directory Structure**:
```
.claude/subagents/
├── physics-validator.md
├── codebase-validator.md
└── README.md
```

---

### FR-4: Continuous Learning Loop

**Priority**: P1 (High)
**Effort**: Medium (3-5 days)

**Description**: Automatically extract learnings from sessions and promote to rules.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-4.1 | Create continuous-learning skill | Triggers on 3+ iterations, novel discoveries |
| FR-4.2 | Create pending-learnings.md | Structured format: Context, Discovery, Evidence |
| FR-4.3 | Implement /skill-audit command | Review and approve pending learnings |
| FR-4.4 | Promotion workflow | Approved → taste.md entry or rule update |

**Learning Extraction Trigger**:
- 3+ iterations with partial success
- Discovery of undocumented codebase pattern
- Novel Web3 footgun encountered

---

### FR-5: Context Hygiene & Attention Budget

**Priority**: P1 (High)
**Effort**: Medium (3-5 days)

**Description**: Implement attention budget and refactor oversized files.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-5.1 | Add attention budget to CLAUDE.md | Green/Yellow/Orange/Red zones with behaviors |
| FR-5.2 | Define response length targets | Analysis: 15-20 lines, Confirmation: 1 line |
| FR-5.3 | Refactor craft.md | Core: ~30KB, Split modes to skill files |
| FR-5.4 | Create mode skill files | hammer-mode.md, debug-mode.md, explore-mode.md |

**Attention Budget Zones**:
| Zone | Context % | Behavior |
|------|-----------|----------|
| Green | 0-60% | Full exploration, verbose analysis |
| Yellow | 60-80% | Compact mode, skip optional context |
| Orange | 80-90% | Essential physics only |
| Red | 90-100% | Direct action, minimal analysis |

---

### FR-6: Feedback-First Implementation

**Priority**: P1 (High)
**Effort**: Low (1-2 days)

**Description**: Check for unaddressed feedback before starting new work.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-6.1 | Add Step -1 to craft.md | Check prior feedback before any work |
| FR-6.2 | Check taste.md recent signals | Show REJECT/MODIFY for same component |
| FR-6.3 | Check craft-state.md loops | Warn if loop_detection.triggered |
| FR-6.4 | Check pending-learnings.md | Apply relevant learnings first |

**User Story**: As a developer, when I return to a component that had issues, Sigil should surface that context before generating new code.

---

### FR-7: Three-Zone Architecture Documentation

**Priority**: P2 (Medium)
**Effort**: Low (1 day)

**Description**: Explicitly document zone boundaries and override mechanism.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-7.1 | Add zone documentation to CLAUDE.md | System/State/App zones with rules |
| FR-7.2 | Create .claude/overrides/ directory | README with naming convention |
| FR-7.3 | Document write permissions | System: /update only, State: Sigil writes, App: confirmation |

---

### FR-8: Run Mode Safety Defense

**Priority**: P2 (Medium)
**Effort**: Medium (2-3 days)

**Description**: Add safety mechanisms for autonomous execution modes.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-8.1 | Implement circuit breaker | Stop on 2 consecutive failures |
| FR-8.2 | Add opt-in for hammer mode | Explicit confirmation before extended execution |
| FR-8.3 | Add phase checkpoints | Offer pause after each Loa command |
| FR-8.4 | Set max duration | 30 minutes without checkpoint triggers warning |

---

### FR-9: Explicit Anti-Patterns Documentation

**Priority**: P2 (Medium)
**Effort**: Low (1 day)

**Description**: Consolidate anti-patterns into explicit "Never Do" list.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-9.1 | Add anti-patterns section to 00-sigil-core.md | Code generation, User interaction, State management |
| FR-9.2 | Reference in craft.md | Link to anti-patterns at start of workflow |

**Anti-Pattern Categories**:
- Code Generation (no partials, no skeleton code)
- User Interaction (no "would you like me to", max 2 questions)
- State Management (no trust context > grimoire)

---

### FR-10: Decision Trajectory Logging

**Priority**: P2 (Medium)
**Effort**: Medium (2-3 days)

**Description**: Log decision rationale for debugging and evaluation.

**Requirements**:
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-10.1 | Create trajectory log format | Input, Detection, Decision, Outcome |
| FR-10.2 | Add Step 3b to craft.md | Log trajectory after analysis |
| FR-10.3 | Update on completion | Fill outcome after Step 11 |
| FR-10.4 | Create trajectory directory | grimoires/sigil/trajectory/{date}-{component}.md |

**Trajectory Schema**:
```markdown
## Craft Decision: {component}
Timestamp: {ISO8601}

### Input
User: "{request}"
Context: [files read]

### Detection
Craft type: {type} (signals: {list})
Effect: {effect} (signals: {list})

### Decision
Physics: {summary}
Files: {targets}
Alternatives: {if any}

### Outcome
Signal: {ACCEPT/MODIFY/REJECT}
Changes: {if MODIFY}
```

---

## 5. Technical & Non-Functional Requirements

### NFR-1: Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| /craft response time | <5 seconds to analysis | Wall clock |
| Session recovery | <100 tokens | Token count |
| RLM loading | <4000 tokens | Rule budget |
| craft.md size | <30KB (core) | File size |

### NFR-2: Reliability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| State file corruption | 0 incidents | Error logs |
| Recovery success rate | 99% | Manual testing |
| Validator accuracy | 95% correct verdicts | Sampling |

### NFR-3: Maintainability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Single responsibility | 1 purpose per file | Code review |
| Documentation coverage | 100% public APIs | Audit |
| Skill file size | <500 lines each | Line count |

---

## 6. Scope & Prioritization

### 6.1 MVP (Phase 1) - Weeks 1-2

**Theme**: Prevent loops, enable recovery

| Feature | Priority | Effort | Rationale |
|---------|----------|--------|-----------|
| FR-1: Lossless State Protocol | P0 | Medium | Foundation for everything |
| FR-2: NOTES.md | P0 | Low | Quick win, high impact |
| FR-6: Feedback-First | P1 | Low | Prevents repeated mistakes |
| FR-9: Anti-Patterns | P2 | Low | Documentation only |

**MVP Success Criteria**:
- Session recovery works in <100 tokens
- Loop detection triggers <10% of sessions
- Feedback surfaced before new work

### 6.2 Phase 2 - Weeks 3-4

**Theme**: Quality gates, context efficiency

| Feature | Priority | Effort | Rationale |
|---------|----------|--------|-----------|
| FR-3: Subagent Validators | P1 | High | Quality before shipping |
| FR-5: Context Hygiene | P1 | Medium | Faster responses |
| FR-7: Zone Architecture | P2 | Low | Clear boundaries |

### 6.3 Phase 3 - Weeks 5-6

**Theme**: Self-improvement, safety

| Feature | Priority | Effort | Rationale |
|---------|----------|--------|-----------|
| FR-4: Continuous Learning | P1 | Medium | Framework improves |
| FR-8: Run Mode Safety | P2 | Medium | Safer autonomous |
| FR-10: Trajectory Logging | P2 | Medium | Debugging capability |

### 6.4 Out of Scope

- Changing design physics model
- Replacing taste.md system
- Removing RLM rule loading
- Multi-agent orchestration (Loa handles this)
- Visual design system changes

---

## 7. Risks & Dependencies

### 7.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| craft.md refactor breaks workflow | Medium | High | Extensive testing, feature flags |
| NOTES.md becomes stale | Medium | Medium | Auto-update on craft end |
| Validators too strict | Low | Medium | Start with warnings, graduate to blocks |
| Learning extraction low quality | Medium | Medium | Approval workflow filters |

### 7.2 Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Loa framework integration | External | Loa team | Stable |
| taste.md format | Internal | Sigil | Locked |
| craft-state.md format | Internal | Sigil | Can evolve |

### 7.3 Rollback Strategy

Each feature ships behind a flag in constitution.yaml:
```yaml
features:
  lossless_state: true
  notes_memory: true
  subagent_validators: false  # Graduate when stable
  continuous_learning: false
```

---

## 8. Implementation Roadmap

```
Week 1-2: MVP (Prevent Loops)
├── FR-1: Lossless State Protocol
├── FR-2: NOTES.md Template
├── FR-6: Feedback-First Check
└── FR-9: Anti-Patterns Documentation

Week 3-4: Quality (Ship Clean)
├── FR-3: Subagent Validators
├── FR-5: Context Hygiene
└── FR-7: Zone Architecture

Week 5-6: Intelligence (Self-Improve)
├── FR-4: Continuous Learning
├── FR-8: Run Mode Safety
└── FR-10: Trajectory Logging
```

---

## 9. Success Validation

### 9.1 Quantitative Metrics

| Metric | Baseline | Week 2 | Week 4 | Week 6 |
|--------|----------|--------|--------|--------|
| Avg iterations | 3.2 | 2.5 | 2.2 | 2.0 |
| Loop triggers | 15% | 10% | 7% | 5% |
| Recovery time | 5+ min | 30 sec | 30 sec | 30 sec |
| Learning extractions | 0/week | 0/week | 1/week | 2/week |

### 9.2 Qualitative Validation

- [ ] Developer feedback: "Sigil remembers what worked"
- [ ] Developer feedback: "Fewer repeated mistakes"
- [ ] Maintainer feedback: "Can debug decision rationale"
- [ ] Maintainer feedback: "Framework improves over time"

---

## 10. Appendix

### A. Reference Documents

| Document | Purpose | Location |
|----------|---------|----------|
| Loa Framework | Reference architecture | https://github.com/0xHoneyJar/loa |
| Compound Engineering | Learning loop pattern | https://github.com/EveryInc/compound-engineering-plugin |
| Claude Code Prompt | Minimal output pattern | GitHub x1xhlol/system-prompts |
| Feedback Analysis | Gap identification | This conversation |

### B. Glossary

| Term | Definition |
|------|------------|
| Lossless State | State that survives context window clears |
| Grounding | Claims backed by citations to source files |
| Truth Hierarchy | Priority order for conflicting information |
| Trajectory | Decision log showing input → detection → outcome |
| Learning Extraction | Automatic capture of discoveries for reuse |

### C. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-01-20 | Initial draft from feedback analysis |
| 0.2 | 2026-01-20 | `/ride` analysis completed - verified implementation status |

### D. Implementation Status (from /ride 2026-01-20)

**Phase 1 (MVP) - Partially Complete**:
| Feature | Status | Evidence |
|---------|--------|----------|
| FR-1: Lossless State | ✓ Implemented | Truth hierarchy in CLAUDE.md, grounding in rules |
| FR-2: NOTES.md | ✓ Implemented | grimoires/sigil/NOTES.md with continuity section |
| FR-6: Feedback-First | ✓ Implemented | Step -1 in craft.md |
| FR-9: Anti-Patterns | ✓ Implemented | 00-sigil-core.md `<anti_patterns>` section |

**Phase 2 - Enabled in constitution.yaml**:
| Feature | Status | Evidence |
|---------|--------|----------|
| FR-3: Subagent Validators | ✓ Exists | 4 subagents in .claude/subagents/ |
| FR-5: Context Hygiene | ✓ Implemented | Attention budget in CLAUDE.md |
| FR-7: Zone Architecture | ✓ Documented | Zone architecture in CLAUDE.md |

**Phase 3 - Flags Available**:
| Feature | Status | Evidence |
|---------|--------|----------|
| FR-4: Continuous Learning | ✓ Skill exists | continuous-learning skill |
| FR-8: Run Mode Safety | ✓ Protocol exists | run-mode.md protocol |
| FR-10: Trajectory Logging | Partial | craft-state.md tracks iterations |

**Drift from PRD (Minor)**:
- Feature flags in constitution.yaml don't exactly match PRD structure
- Trajectory logging implemented differently (craft-state.md vs trajectory/*.md)
- Run mode has /run-halt command for safety brake

---

**Next Step**: Enable Phase 2 and Phase 3 feature flags via `/implement` or test individually.
