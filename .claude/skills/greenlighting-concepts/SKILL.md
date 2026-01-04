# Sigil Agent: Greenlighting Concepts

> "Poll concepts, not pixels."

## Role

**Pollster** — Manages community polling for CONCEPTS only. Never polls visuals. Maintains archaeology of rejections.

## Commands

```
/greenlight [concept]      # Start greenlight poll
/greenlight --lockin       # Start lock-in poll for built feature
/greenlight --status       # Show active polls
/greenlight --archaeology  # Search rejection history
```

## Outputs

| Path | Description |
|------|-------------|
| `sigil-mark/governance/greenlight.yaml` | Poll records |
| `sigil-mark/governance/archaeology.yaml` | Rejection history |

## The Two-Phase Model

Based on OSRS Polling Charter:

```
PHASE 1: GREENLIGHT

Question: "Should we EXPLORE building [feature]?"
Threshold: 70%
Duration: 7 days

PASS -> Proceed to refinement (Taste Owners craft it)
FAIL -> Archive to archaeology

---

REFINEMENT (No Poll)

Taste Owners design the specifics.
No community input on colors, animations, layout.
This is dictatorship of craft.

---

PHASE 2: LOCK-IN

Question: "We built [feature]. Should we SHIP it?"
Threshold: 70%
Duration: 7 days

PASS -> Ship to production
FAIL -> Archive or iterate
```

## What Gets Polled

```yaml
pollable:
  - "New major features"
  - "Feature removal"
  - "Major UI paradigm shifts"
  - "New product directions"
  - "New platforms/integrations"
  - "Significant workflow changes"

never_pollable:
  - "Colors"
  - "Fonts"
  - "Animation timing"
  - "Border radius"
  - "Spacing values"
  - "Icon designs"
  - "Shadow styles"
  - "Button shapes"
  - "Micro-interactions"
  - "Loading states"
  - "Error message wording"
```

## Workflow

### Start Greenlight Poll

```
/greenlight "Dark mode support"

GREENLIGHT POLL

Feature: Dark mode support

Creating poll:
  Question: "Should we explore building dark mode support?"
  Threshold: 70%
  Duration: 7 days
  Who votes: all_users

Before publishing, confirm:
- This is a CONCEPT poll (existence of feature)
- NOT a visual poll (what dark mode looks like)
- Taste Owners will design the specifics if it passes

[publish] [edit] [cancel]
```

### Active Poll Status

```
/greenlight --status

Active Polls

POLL-2025-003: Dark mode support
Type: Greenlight
Status: ACTIVE

Current votes:
78.4%
Yes: 1,234 | No: 341 | Total: 1,575

Threshold: 70%
Time remaining: 4 days 12 hours
Projected: PASS

No lock-in polls active.
```

### Lock-In Poll

After feature is built:

```
/greenlight --lockin "Dark mode support"

LOCK-IN POLL

Feature: Dark mode support
Status: Built and ready

Creating lock-in poll:
  Question: "We built dark mode. Should we ship it?"
  Threshold: 70%
  Duration: 7 days

Preview available: [link]

Note: This is a GO/NO-GO vote on shipping.
Visual details are NOT up for vote.

[publish] [cancel]
```

### Archaeology Search

Before proposing a feature, check history:

```
/greenlight --archaeology "sailing"

ARCHAEOLOGY SEARCH: "sailing"

Found 2 related entries:

NEAR-MISS: Sailing Skill (2024-06-15)

Vote: 68.2%
Threshold: 70%
Gap: 1.8%

Reason for failure:
"Concerns about power creep and trivializing existing content"

Cooldown ends: 2024-12-15
Status: ELIGIBLE for re-poll

Meta changes since:
- New continent added (more content to explore)
- Level cap increased
- Community sentiment surveys show increased interest

---

HARD REJECTION: Sailing Minigame (2023-02-01)

Vote: 34.1%
Threshold: 70%

Reason for failure:
"Seen as watered-down version of full skill"

Cooldown ends: 2024-02-01
Status: ELIGIBLE but risky

Recommendation:
The full Sailing Skill is eligible for re-poll with updated pitch
addressing power creep concerns. The minigame approach failed badly.
```

### Automatic Archaeology Check

When user suggests a feature:

```python
def handle_feature_suggestion(feature):
    # Search archaeology
    matches = search_archaeology(feature)

    if matches:
        for match in matches:
            if match.type == "near_miss":
                if not cooldown_expired(match):
                    return f"This was polled {match.date} and got {match.vote}%. " \
                           f"Cooldown ends {match.cooldown_end}."
                else:
                    return f"This was a near-miss ({match.vote}%). " \
                           f"Consider addressing: {match.failure_reason}"

            elif match.type == "hard_rejection":
                return f"This was rejected ({match.vote}%). " \
                       f"Would need significant changes to re-poll."

    return "No previous polls found. Eligible for greenlight."
```

## Poll Configuration

```yaml
# sigil-mark/governance/greenlight.yaml

config:
  thresholds:
    greenlight: 0.70
    lockin: 0.70

  durations:
    greenlight_days: 7
    lockin_days: 7

  cooldowns:
    near_miss_days: 180      # 60-69.9%
    hard_rejection_days: 365  # <60%

  near_miss_range: [0.60, 0.699]

  min_participation: 100

  who_can_vote: "all_users"  # or "power_users", "token_holders"

  who_can_create:
    - "taste_owners"
    - "product_team"
```

## Poll Results

### Pass

```
POLL CLOSED: Dark mode support

Result: PASSED

Final votes:
82.1%
Yes: 2,341 | No: 512 | Total: 2,853

Threshold: 70%
Margin: +12.1%

Next steps:
1. Feature moves to REFINEMENT phase
2. Taste Owners will design specifics
3. Lock-in poll when ready to ship

No visual decisions will be polled.
```

### Fail (Near-Miss)

```
POLL CLOSED: New inventory system

Result: NEAR-MISS

Final votes:
67.8%
Yes: 1,892 | No: 899 | Total: 2,791

Threshold: 70%
Gap: 2.2%

Analysis:
Top concerns from No voters:
- "Worried about complexity"
- "Current system works fine"
- "Need more details"

Archived as NEAR-MISS.
Cooldown: 180 days
Re-poll eligible: 2025-07-15

Recommendation:
Address complexity concerns and provide more
detailed preview before re-polling.
```

### Fail (Hard Rejection)

```
POLL CLOSED: Auto-play music

Result: REJECTED

Final votes:
15.2%
Yes: 234 | No: 1,305 | Total: 1,539

Threshold: 70%
Gap: 54.8%

Archived as HARD REJECTION.
Cooldown: 365 days

This feature should not be re-polled without
fundamental changes to the concept.
```

## Visual Poll Blocking

When user tries to poll a visual decision:

```
/greenlight "Should buttons be rounded or square?"

BLOCKED: Visual Decision

This is a visual decision and CANNOT be polled.

Pollable (concepts):
- "Should we add dark mode?" (YES)
- "Should we redesign the dashboard?" (YES)

Not pollable (visuals):
- "What color should buttons be?" (NO)
- "Should buttons be rounded?" (NO)

Visual decisions are made by Taste Owners.
Use /approve instead.
```

## Integration with /craft

When generating features:

```python
def pre_craft_feature_check(feature_name):
    # Check if feature was greenlit
    polls = load_polls()

    greenlit = any(
        p.feature == feature_name and
        p.type == "greenlight" and
        p.result == "passed"
        for p in polls
    )

    if not greenlit:
        return warn(f"Feature '{feature_name}' has not been greenlit. "
                   f"Run /greenlight first.")

    return proceed()
```

## The Green Pixel Rule

OSRS players once rioted over a single green pixel in a construction icon.

**This is why visuals are NEVER polled.**

A democratic system cannot handle this level of detail without grinding to a halt. Taste Owners dictate pixels. The community votes on concepts.

## Success Criteria

- [ ] Greenlight polls work
- [ ] Lock-in polls work
- [ ] Archaeology tracks all results
- [ ] Near-miss vs hard-rejection classified
- [ ] Cooldowns enforced
- [ ] Visual decisions never polled

## Error Handling

| Situation | Response |
|-----------|----------|
| Visual poll attempted | Block with explanation |
| Feature in cooldown | Show cooldown end date |
| Duplicate poll | Link to existing poll |
| Insufficient participation | Extend duration |

## Next Step

After `/greenlight` passes: Taste Owners design specifics, then `/greenlight --lockin` before shipping.
