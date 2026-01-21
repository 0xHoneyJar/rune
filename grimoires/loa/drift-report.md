# Sigil Drift Report

> Generated: 2026-01-20
> Analysis: Three-Way (Code vs Docs vs Context)
> Branch: feature/v3-operational-infrastructure

## Executive Summary

**Overall Status**: ✅ HEALTHY with MINOR DRIFT

The Sigil framework is well-documented and internally consistent. Most drift is due to rapid feature additions outpacing documentation updates. No critical issues found.

| Category | Status | Count |
|----------|--------|-------|
| Ghosts (documented, not in code) | 🟡 Minor | 3 |
| Shadows (in code, not documented) | 🟡 Minor | 5 |
| Conflicts (docs disagree with code) | 🟢 None | 0 |

## Ghosts: Documented But Missing

Features mentioned in documentation but not found in code.

### 1. Voice Physics Rule File
**Source**: README.md (lines 330-340)
**Claim**: Voice physics layer with copy, tone, microcopy patterns
**Evidence**: No `*-sigil-voice.md` rule file exists
**Impact**: LOW - Voice guidance is embedded in `/craft` analysis but lacks dedicated rule
**Recommendation**: Create `09-sigil-voice.md` or document as informal guidance

### 2. `loa install sigil` Command
**Source**: README.md (lines 516-519)
**Claim**: `loa install sigil` as installation method
**Evidence**: No Loa constructs registry found; manual install via git clone
**Impact**: LOW - Install instructions work via manual method
**Recommendation**: Update README or implement constructs registry

### 3. `sigil-toolbar` Browser Extension
**Source**: CHANGELOG.md v2.2.0 (lines 196-206)
**Claim**: `packages/sigil-toolbar/` browser extension
**Evidence**: No `packages/` directory exists
**Impact**: LOW - Feature mentioned in changelog but not shipped
**Recommendation**: Remove from changelog or implement

## Shadows: In Code But Not Documented

Features present in code but missing from documentation.

### 1. 5 Physics Layers (not 3)
**Location**: README.md (lines 67-100)
**Code Reality**: 5 physics layers exist:
- Behavioral (documented)
- Animation (documented)
- Material (documented)
- Voice (mentioned in README, no rule file)
- Data (19-sigil-data-physics.md - NOT in README physics model)
**Impact**: MEDIUM - Data Physics is critical for Web3 but not prominently documented
**Recommendation**: Update README physics model diagram to include Data Physics

### 2. Run Mode Commands
**Location**: Not in README commands section
**Code Reality**: 7 run mode commands exist:
- /run, /run-sprint-plan, /run-status, /run-halt, /run-resume, /snapshot, /test-flow
**Impact**: LOW - Advanced feature, appropriate for discovery
**Recommendation**: Add to README if targeting power users

### 3. Subagent System
**Location**: Not in README
**Code Reality**: 4 subagents exist for validation
**Impact**: LOW - Internal implementation detail
**Recommendation**: Document in ARCHITECTURE.md if created

### 4. Constitution Feature Flags
**Location**: grimoires/sigil/constitution.yaml (lines 243-262)
**Code Reality**: Feature flags for phased v3 rollout
**Impact**: LOW - Developer-facing config
**Recommendation**: Document flag meanings in constitution file comments

### 5. CODEOWNERS File
**Location**: Should be in repo root
**Code Reality**: Missing
**Impact**: LOW - GitHub feature for PR reviews
**Recommendation**: Create CODEOWNERS for maintainer assignment

## Conflicts: None Found

No cases where documentation actively contradicts code behavior.

## Version Drift

| Artifact | README Version | CHANGELOG Version | Code Version |
|----------|----------------|-------------------|--------------|
| Sigil | v2.5.0 | v2.4.0 (latest entry) | v2.5.0 |
| /craft | - | v2.0.0 | v2.0.0 |

**Note**: CHANGELOG doesn't have v2.5.0 entry yet (current branch adds it).

## Documentation Quality

### README.md
| Aspect | Status |
|--------|--------|
| Installation | ✅ Clear |
| Core concepts | ✅ Well explained |
| Commands table | ✅ Comprehensive |
| Physics tables | ✅ Accurate |
| Examples | ✅ Helpful |
| Links | ✅ Working |

### CLAUDE.md
| Aspect | Status |
|--------|--------|
| Role definition | ✅ Clear |
| Philosophy | ✅ Well articulated |
| Architecture | ✅ Accurate |
| Working guidelines | ✅ Comprehensive |
| Truth hierarchy | ✅ Defined |

### CHANGELOG.md
| Aspect | Status |
|--------|--------|
| Format | ✅ Keep a Changelog compliant |
| Coverage | ✅ Comprehensive history |
| Breaking changes | ✅ Documented |
| Migration guides | ✅ Present |

## Recommendations

### Priority 1: Quick Fixes (< 1 hour)
1. Add CODEOWNERS file
2. Add v2.5.0 entry to CHANGELOG.md
3. Update README physics diagram to show 5 layers (add Data)

### Priority 2: Documentation Improvements (1-4 hours)
1. Create 09-sigil-voice.md rule file (formalize voice physics)
2. Add Run Mode section to README for power users
3. Document constitution feature flags

### Priority 3: Future Considerations
1. Evaluate Loa constructs registry for `loa install sigil`
2. Decide on sigil-toolbar browser extension (ship or remove from changelog)
3. Consider ARCHITECTURE.md for internal systems (subagents, protocols)

## Consistency Score

| Category | Score | Notes |
|----------|-------|-------|
| Code ↔ CLAUDE.md | 95% | Excellent alignment |
| Code ↔ README.md | 90% | Minor drift (Data Physics, Run Mode) |
| Code ↔ CHANGELOG | 85% | Missing v2.5.0 entry |
| Internal docs | 92% | Constitution well-aligned with rules |

**Overall Drift Score**: 8/100 (Lower is better)

This is a healthy, well-documented codebase with minor drift that can be addressed in a single documentation pass.

---

## Appendix: Evidence Citations

| Finding | Source | Line |
|---------|--------|------|
| Voice physics claim | README.md | 330-340 |
| loa install claim | README.md | 516-519 |
| sigil-toolbar claim | CHANGELOG.md | 196-206 |
| Data Physics rule | .claude/rules/19-sigil-data-physics.md | - |
| Run mode commands | .claude/commands/run*.md | - |
| Subagents | .claude/subagents/*.md | - |
| Feature flags | grimoires/sigil/constitution.yaml | 243-262 |
