# Pending Learnings

Discoveries extracted from debugging sessions, awaiting human review.

**Review Command**: `/skill-audit`

---

## How This Works

1. During /craft, when certain triggers occur, learnings are extracted here
2. Learnings stay pending until reviewed via `/skill-audit`
3. Approved learnings get promoted to: taste.md patterns, rule updates, or constitution.yaml
4. Rejected learnings are archived

## Trigger Conditions

A learning is extracted when:
- 3+ iterations with PARTIAL result on same component
- Undocumented pattern discovered that could help others
- Web3 footgun encountered (BigInt falsy, stale closures, etc.)
- User explicitly says "remember this" or "this should be a rule"

## Learning Entry Format

<!--
Template for extracted learnings:

## [YYYY-MM-DD] {Discovery Title}

**Context**: {What was being crafted}
**Trigger**: {What triggered extraction}
**Component**: {Component name if applicable}

### Discovery

{What was learned}

### Evidence

- Iteration 1: {what happened}
- Iteration 2: {what happened}
- Iteration 3: {what the fix was}

### Recommendation

{Specific rule, pattern, or taste entry to add}

### Promotion Target

- [ ] taste.md pattern
- [ ] Rule update: {which rule file}
- [ ] constitution.yaml addition
- [ ] New anti-pattern

---
-->

## Pending Entries

(No pending learnings)

---

*Last reviewed: never*
