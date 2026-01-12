# Sigil Context

> How context accumulates invisibly, cold start solutions, and veto mechanisms.

---

## The Three Contexts

| Context | What It Captures | How It's Used |
|---------|------------------|---------------|
| **Taste** | Design preferences | Physics, patterns, layout |
| **Persona** | Who you're building for | Copy voice, jargon, trust signals |
| **Project** | Codebase knowledge | Imports, folders, conventions |

**All invisible. All learned from usage.**

---

## 1. Taste Accumulation

### Signals

```
Designer accepts generation → Positive signal
Designer modifies generation → Learning signal (what changed?)
Designer rejects generation → Negative signal
```

### What's Learned

| Signal | Example | Learning |
|--------|---------|----------|
| Accept | Keeps `server-tick` physics | "Prefers deliberate for critical" |
| Modify | Changes `snappy` to `deliberate` | "Deliberate > snappy for buttons" |
| Reject | Discards entire generation | "Pattern doesn't fit project" |

### Storage (Invisible)

```json
// .sigil/.context/taste.json (never exposed to designer)
{
  "physics": {
    "critical_zone": "server-tick",
    "casual_zone": "snappy"
  },
  "patterns": {
    "buttons": ["CriticalButton", "SecondaryButton"],
    "layout": "flex-col gap-4"
  },
  "reinforcement": {
    "CriticalButton": 12,  // accepted 12 times
    "CardLayout": 8
  }
}
```

---

## 2. Persona Accumulation

### Signals

```
Prompt language → "make it feel safe" = cautious audience
Copy that survives → "Collect Your Earnings" kept = friendly voice
Copy that's changed → "Claim" → "Get" = jargon avoidance
```

### What's Learned

| Signal | Example | Learning |
|--------|---------|----------|
| Prompt | "skip the tutorial stuff" | Expert audience |
| Kept copy | "Deposit" survived | Technical terms OK |
| Changed copy | "Yield" → "Earnings" | Avoid DeFi jargon |

### Storage (Invisible)

```json
// .sigil/.context/persona.json (never exposed to designer)
{
  "audience": {
    "sophistication": "newcomer",  // or "intermediate", "expert"
    "confidence": 0.75
  },
  "voice": {
    "formality": "friendly",
    "jargon_tolerance": "low",
    "explanation_depth": "high"
  },
  "trust_signals": {
    "needed": true,
    "examples": ["reversibility", "amounts shown"]
  }
}
```

---

## 3. Project Familiarity

### Signals

```
File accessed → Remember path
Import used → Learn convention
Folder referenced → Map structure
```

### What's Learned

| Signal | Example | Learning |
|--------|---------|----------|
| File found | `sigil-mark/moodboard/line-13.svg` | Moodboard folder exists |
| Import style | `@/components/gold` | Using path aliases |
| Naming | `line-13.svg` not `line13.svg` | Kebab-case convention |

### Behavior

```
Designer: "Use line13 from moodboard"

Agent (internally):
  - Known: sigil-mark/moodboard/ exists
  - Try: line13.svg → not found
  - Try: line-13.svg → found!
  
Agent: "Using sigil-mark/moodboard/line-13.svg..."

No questions asked. Designer stays in flow.
```

---

## Cold Start Problem

**Day one: No context accumulated. What happens?**

### Solution: Sensible Defaults + Fast Learning

| Context | Cold Start Default | First Learning |
|---------|-------------------|----------------|
| Taste | Use Gold patterns if exist, else standard | First accept/modify |
| Persona | Neutral voice, moderate jargon | First prompt language |
| Project | Scan codebase structure on mount | First file reference |

### Bootstrap Sequence

```
1. On first /craft:
   - Subagent: Scan src/ for existing patterns
   - Subagent: Check package.json for framework
   - Subagent: Identify Gold/component structure
   
2. First generation:
   - Use scanned patterns
   - Neutral persona (no assumptions)
   - Standard physics
   
3. On first accept/modify/reject:
   - Begin learning immediately
   - Context starts accumulating
   
4. By 5th /craft:
   - Meaningful taste signal
   - Persona starting to form
   - Project familiar
```

### Cold Start Metric

| Interaction | Context Quality |
|-------------|-----------------|
| 1st /craft | Defaults (50%) |
| 5th /craft | Learning (70%) |
| 20th /craft | Confident (90%) |

---

## Veto Mechanism

### The Problem

> "Wrong inferences force wrangling via corrections"
> — Reviewer feedback

If persona is inferred wrong, designer corrects repeatedly. That's still friction.

### The Solution: Natural Correction

Corrections ARE the veto. No forms, no config.

```
Designer: /craft "claim button"
Agent: [Generates newcomer-friendly based on inference]

Designer: "Use technical language, this is for DeFi natives"

Agent: "Got it — adjusting for DeFi-native audience"
       [Updates persona with high weight]
       [Regenerates]
```

### Correction Weight

Explicit corrections carry more weight than implicit signals:

| Signal | Weight |
|--------|--------|
| Accept | 1x |
| Modify | 2x |
| Reject | 2x |
| **Explicit correction** | **5x** |

This means one "use technical language" overrides several implicit signals.

### Artifact Preview (Optional)

For designers who want visibility without breaking flow:

```
Designer: /craft "claim button" --show-context

Agent: [Shows brief context preview]
       Inferred persona: DeFi newcomer (75% confidence)
       Voice: Friendly, low jargon
       Physics: server-tick (critical zone)
       
       [Generates]
```

**This is opt-in.** Default is invisible. Designer can peek if they want.

---

## Subagent Architecture

Context accumulation uses parallel subagents:

```
On /craft:
├── Subagent: Taste mining (recent accepts/rejects)
├── Subagent: Persona inference (prompt analysis)
├── Subagent: Project scan (if cold start)
└── Orchestrator: Merge into unified context

On accept/modify/reject:
├── Subagent: Diff analysis (what changed?)
├── Subagent: Update taste
├── Subagent: Update persona
└── Background (no blocking)
```

---

## Conflict Resolution

When signals conflict:

| Conflict | Resolution |
|----------|------------|
| Recent vs old | Recent wins (decay factor) |
| Explicit vs implicit | Explicit wins (5x weight) |
| Pattern vs correction | Correction wins |
| Low confidence | Ask for clarification (rare) |

### Confidence Threshold

```
If confidence < 50%:
  Agent may ask ONE clarifying question
  
"I'm not sure if this is for DeFi experts or newcomers. 
 Which should I optimize for?"

This is rare. Only when truly ambiguous.
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Cold start usability | **> 70%** (first generation acceptable) |
| Learning speed | **< 5 interactions** to meaningful context |
| Misinference rate | **< 10%** |
| Explicit corrections needed | **< 2 per session** |
| Clarifying questions asked | **< 1 per 20 sessions** |

---

## Related Documents

- **CORE.md** — The inviolable constraint
- **MASON.md** — How generation uses context
- **OBSERVABILITY.md** — Production signals that inform context
