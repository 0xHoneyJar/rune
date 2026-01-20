# Sigil Observations System: Software Design Document

```
    +===============================================+
    |  SIGIL OBSERVATIONS SYSTEM                    |
    |  Software Design Document                     |
    |                                               |
    |  SDD v1.0.0                                   |
    +===============================================+
```

**Version**: 1.0.0
**Created**: 2026-01-19
**Updated**: 2026-01-19
**Status**: Architecture Complete
**Author**: zksoju + Claude
**PRD Reference**: `grimoires/sigil/prd-observations.md`

---

## Executive Summary

The Sigil Observations System complements the existing taste system by capturing actual user behavior and feedback, rather than only developer preferences. While `taste.md` records how developers modify generated code, the observations system captures raw user feedback from support channels (Discord, Telegram, support tickets) and transforms it into actionable insights.

**Key Design Decisions**:

| Decision | Rationale |
|----------|-----------|
| File-based storage | Consistent with Sigil's grimoire architecture; no external dependencies |
| Level 3 Diagnostic Framework | Mom Test principles ensure we capture actionable truths, not surface requests |
| Gap classification taxonomy | Bug/Discoverability/Feature maps directly to action types |
| Integration with `/craft` | Observations inform physics decisions at generation time |
| Cross-validation with taste | Patterns backed by observations have elevated confidence |

**Implementation Phases**:

| Phase | Component | Status | Dependencies |
|-------|-----------|--------|--------------|
| 1 | `/observe` command | Complete | Skill file, command file |
| 2 | `/craft` integration | In PR #16 | Step 1a modification |
| 3 | `/taste-synthesize` integration | Complete | Pattern matching enhancement |

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Component Design](#3-component-design)
4. [Data Architecture](#4-data-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Integration Points](#7-integration-points)
8. [Scalability & Performance](#8-scalability--performance)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Development Workflow](#10-development-workflow)
11. [Technical Risks & Mitigation](#11-technical-risks--mitigation)
12. [Future Considerations](#12-future-considerations)

---

## 1. System Architecture

### 1.1 High-Level Overview

```
+-------------------------------------------------------------------------+
|                        SIGIL FEEDBACK ECOSYSTEM                          |
+-------------------------------------------------------------------------+
|                                                                         |
|  DEVELOPER PREFERENCE LAYER          USER BEHAVIOR LAYER                |
|  (Existing)                          (New - Observations)               |
|                                                                         |
|  +-----------------------+          +---------------------------+       |
|  |  /craft               |          |  /observe                 |       |
|  |  (CLI Generation)     |          |  (Feedback Capture)       |       |
|  +-----------+-----------+          +-----------+---------------+       |
|              |                                  |                       |
|              v                                  v                       |
|  +-----------+-----------+          +-----------+---------------+       |
|  |  Sigil Toolbar        |          |  Diagnostic Generator     |       |
|  |  (Extension)          |          |  (Level 3 Questions)      |       |
|  +-----------+-----------+          +-----------+---------------+       |
|              |                                  |                       |
|              v                                  v                       |
|  +-----------+------------------------------------------+-----------+   |
|  |                      STORAGE LAYER                               |   |
|  |                                                                  |   |
|  |  grimoires/sigil/                                                |   |
|  |  +------------------+        +-----------------------------+     |   |
|  |  | taste.md         |        | observations/               |     |   |
|  |  | (Dev prefs)      |        | +- {user}-diagnostic.md    |     |   |
|  |  +------------------+        | +- user-insights.md        |     |   |
|  |                              | +- open-questions.md       |     |   |
|  |                              +-----------------------------+     |   |
|  +------------------------------------------------------------------+   |
|              |                                  |                       |
|              v                                  v                       |
|  +-----------+------------------------------------------+-----------+   |
|  |                    LEARNING LAYER                                |   |
|  |                                                                  |   |
|  |  +------------------+        +-----------------------------+     |   |
|  |  | /taste-synthesize|        | Gap Classification          |     |   |
|  |  | (Pattern detect) |<------>| (Bug/Disc/Feature)          |     |   |
|  |  +------------------+        +-----------------------------+     |   |
|  |                                                                  |   |
|  +------------------------------------------------------------------+   |
|              |                                                          |
|              v                                                          |
|  +-----------+------------------------------------------------------+   |
|  |                    APPLICATION LAYER                             |   |
|  |                                                                  |   |
|  |  +------------------+  +------------------+  +------------------+|   |
|  |  | /craft physics   |  | PRD prioritized  |  | Bug fixes        ||   |
|  |  | (user-informed)  |  | (user-validated) |  | (user-reported)  ||   |
|  |  +------------------+  +------------------+  +------------------+|   |
|  +------------------------------------------------------------------+   |
|                                                                         |
+-------------------------------------------------------------------------+
```

### 1.2 Component Interaction Flow

```
Raw User Feedback (Discord/TG/Support)
         |
         | Developer runs /observe "<quote>"
         v
+-------------------+
| Quote Parser      | --> Extract behavioral signals
| (NLP-lite)        |     from raw quote
+-------------------+
         |
         v
+-------------------+
| User Profiler     | --> Classify: Decision-maker/Builder/
|                   |     Trust-checker/Casual
+-------------------+
         |
         v
+-------------------+
| Level 3 Engine    | --> Generate diagnostic questions
| (Mom Test)        |     following interview principles
+-------------------+
         |
         v
+-------------------+
| Hypothesis        | --> Map possible responses to
| Generator         |     gap types (Bug/Disc/Feature)
+-------------------+
         |
         v
+-------------------+
| Diagnostic File   | --> Create {user}-diagnostic.md
| Writer            |     with full context
+-------------------+
         |
    +----+----+
    |         |
    v         v
Questions   Hypothesis Space
  Asked     (Pre-mapped)
    |             |
    v             |
Responses         |
    |             |
    +------+------+
           |
           v
+-------------------+
| Gap Classifier    | --> Bug / Discoverability / Feature
+-------------------+
           |
      +----+----+----+
      |    |         |
      v    v         v
    Bug  Disc     Feature
      |    |         |
      v    v         v
    Fix  /craft    PRD
           |
           v
+-------------------+
| user-insights.md  | --> Aggregated confirmed findings
+-------------------+
           |
           v
+-------------------+
| /taste-synthesize | --> Cross-validation with
| (Integration)     |     taste patterns
+-------------------+
```

### 1.3 Dual-System Comparison

| Aspect | Taste System | Observations System |
|--------|--------------|---------------------|
| **Source** | Developer modifications to generated code | Raw user feedback from support channels |
| **Signal Types** | ACCEPT/MODIFY/REJECT | Quote/Question/Response/Classification |
| **Captures** | Physics preferences (timing, animation, material) | User goals, gaps, pain points |
| **Storage** | `taste.md` (single file) | `observations/` (directory with multiple files) |
| **Integration** | Automatic at `/craft` time | Explicit via `/observe` command |
| **Confidence** | Weight-based (1/5/-3) | Classification-based (Bug/Disc/Feature) |

---

## 2. Technology Stack

### 2.1 Core Technologies

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Command Interface** | Claude Code Skill | Native integration with existing `/craft`, `/taste-synthesize` |
| **Storage** | Markdown files with YAML frontmatter | Human-readable, git-trackable, no external dependencies |
| **Parsing** | YAML frontmatter + Markdown body | Structured metadata with flexible content |
| **Pattern Matching** | JavaScript/TypeScript regex | Lightweight, no ML dependencies |

### 2.2 File Format Standards

**Diagnostic File Format**:
```yaml
---
created: "2026-01-19T10:00:00Z"
updated: "2026-01-19T14:30:00Z"
user:
  handle: "papa_flavio"
  channel: "discord"
  type: "decision-maker"  # decision-maker | builder | trust-checker | casual
  engagement: "high"      # high | medium | low
status: "in-progress"     # in-progress | validated | archived
gap_type: null            # null | bug | discoverability | feature
---

# {Username} Diagnostic Log

## User Profile
...

## Level 3 Diagnostic
...
```

**User Insights Format**:
```yaml
---
version: 1
last_updated: "2026-01-19T14:30:00Z"
insight_count: 12
---

# User Insights

## Validated Findings
...
```

### 2.3 Dependency Analysis

| Dependency | Required? | Purpose |
|------------|-----------|---------|
| Existing Sigil rules | Yes | Physics detection, effect classification |
| `grimoires/sigil/` directory | Yes | Storage location |
| `/craft` command | Yes | Integration point for physics adjustment |
| `/taste-synthesize` | Yes | Cross-validation integration |
| External APIs | No | Manual workflow, no automated ingestion |

---

## 3. Component Design

### 3.1 `/observe` Command

**File**: `.claude/commands/observe.md`

**Responsibilities**:
1. Parse user quote for behavioral signals
2. Classify user type
3. Generate Level 3 diagnostic questions
4. Create hypothesis space
5. Write diagnostic file

**Input Schema**:
```
/observe "<user-quote>" [--user NAME] [--channel SOURCE] [--existing FILE]
```

**Output**: Creates `grimoires/sigil/observations/{username}-diagnostic.md`

**Algorithm - Quote Parser**:
```
function parseQuote(quote: string): BehavioralSignals {
  signals = {
    intent: [],      // What they're trying to do
    frustration: [], // Pain points expressed
    workaround: [],  // Existing solutions mentioned
    frequency: null, // How often they do this
    stakes: null     // What's at risk
  }

  // Intent detection
  if (quote.matches(/planning|want to|trying to|need to/i)) {
    signals.intent.push(extractGoal(quote))
  }

  // Frustration detection
  if (quote.matches(/doesn't|can't|won't|broken|missing/i)) {
    signals.frustration.push(extractPainPoint(quote))
  }

  // Workaround detection
  if (quote.matches(/instead|manually|spreadsheet|external/i)) {
    signals.workaround.push(extractWorkaround(quote))
  }

  return signals
}
```

**Algorithm - User Type Classification**:
```
function classifyUserType(signals: BehavioralSignals): UserType {
  // Decision-maker: Planning actions, checking data for decisions
  if (signals.intent.some(i => i.matches(/planning|deciding|checking/))) {
    return "decision-maker"
  }

  // Builder: Technical details, implementation thinking
  if (signals.frustration.some(f => f.matches(/API|contract|code|bug/))) {
    return "builder"
  }

  // Trust-checker: Frequent verification
  if (signals.frequency === "high" && signals.stakes === "low") {
    return "trust-checker"
  }

  // Default: Casual
  return "casual"
}
```

**Algorithm - Question Generator**:
```
function generateQuestions(
  quote: string,
  signals: BehavioralSignals,
  userType: UserType
): Question[] {
  questions = []

  // Core Level 3 question (always asked)
  questions.push({
    text: "What were you trying to accomplish when this happened?",
    reveals: "True goal behind the surface request"
  })

  // Past-specific question (Mom Test principle 2)
  questions.push({
    text: `When did you last ${signals.intent[0] || "do this"}? What triggered it?`,
    reveals: "Frequency and context of behavior"
  })

  // Workaround question (seeks disconfirming evidence)
  questions.push({
    text: "What do you do currently to work around this?",
    reveals: "Whether feature actually needed or discoverability issue"
  })

  // User-type specific questions
  if (userType === "decision-maker") {
    questions.push({
      text: "What data would help you make this decision faster?",
      reveals: "Information architecture gaps"
    })
  }

  return questions
}
```

### 3.2 Diagnostic File Generator

**Responsibilities**:
1. Assemble all parsed information
2. Generate hypothesis space
3. Write structured markdown

**Hypothesis Space Generator**:
```
function generateHypothesisSpace(
  signals: BehavioralSignals
): HypothesisMapping[] {
  hypotheses = []

  // For each frustration, map possible gap types
  for (frustration of signals.frustration) {
    hypotheses.push({
      ifTheySay: `"${frustration.text} but I found it after"`,
      gapType: "discoverability",
      action: "Improve navigation/labeling via /craft"
    })

    hypotheses.push({
      ifTheySay: `"${frustration.text} and it's broken"`,
      gapType: "bug",
      action: "Fix immediately"
    })

    hypotheses.push({
      ifTheySay: `"${frustration.text} - this doesn't exist"`,
      gapType: "feature",
      action: "Add to PRD/roadmap"
    })
  }

  return hypotheses
}
```

### 3.3 `/craft` Integration (Phase 2)

**Modified Step 1a**:
```
### Step 1a: Discover Context (Modified)

Before reading taste.md, scan observations:

1. Read grimoires/sigil/observations/user-insights.md
   - Look for insights relevant to component being crafted
   - Extract user types and their physics implications

2. Scan grimoires/sigil/observations/*.diagnostic.md
   - Check for open diagnostics related to this component
   - Extract validated gap classifications

3. Apply observation context:
   - User type "decision-maker" → may need more data density
   - User type "casual" → may need simpler interactions
   - Gap type "discoverability" → surface more prominently
```

**Analysis Box Enhancement**:
```
+-- Craft Analysis ----------------------------------------+
|                                                          |
|  Target:       ClaimButton (new)                         |
|  Craft Type:   Generate                                  |
|  Effect:       Financial mutation                        |
|                                                          |
|  Observations:                                           |
|    papa_flavio: "need to know rewards before burn"       |
|    > User type: decision-maker                           |
|    > Implies: Show amount prominently                    |
|                                                          |
|  Behavioral    Pessimistic | 800ms | Confirmation        |
|  Animation     ease-out | deliberate | no bounce         |
|  Material      Elevated | Soft shadow | 8px radius       |
|                                                          |
|  Output:       src/components/ClaimButton.tsx            |
+----------------------------------------------------------+
```

### 3.4 `/taste-synthesize` Integration (Phase 3)

**Cross-Validation Algorithm**:
```
function crossValidatePatterns(
  tastePatterns: Pattern[],
  observations: Observation[]
): EnhancedPattern[] {
  enhanced = []

  for (pattern of tastePatterns) {
    // Find observations that support this pattern
    supporting = observations.filter(obs =>
      obs.gapType === "discoverability" &&
      obs.relatedComponent === pattern.component
    )

    if (supporting.length > 0) {
      enhanced.push({
        ...pattern,
        confidence: elevateConfidence(pattern.confidence),
        observationEvidence: supporting.map(o => o.summary)
      })
    } else {
      enhanced.push(pattern)
    }
  }

  return enhanced
}

function elevateConfidence(current: Confidence): Confidence {
  switch (current) {
    case "LOW": return "MEDIUM"
    case "MEDIUM": return "HIGH"
    case "HIGH": return "VERY_HIGH"  // New level for obs-backed
  }
}
```

**Synthesis Report Enhancement**:
```markdown
## Pattern: Financial buttons timing (800ms -> 500ms)

| Metric | Value |
|--------|-------|
| Signals | 5 MODIFY |
| Confidence | HIGH -> VERY_HIGH (observation-backed) |
| User Types | mobile (3), power-user (2) |

### Observation Evidence

- **papa_flavio** (decision-maker): "planning burns" -> needs quick data checks
- **alice** (trust-checker): "checking rewards often" -> high frequency usage

### Recommendation

Inscribe 500ms as default for Financial effects when user_type is mobile or power-user.
```

---

## 4. Data Architecture

### 4.1 File Structure

```
grimoires/sigil/
+-- taste.md                           # Developer preferences (existing)
+-- observations/
|   +-- .gitkeep                       # Directory placeholder
|   +-- {username}-diagnostic.md       # Individual diagnostic logs
|   +-- user-insights.md               # Aggregated confirmed findings
|   +-- open-questions.md              # Questions awaiting answers
+-- inscribed-patterns.yaml            # Applied rules (existing)
+-- dismissed-patterns.yaml            # Rejected patterns (existing)
```

### 4.2 Diagnostic File Schema

```yaml
---
# YAML Frontmatter
created: "2026-01-19T10:00:00Z"        # ISO 8601
updated: "2026-01-19T14:30:00Z"        # ISO 8601
user:
  handle: "string"                      # Required
  channel: "string"                     # discord | telegram | support | direct
  type: "string"                        # decision-maker | builder | trust-checker | casual
  engagement: "string"                  # high | medium | low
  stakes: "string"                      # Description of what's at risk
status: "string"                        # in-progress | validated | archived
gap_type: "string | null"               # null | bug | discoverability | feature
related_components: ["string"]          # Component names for /craft integration
---

# {Username} Diagnostic Log

## User Profile

| Field | Value |
|-------|-------|
| **Type** | {type} |
| **Behavior** | {observed behavior pattern} |
| **Stakes** | {what's at risk for them} |
| **Engagement** | {level + evidence} |

---

## Level 3 Diagnostic

### Initial Report
> "{Original quote}"

### Goal (Level 3)
**What are they trying to accomplish?**
- {Inferred goal from quote}

### Questions to Ask

- [ ] "{Diagnostic question 1}"
- [ ] "{Diagnostic question 2}"
- [ ] "{Diagnostic question 3}"

### Responses

*(Awaiting responses or filled in after follow-up)*

---

## What We're Trying to Learn

| Question | What it reveals |
|----------|-----------------|
| {Question 1} | {Insight gained} |
| {Question 2} | {Insight gained} |

---

## Hypothesis Space

| If they say... | Gap type | Action |
|----------------|----------|--------|
| "{Response A}" | Feature | {Action} |
| "{Response B}" | Bug | {Action} |
| "{Response C}" | Discoverability | {Action} |

---

## Timeline

| Date | Event |
|------|-------|
| {created} | Initial report captured |
| {created} | Diagnostic questions queued |
| | *(pending events)* |

---

## Next Steps

1. Get answers to diagnostic questions
2. Classify gap type
3. If UI work needed -> /craft with full context
4. Update user-insights.md with confirmed findings
```

### 4.3 User Insights Schema

```yaml
---
version: 1
last_updated: "2026-01-19T14:30:00Z"
insight_count: 12
by_gap_type:
  bug: 3
  discoverability: 5
  feature: 4
by_user_type:
  decision-maker: 4
  builder: 3
  trust-checker: 2
  casual: 3
---

# User Insights

Aggregated findings from validated observations.

---

## Validated Findings

### Insight: {Title}

| Field | Value |
|-------|-------|
| **Gap Type** | {bug/discoverability/feature} |
| **User Types** | {affected user types} |
| **Evidence** | {diagnostic references} |
| **Status** | {open/addressed} |
| **Action Taken** | {what was done} |

**Summary**: {1-2 sentence description}

**Physics Implications**:
- {Implication for /craft}
- {Implication for /craft}

---
```

### 4.4 Open Questions Schema

```yaml
---
last_updated: "2026-01-19T14:30:00Z"
pending_count: 5
oldest_question: "2026-01-15T10:00:00Z"
---

# Open Questions

Questions awaiting user responses across all diagnostics.

---

## Pending Questions

### For: {username}

**Source**: {diagnostic file reference}
**Asked**: {date}
**Priority**: {high/medium/low}

1. "{Question text}"
   - **Why we're asking**: {What this reveals}
   - **Response**: *(pending)*

---
```

---

## 5. API Design

### 5.1 Command Interface

The observations system operates through CLI commands rather than HTTP APIs. All interactions are file-based.

**`/observe` Command**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `quote` | string | Yes | - | Raw user quote in double quotes |
| `--user` | string | No | "anonymous" | Username/handle |
| `--channel` | string | No | "direct" | Feedback source |
| `--existing` | string | No | - | Path to existing diagnostic file |

**Examples**:
```bash
# Basic observation
/observe "Im planning some henlo burns so gud to know how much im receiving" --user papa_flavio

# With channel
/observe "the claim button doesn't show my rewards" --user alice --channel discord

# Adding to existing diagnostic
/observe "ah I track it in a spreadsheet actually" --user papa_flavio --existing papa_flavio-diagnostic.md
```

### 5.2 Internal Data Contracts

**Quote Parser -> User Profiler**:
```typescript
interface BehavioralSignals {
  intent: string[];          // Extracted goals/actions
  frustration: string[];     // Pain points
  workaround: string[];      // Existing solutions
  frequency: "high" | "medium" | "low" | null;
  stakes: string | null;
}
```

**User Profiler -> Question Generator**:
```typescript
interface UserProfile {
  type: "decision-maker" | "builder" | "trust-checker" | "casual";
  engagement: "high" | "medium" | "low";
  behaviorPattern: string;
}
```

**Question Generator -> File Writer**:
```typescript
interface DiagnosticQuestions {
  questions: Array<{
    text: string;
    reveals: string;
    priority: "high" | "medium" | "low";
  }>;
  hypothesisSpace: Array<{
    ifTheySay: string;
    gapType: "bug" | "discoverability" | "feature";
    action: string;
  }>;
}
```

### 5.3 Cross-System Integration

**Observations -> /craft Integration**:
```typescript
interface ObservationContext {
  userType: string;
  userHandle: string;
  quote: string;
  inferredPhysics: {
    timing?: string;        // e.g., "faster for frequent checks"
    confirmation?: string;  // e.g., "extra confirmation for high stakes"
    information?: string;   // e.g., "show amount prominently"
  };
}
```

**Observations -> /taste-synthesize Integration**:
```typescript
interface ObservationEvidence {
  diagnosticRef: string;      // Path to diagnostic file
  summary: string;            // One-line summary
  userType: string;
  gapType: string;
  relatedPattern: string;     // Pattern it supports
}
```

---

## 6. Security Architecture

### 6.1 Threat Model

| Threat | Impact | Mitigation |
|--------|--------|------------|
| PII in quotes | Privacy violation | Sanitization guidance, no automation |
| Malicious quotes | Code injection | Markdown escaping, no eval |
| False attribution | Reputation damage | Manual workflow, human verification |
| Data loss | Lost insights | Git tracking, no auto-deletion |

### 6.2 Data Handling

**Quote Sanitization Guidelines**:
```markdown
Before running /observe, consider:

1. Remove personally identifiable information (emails, wallet addresses)
2. Replace real names with handles
3. Summarize rather than quote verbatim if sensitive
4. Do NOT include:
   - Private keys or seed phrases
   - Financial amounts unless necessary
   - Location data
   - Personal contact information
```

**File Security**:
```markdown
Observations directory:

1. Included in .gitignore by default? NO
   - Insights are valuable team knowledge
   - Should be version controlled

2. Sensitive observations:
   - Create in .gitignore-listed subdirectory if needed
   - Or use [REDACTED] placeholders

3. Access control:
   - Standard git repository access
   - No special permissions needed
```

### 6.3 No External Dependencies

The observations system has no external API calls, databases, or third-party services. All data remains in the local filesystem within the `grimoires/sigil/` directory.

---

## 7. Integration Points

### 7.1 Existing Sigil Components

| Component | Integration Type | Data Flow |
|-----------|------------------|-----------|
| `/craft` | Read observations at Step 1a | observations/ -> craft analysis |
| `/taste-synthesize` | Cross-validate patterns | observations/ -> confidence elevation |
| `taste.md` | Complementary data | taste.md + observations/ = full picture |
| Sigil rules | Inform physics adjustments | observations -> rule proposals via /inscribe |

### 7.2 Integration with `/craft`

**Step 1a Enhancement**:
```markdown
### Step 1a: Discover Context (Enhanced)

**1a-i. Read observations** (if exists):
```
Scan grimoires/sigil/observations/
```
Look for:
- **user-insights.md** — Aggregated validated findings
- **{user}-diagnostic.md** — Open diagnostics with relevant components
- **open-questions.md** — Pending questions (may affect confidence)

Extract physics implications:
- User types -> timing/confirmation adjustments
- Gap classifications -> feature/discoverability focus
- Validated insights -> apply as context

**Context Priority** (updated):
When context conflicts with defaults, apply in this order:
1. Protected capabilities (never override)
2. Explicit user request in prompt
3. **Observation-backed insights** (NEW)
4. Primary persona physics implications
5. Brand guidelines
6. Domain rules
7. Taste log patterns
8. Physics defaults
```

### 7.3 Integration with `/taste-synthesize`

**Enhanced Pattern Matching**:
```markdown
### Pattern Detection (Enhanced)

When detecting patterns in taste.md:

1. Group signals by effect, change, user type, expected feel (existing)

2. **NEW**: Cross-reference with observations:
   - For each pattern, search observations/user-insights.md
   - Match on: component name, effect type, user type
   - If match found: elevate confidence

3. Confidence levels (updated):

| Base Count | Base Level | With Observation | Final Level |
|------------|------------|------------------|-------------|
| 3-4 signals | LOW | +1 observation | MEDIUM |
| 5-7 signals | MEDIUM | +1 observation | HIGH |
| 8+ signals | HIGH | +1 observation | VERY_HIGH |

4. Synthesis report format (enhanced):

```markdown
## Pattern: {description}

| Metric | Value |
|--------|-------|
| Signals | {count} {type} |
| Confidence | {base} -> {final} |
| Observation Evidence | {Yes/No} |

### Supporting Observations

{If observation evidence exists}
- **{user}** ({type}): "{quote summary}" -> {gap type}

### Recommendation

{Action to take}
```
```

---

## 8. Scalability & Performance

### 8.1 Performance Considerations

| Operation | Expected Load | Optimization |
|-----------|---------------|--------------|
| `/observe` execution | Low (manual trigger) | No optimization needed |
| `/craft` observation scan | Every craft | Single directory scan, cached |
| `/taste-synthesize` cross-validation | Periodic (weekly) | Index user-insights.md |

### 8.2 File Growth Management

**Diagnostic Files**:
- Expected: 10-50 per month for active projects
- Recommendation: Archive validated diagnostics quarterly

**User Insights**:
- Single file, append-only
- Expected: 50-200 insights before archival
- Recommendation: Archive annually, keep current year

**Archival Strategy**:
```
grimoires/sigil/observations/
+-- archive/
|   +-- 2025/                          # Year-based archives
|   |   +-- q1-diagnostics/
|   |   +-- q1-insights.md
+-- {current diagnostics}
+-- user-insights.md                   # Current insights only
```

### 8.3 Search Optimization

For `/craft` integration, maintain a lightweight index:

```yaml
# grimoires/sigil/observations/.index.yaml (auto-generated)
last_updated: "2026-01-19T14:30:00Z"
diagnostics:
  - file: papa_flavio-diagnostic.md
    user_type: decision-maker
    gap_type: discoverability
    components: [ClaimButton, RewardsDisplay]
    status: validated
insights:
  - id: insight-001
    gap_type: discoverability
    user_types: [decision-maker]
    components: [ClaimButton]
```

This index is regenerated on each `/observe` execution and read by `/craft`.

---

## 9. Deployment Architecture

### 9.1 No Deployment Required

The observations system is entirely file-based and operates within the Claude Code skill system. No deployment, hosting, or infrastructure is required.

### 9.2 Directory Setup

**Initial Setup** (one-time):
```bash
# Ensure observations directory exists
mkdir -p grimoires/sigil/observations

# Create placeholder files
touch grimoires/sigil/observations/.gitkeep
echo "# User Insights\n\nNo insights yet." > grimoires/sigil/observations/user-insights.md
echo "# Open Questions\n\nNo pending questions." > grimoires/sigil/observations/open-questions.md
```

### 9.3 Version Control

All observation files should be committed to git:
- Diagnostic files capture team knowledge
- User insights are valuable for future reference
- Open questions track research in progress

**Git Best Practices**:
```bash
# Commit observations with clear messages
git add grimoires/sigil/observations/
git commit -m "feat(observations): add papa_flavio diagnostic on rewards visibility"

# Use conventional commits for observation updates
# - feat(observations): new diagnostic or insight
# - fix(observations): correction to existing data
# - chore(observations): archival or cleanup
```

---

## 10. Development Workflow

### 10.1 Implementation Order

**Phase 1: /observe Command** (Complete)
1. Create `.claude/commands/observe.md`
2. Implement quote parsing
3. Implement user type classification
4. Implement question generation
5. Implement diagnostic file writing

**Phase 2: /craft Integration** (In Progress - PR #16)
1. Modify Step 1a in `/craft` command
2. Add observation context to analysis box
3. Apply user type physics implications
4. Test with sample diagnostics

**Phase 3: /taste-synthesize Integration** (Complete)
1. Add observation cross-reference
2. Implement confidence elevation
3. Enhance synthesis report
4. Test with observation + taste data

### 10.2 Testing Strategy

**Manual Testing Checklist**:

```markdown
## /observe Command Testing

- [ ] Basic quote parsing extracts intent
- [ ] User type classification matches expected
- [ ] Diagnostic questions follow Mom Test principles
- [ ] Hypothesis space covers Bug/Disc/Feature
- [ ] File created in correct location
- [ ] File format matches schema

## /craft Integration Testing

- [ ] Observations directory scanned at Step 1a
- [ ] Relevant observations shown in analysis box
- [ ] User type physics implications applied
- [ ] No errors when observations/ empty

## /taste-synthesize Integration Testing

- [ ] Cross-reference finds matching observations
- [ ] Confidence elevated correctly
- [ ] Synthesis report shows observation evidence
- [ ] Works when no matching observations
```

### 10.3 Validation Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feedback capture rate | 80% of actionable feedback | Observations created / feedback received |
| Gap classification accuracy | 90% | Validated classification / actual resolution |
| Cross-validation hits | 50% of HIGH confidence patterns | Patterns with observation backing |
| /craft context usage | 30% of crafts | Crafts with observation reference |

---

## 11. Technical Risks & Mitigation

### 11.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Manual workflow friction | High | Medium | Streamlined /observe UX, minimal required fields |
| Stale diagnostics | Medium | Low | Status tracking, periodic review prompts |
| Over-classification | Medium | Medium | Clear taxonomy, hypothesis space guides |
| Integration complexity | Low | High | Phased rollout, each phase independent |
| Performance at scale | Low | Low | File-based, natural limits |

### 11.2 Mitigation Strategies

**Manual Workflow Friction**:
- Minimize required input: just quote + user name
- Auto-generate user type, questions, hypotheses
- Provide clear next steps in diagnostic file

**Stale Diagnostics**:
- Add `status` field (in-progress, validated, archived)
- `/taste-synthesize` flags diagnostics older than 30 days
- Encourage resolution in weekly reviews

**Over-Classification**:
- Provide clear definitions in command help
- Hypothesis space prevents premature classification
- Require actual user response before classifying

---

## 12. Future Considerations

### 12.1 Potential Enhancements

| Enhancement | Complexity | Value | Timeline |
|-------------|------------|-------|----------|
| Automated Discord/TG ingestion | High | High | Post-v1.0 |
| NLP-based quote analysis | High | Medium | Post-v1.0 |
| Observation dashboard | Medium | Medium | Post-v1.0 |
| User identity resolution | Medium | Low | As needed |

### 12.2 Automated Ingestion (Future)

```
Discord/Telegram Bot
        |
        | Webhook on specific channels
        v
+-------------------+
| Ingestion Service | --> Filter for actionable feedback
+-------------------+
        |
        v
+-------------------+
| Auto-/observe     | --> Create draft diagnostics
+-------------------+
        |
        v
+-------------------+
| Human Review      | --> Developer validates/edits
+-------------------+
```

**Requirements for automation**:
- Bot with read access to support channels
- Keyword filtering for actionable feedback
- Draft state for human review
- Integration with existing /observe workflow

### 12.3 Integration with Product Analytics

Future integration could connect observations with:
- Heatmaps showing where users struggle
- Session recordings for context
- Feature usage metrics for validation

This would require external tool integration (Amplitude, Hotjar, etc.) which is explicitly out of scope for v1.0.

---

## Appendix A: Example Diagnostic File

```markdown
---
created: "2026-01-19T10:00:00Z"
updated: "2026-01-19T14:30:00Z"
user:
  handle: "papa_flavio"
  channel: "discord"
  type: "decision-maker"
  engagement: "high"
  stakes: "Token burns are irreversible; needs confidence before executing"
status: "in-progress"
gap_type: null
related_components: [ClaimButton, RewardsDisplay]
---

# papa_flavio Diagnostic Log

## User Profile

| Field | Value |
|-------|-------|
| **Type** | Decision-maker |
| **Behavior** | Planning burns, needs data to decide timing |
| **Stakes** | Token burns are irreversible |
| **Engagement** | High - active community member |

---

## Level 3 Diagnostic

### Initial Report
> "Im planning some henlo burns so gud to know how much im receiving"

### Goal (Level 3)
**What are they trying to accomplish?**
- Deciding optimal timing for token burns based on accumulated rewards
- Needs visibility into current reward rate to plan burn strategy

### Questions to Ask

- [ ] "When do you typically check your rewards? What triggers that check?"
- [ ] "How do you currently track your rewards over time?"
- [ ] "What would help you decide when to burn?"

### Responses

*(Awaiting responses)*

---

## What We're Trying to Learn

| Question | What it reveals |
|----------|-----------------|
| When do you check rewards? | Frequency + trigger of behavior |
| How do you track? | Whether they use workarounds (spreadsheet, etc.) |
| What would help decide? | True information need |

---

## Hypothesis Space

| If they say... | Gap type | Action |
|----------------|----------|--------|
| "I have to calculate it manually" | Discoverability | Show projected rewards in UI |
| "The number doesn't update" | Bug | Fix rewards refresh |
| "There's no history view" | Feature | Add rewards history component |

---

## Timeline

| Date | Event |
|------|-------|
| 2026-01-19 10:00 | Initial report captured |
| 2026-01-19 10:00 | Diagnostic questions queued |
| | *(awaiting responses)* |

---

## Next Steps

1. Get answers to diagnostic questions
2. Classify gap type
3. If UI work needed -> `/craft ClaimButton @context/papa_flavio-diagnostic.md`
4. Update `user-insights.md` with confirmed findings
```

---

## Appendix B: Mom Test Quick Reference

| Principle | Good Question | Bad Question |
|-----------|---------------|--------------|
| Talk about their life | "When did you last check your rewards?" | "Would you use a rewards tracker?" |
| Ask about specifics | "What happened the last time you burned?" | "Do you burn often?" |
| Talk less, listen more | [Follow-up on their answer] | [Pitching your solution] |
| Seek disconfirming evidence | "When was this NOT a problem?" | "This is a problem, right?" |
| Push for commitment | "Would you try a beta if we built this?" | "Do you think this is useful?" |

---

## Appendix C: Gap Type Actions

| Gap Type | Meaning | Immediate Action | Long-term Action |
|----------|---------|------------------|------------------|
| **Bug** | Feature exists but broken | Fix immediately | Add regression test |
| **Discoverability** | Feature exists but not found | `/craft` improvement | UX audit |
| **Feature** | Capability doesn't exist | Add to roadmap | PRD for next cycle |

---

*Document generated by Sigil Observations System SDD v1.0.0*
