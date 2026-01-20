# Sprint Plan: Sigil Observations System

```
    +===============================================+
    |  SIGIL OBSERVATIONS SYSTEM                    |
    |  Sprint Plan                                  |
    |                                               |
    |  Version 1.0.0                                |
    +===============================================+
```

**Created**: 2026-01-19
**PRD Reference**: `grimoires/sigil/prd-observations.md`
**SDD Reference**: `grimoires/sigil/sdd-observations.md`

---

## Sprint Overview

| Field | Value |
|-------|-------|
| **Project** | Sigil Observations System |
| **Total Sprints** | 3 (2 largely complete, 1 remaining) |
| **Sprint Duration** | 1 week each |
| **Team** | 1 developer + Claude |
| **Status** | Sprint 1 Complete, Sprint 2 In Progress, Sprint 3 Pending |

### Current State Assessment

Based on codebase analysis:

| Phase | Component | Status | Evidence |
|-------|-----------|--------|----------|
| 1 | `/observe` command | **Complete** | `.claude/commands/observe.md` exists with full implementation |
| 2 | `/craft` integration | **In Progress** | PR #16; Step 1a needs observation scanning |
| 3 | `/taste-synthesize` integration | **Pending** | Command exists but lacks observation cross-reference |

### Project Summary

The Observations System complements Sigil's existing taste system by capturing **actual user behavior** rather than just developer preferences. While `taste.md` records how developers modify generated code, observations capture raw user feedback from support channels and transform it into actionable insights.

---

## Sprint 1: /observe Command (COMPLETE)

**Goal**: Create the `/observe` command to capture and structure user feedback

**Status**: Complete

### Task 1.1: Create Command File

**Description**: Create the `/observe` command specification
**Acceptance Criteria**:
- [x] Command file created at `.claude/commands/observe.md`
- [x] Usage documented with examples
- [x] Arguments defined (`quote`, `--user`, `--channel`, `--existing`)
- [x] Output structure specified

**Effort**: M
**Dependencies**: None
**Testing**: Run `/observe` with sample quote

### Task 1.2: Implement Quote Parsing Logic

**Description**: Define quote parsing for behavioral signals
**Acceptance Criteria**:
- [x] Intent detection (planning, want to, trying to, need to)
- [x] Frustration detection (doesn't, can't, won't, broken, missing)
- [x] Workaround detection (instead, manually, spreadsheet, external)
- [x] Frequency and stakes inference

**Effort**: M
**Dependencies**: Task 1.1
**Testing**: Parse sample quotes and verify signal extraction

### Task 1.3: Implement User Type Classification

**Description**: Classify users into types based on behavioral signals
**Acceptance Criteria**:
- [x] Decision-maker detection (planning, deciding, checking)
- [x] Builder detection (API, contract, code, bug mentions)
- [x] Trust-checker detection (high frequency, low stakes)
- [x] Casual as default

**Effort**: S
**Dependencies**: Task 1.2
**Testing**: Verify classification for each user type

### Task 1.4: Implement Diagnostic Question Generation

**Description**: Generate Mom Test style questions
**Acceptance Criteria**:
- [x] Core Level 3 question included ("What were you trying to accomplish?")
- [x] Past-specific questions generated
- [x] Workaround questions included
- [x] User-type specific questions added

**Effort**: M
**Dependencies**: Task 1.3
**Testing**: Verify questions follow Mom Test principles

### Task 1.5: Implement Hypothesis Space Generator

**Description**: Map possible responses to gap types
**Acceptance Criteria**:
- [x] Bug hypothesis generated for each frustration
- [x] Discoverability hypothesis generated
- [x] Feature hypothesis generated
- [x] Actions mapped to each gap type

**Effort**: S
**Dependencies**: Task 1.4
**Testing**: Verify hypothesis space covers all gap types

### Task 1.6: Implement Diagnostic File Writer

**Description**: Create structured diagnostic files
**Acceptance Criteria**:
- [x] YAML frontmatter with metadata
- [x] User Profile section populated
- [x] Level 3 Diagnostic section with quote, goal, questions
- [x] Hypothesis Space table included
- [x] Timeline and Next Steps sections

**Effort**: M
**Dependencies**: Task 1.5
**Testing**: Verify output matches schema in SDD

### Task 1.7: Create Observations Directory Structure

**Description**: Set up file structure for observations
**Acceptance Criteria**:
- [x] `grimoires/sigil/observations/` directory created
- [x] `.gitkeep` placeholder file added
- [x] Directory structure documented

**Effort**: S
**Dependencies**: None
**Testing**: Verify directory exists and is git-tracked

---

## Sprint 2: /craft Integration (IN PROGRESS)

**Goal**: Integrate observations into `/craft` workflow for physics-informed generation

**Status**: In Progress (PR #16)

### Task 2.1: Add Observation Scanning to Step 1

**Description**: Modify `/craft` Step 1a to scan observations directory
**Acceptance Criteria**:
- [ ] Step 1a reads `grimoires/sigil/observations/user-insights.md` if exists
- [ ] Step 1a scans `grimoires/sigil/observations/*.diagnostic.md` files
- [ ] Gracefully handles empty observations directory
- [ ] No performance degradation when observations present

**Effort**: M
**Dependencies**: Sprint 1 complete
**Testing**:
- Run `/craft` with empty observations/ directory
- Run `/craft` with sample diagnostic files
- Verify no errors in either case

### Task 2.2: Extract Physics Implications from Observations

**Description**: Parse observations for physics-relevant context
**Acceptance Criteria**:
- [ ] User type extracted and physics implications mapped:
  - decision-maker -> may need more data density
  - builder -> tolerates complexity
  - trust-checker -> needs confidence signals
  - casual -> needs simplicity
- [ ] Related components matched against craft target
- [ ] Gap classifications influence craft decisions

**Effort**: M
**Dependencies**: Task 2.1
**Testing**: Verify physics implications extracted correctly from sample diagnostic

### Task 2.3: Update Analysis Box with Observation Context

**Description**: Show relevant observations in craft analysis
**Acceptance Criteria**:
- [ ] Analysis box includes "Observations:" section when relevant
- [ ] User handle and quote summary shown
- [ ] User type displayed
- [ ] Physics implications noted (e.g., "Show amount prominently")
- [ ] Section omitted when no relevant observations

**Effort**: M
**Dependencies**: Task 2.2
**Testing**:
- Craft component mentioned in diagnostic, verify observation shown
- Craft unrelated component, verify observation section absent

### Task 2.4: Apply User Type Physics Adjustments

**Description**: Adjust physics based on observed user types
**Acceptance Criteria**:
- [ ] Decision-maker observations influence data display decisions
- [ ] Trust-checker observations add confidence signals
- [ ] Casual observations simplify interactions
- [ ] Adjustments logged in analysis box

**Effort**: M
**Dependencies**: Task 2.3
**Testing**: Verify physics adjustments for each user type

### Task 2.5: Update Context Priority Documentation

**Description**: Document observation-backed insights priority
**Acceptance Criteria**:
- [ ] Context Priority section in `/craft` command updated
- [ ] Observation-backed insights added between "Explicit user request" and "Primary persona"
- [ ] Priority order documented: Protected > Explicit > Observations > Persona > Brand > Domain > Taste > Defaults

**Effort**: S
**Dependencies**: Task 2.4
**Testing**: Review documentation for clarity

### Task 2.6: Create Sample Diagnostic Files

**Description**: Create example diagnostic files for testing
**Acceptance Criteria**:
- [ ] Create `papa_flavio-diagnostic.md` from SDD example
- [ ] Create at least one additional sample diagnostic
- [ ] Files follow schema exactly
- [ ] Files include related_components for testing

**Effort**: S
**Dependencies**: Task 2.1
**Testing**: Verify files parse correctly in /craft integration

---

## Sprint 3: /taste-synthesize Integration (PENDING)

**Goal**: Cross-validate taste patterns with observations for elevated confidence

**Status**: Pending

### Task 3.1: Add Observation Cross-Reference to Pattern Detection

**Description**: Search observations when detecting taste patterns
**Acceptance Criteria**:
- [ ] Pattern detection reads `grimoires/sigil/observations/user-insights.md`
- [ ] For each pattern, search for matching observations by:
  - Component name
  - Effect type
  - User type
- [ ] Match results stored for confidence calculation

**Effort**: M
**Dependencies**: Sprint 2 complete
**Testing**: Detect pattern with and without observation match

### Task 3.2: Implement Confidence Elevation Logic

**Description**: Elevate pattern confidence when observation evidence exists
**Acceptance Criteria**:
- [ ] Confidence elevation follows table:
  - LOW + observation -> MEDIUM
  - MEDIUM + observation -> HIGH
  - HIGH + observation -> VERY_HIGH
- [ ] VERY_HIGH is new confidence level for observation-backed patterns
- [ ] Elevation logic applied during synthesis

**Effort**: S
**Dependencies**: Task 3.1
**Testing**: Verify confidence elevates correctly for each level

### Task 3.3: Enhance Synthesis Report with Observation Evidence

**Description**: Show observation evidence in synthesis report
**Acceptance Criteria**:
- [ ] Report includes "Supporting Observations" section for patterns with evidence
- [ ] Each observation shows: user handle, user type, quote summary, gap type
- [ ] Observation evidence marked as "Yes/No" in pattern summary
- [ ] Confidence shows transition (e.g., "HIGH -> VERY_HIGH")

**Effort**: M
**Dependencies**: Task 3.2
**Testing**: Generate synthesis report with observation-backed patterns

### Task 3.4: Update /taste-synthesize Command Documentation

**Description**: Document observation integration in command file
**Acceptance Criteria**:
- [ ] Command file includes observation cross-reference behavior
- [ ] VERY_HIGH confidence level documented
- [ ] Examples show observation-backed patterns
- [ ] Related files section includes observations/

**Effort**: S
**Dependencies**: Task 3.3
**Testing**: Review documentation for completeness

### Task 3.5: Create user-insights.md Template

**Description**: Create template for aggregated validated findings
**Acceptance Criteria**:
- [ ] Template file created at `grimoires/sigil/observations/user-insights.md`
- [ ] YAML frontmatter with version, last_updated, insight_count
- [ ] Validated Findings section with insight schema
- [ ] Instructions for adding new insights

**Effort**: S
**Dependencies**: Sprint 1 complete
**Testing**: Verify template matches SDD schema

### Task 3.6: Create open-questions.md Template

**Description**: Create template for pending questions
**Acceptance Criteria**:
- [ ] Template file created at `grimoires/sigil/observations/open-questions.md`
- [ ] YAML frontmatter with last_updated, pending_count
- [ ] Pending Questions section with question schema
- [ ] Instructions for tracking question responses

**Effort**: S
**Dependencies**: Sprint 1 complete
**Testing**: Verify template matches SDD schema

### Task 3.7: Integration Testing

**Description**: End-to-end testing of full observation flow
**Acceptance Criteria**:
- [ ] Create observation with `/observe`
- [ ] Verify diagnostic file created correctly
- [ ] Run `/craft` for related component, verify observation context shown
- [ ] Add insight to user-insights.md
- [ ] Run `/taste-synthesize`, verify observation cross-reference
- [ ] Verify confidence elevation for matching patterns

**Effort**: M
**Dependencies**: Tasks 3.1-3.6
**Testing**: Full workflow test with sample data

---

## MVP Definition

### MVP Scope (Sprints 1-2)

The MVP provides:
1. **User feedback capture** via `/observe` command
2. **Structured diagnostics** with Level 3 questions and hypothesis space
3. **Physics-informed generation** with observation context in `/craft`

Users can:
- Capture user feedback from any channel
- Generate diagnostic questions following Mom Test principles
- See observation context when crafting related components
- Make physics decisions informed by actual user behavior

### Post-MVP (Sprint 3)

Sprint 3 adds:
- Cross-validation of taste patterns with observations
- Elevated confidence for observation-backed patterns
- VERY_HIGH confidence tier
- Enhanced synthesis reports

This can be deferred because:
- Core feedback capture loop works without it
- `/craft` integration provides immediate value
- Pattern synthesis is a refinement, not core functionality

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Manual workflow friction** | High | Medium | Minimal required fields; auto-generate questions and hypotheses |
| **Stale diagnostics** | Medium | Low | Add status field; periodic review prompts |
| **Over-classification** | Medium | Medium | Clear taxonomy; hypothesis space prevents premature classification |
| **Observation matching false positives** | Medium | Low | Match on multiple signals (component + effect + user type) |
| **Performance at scale** | Low | Low | File-based storage has natural limits; archive strategy defined |

### Integration Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **`/craft` regression** | Low | High | Graceful handling of missing observations; thorough testing |
| **`/taste-synthesize` complexity** | Medium | Medium | Phased rollout; each phase independent |
| **Observation format drift** | Low | Medium | Strict schema validation; example files as reference |

### Mitigation Strategies

1. **Manual Workflow Friction**
   - Keep `/observe` input minimal: just quote + optional user name
   - Auto-generate all other fields (user type, questions, hypotheses)
   - Provide clear next steps in diagnostic output

2. **Stale Diagnostics**
   - Add `status` field (in-progress, validated, archived)
   - Flag diagnostics older than 30 days in `/taste-synthesize`
   - Encourage resolution in weekly reviews

3. **Integration Complexity**
   - Each sprint is independently valuable
   - Fallback to defaults when observations missing
   - Extensive testing with empty, partial, and full observations

---

## Success Metrics

| Metric | Target | Measurement | Sprint |
|--------|--------|-------------|--------|
| Feedback capture rate | 80% of actionable feedback | Observations created / feedback received | 1 |
| Diagnostic quality | Mom Test compliant questions | Manual review of question generation | 1 |
| `/craft` context usage | 30% of crafts show observation | Crafts with observation reference | 2 |
| Physics adjustment accuracy | 90% correct user type physics | Review physics adjustments vs user type | 2 |
| Gap classification accuracy | 90% correct | Validated classification / actual resolution | 2-3 |
| Cross-validation hits | 50% of HIGH confidence patterns | Patterns with observation backing | 3 |
| Confidence elevation accuracy | 95% correct | Elevated patterns actually observation-backed | 3 |

---

## Timeline Summary

| Sprint | Dates | Focus | Deliverable |
|--------|-------|-------|-------------|
| Sprint 1 | Complete | `/observe` command | Feedback capture workflow |
| Sprint 2 | Current | `/craft` integration | Physics-informed generation |
| Sprint 3 | Next | `/taste-synthesize` integration | Pattern cross-validation |

### Remaining Work Estimate

| Sprint | Remaining Tasks | Effort | Est. Days |
|--------|-----------------|--------|-----------|
| Sprint 2 | 6 tasks | M average | 3-4 days |
| Sprint 3 | 7 tasks | S-M average | 3-4 days |
| **Total** | 13 tasks | | ~1.5 weeks |

---

## Appendix: Task Effort Guide

| Size | Description | Typical Duration |
|------|-------------|------------------|
| S | Simple, well-defined, <2 hours | Half day |
| M | Moderate complexity, 2-4 hours | 1 day |
| L | Complex, requires design decisions, 4-8 hours | 1-2 days |

---

## Appendix: Testing Checklist

### Sprint 2 Testing

```markdown
## /craft Integration Testing

### Setup
- [ ] Create sample diagnostic file in observations/
- [ ] Ensure observations/ directory exists

### Empty Observations
- [ ] Run `/craft "test button"` with empty observations/
- [ ] Verify no errors
- [ ] Verify analysis box does NOT show Observations section

### With Diagnostic
- [ ] Run `/craft "ClaimButton"` (matches sample diagnostic)
- [ ] Verify Observations section appears in analysis
- [ ] Verify user handle and quote shown
- [ ] Verify user type displayed
- [ ] Verify physics implications noted

### Unrelated Component
- [ ] Run `/craft "footer component"` (not in diagnostic)
- [ ] Verify Observations section NOT shown (no match)

### Physics Adjustments
- [ ] Create diagnostic with decision-maker type
- [ ] Craft related component
- [ ] Verify data display adjustments noted

### Edge Cases
- [ ] Malformed diagnostic file (should skip gracefully)
- [ ] Multiple matching diagnostics (should show most relevant)
```

### Sprint 3 Testing

```markdown
## /taste-synthesize Integration Testing

### Setup
- [ ] Create user-insights.md with validated finding
- [ ] Create taste.md with pattern matching finding

### Cross-Reference
- [ ] Run `/taste-synthesize`
- [ ] Verify observation match detected
- [ ] Verify confidence elevated correctly
- [ ] Verify "Supporting Observations" section in report

### No Match
- [ ] Remove matching observations
- [ ] Run `/taste-synthesize`
- [ ] Verify confidence NOT elevated
- [ ] Verify report shows "Observation Evidence: No"

### Confidence Levels
- [ ] Test LOW + observation -> MEDIUM
- [ ] Test MEDIUM + observation -> HIGH
- [ ] Test HIGH + observation -> VERY_HIGH
```

---

*Sprint plan generated by Sigil Observations System v1.0.0*
