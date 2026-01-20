# Code Reality Inventory

> Extracted: 2026-01-20
> Target: Sigil (Design Physics Framework v2.5.0)
> Previous: 2026-01-01 (v2.0.0)

## Overview

| Aspect | Count | Previous | Delta |
|--------|-------|----------|-------|
| Commands | 47 | 20 | +27 |
| Rules | 21 | - | +21 |
| Skills | 28 | 14 | +14 |
| Subagents | 4 | 0 | +4 |
| Protocols | 33 | 0 | +33 |
| Grimoire files | 80+ | - | - |

## Directory Structure

```
sigil/
├── .claude/                          # Framework core
│   ├── commands/          (47 files) # +27 since last inventory
│   ├── rules/             (21 files) # NEW: Physics laws
│   ├── skills/            (28 dirs)  # +14 skills
│   ├── subagents/         (4 files)  # NEW: Validators
│   ├── protocols/         (33 files) # NEW: Execution guides
│   ├── schemas/           (15 dirs)  # JSON validation
│   ├── templates/
│   ├── scripts/           (77 items)
│   ├── mcp-examples/
│   ├── settings.json
│   ├── checksums.json                # Integrity verification
│   ├── channels.yaml                 # Release channels
│   ├── mcp-registry.yaml             # MCP servers
│   ├── workflow-chain.yaml           # Command orchestration
│   └── reserved-commands.yaml
│
├── grimoires/                        # RENAMED from loa-grimoire/
│   ├── sigil/             # Framework state (was sigil-mark/)
│   │   ├── constitution.yaml
│   │   ├── taste.md
│   │   ├── craft-state.md
│   │   ├── NOTES.md
│   │   ├── context/
│   │   ├── observations/
│   │   └── moodboard/
│   │
│   ├── loa/               # Loa framework state
│   │   ├── prd-*.md
│   │   ├── sdd-*.md
│   │   ├── sprint-*.md
│   │   ├── context/
│   │   │   ├── domain/
│   │   │   ├── ecosystem/
│   │   │   ├── indexer/
│   │   │   └── sessions/
│   │   └── reality/
│   │
│   └── pub/               # Public artifacts
│
├── .run/                  # Cloud runtime config
├── .beads/                # Task management
└── [governance files]
```

## Commands by Category

### Physics Application (4)
| Command | Version | Status |
|---------|---------|--------|
| /craft | v2.0.0 | ✓ Universal entry point |
| /style | v1.0.0 | ✓ Material only |
| /animate | v1.0.0 | ✓ Animation only |
| /behavior | v1.0.0 | ✓ Behavioral only |

### Generation (5)
| Command | Version | Status |
|---------|---------|--------|
| /implement | - | ✓ Sprint task execution |
| /sprint-plan | - | ✓ Sprint planning |
| /plan-and-analyze | - | ✓ PRD discovery |
| /architect | - | ✓ SDD creation |
| /distill | - | ✓ Component breakdown |

### Analysis (4)
| Command | Version | Status |
|---------|---------|--------|
| /ride | - | ✓ Codebase → grimoire |
| /garden | - | ✓ Pattern authority |
| /observe | - | ✓ User feedback |
| /understand | - | ✓ Domain research |

### Validation (5)
| Command | Version | Status |
|---------|---------|--------|
| /audit | - | ✓ Security/quality |
| /audit-sprint | - | ✓ Sprint security |
| /audit-deployment | - | ✓ Deployment audit |
| /review-sprint | - | ✓ Code review |
| /ward | - | ✓ Physics compliance |

### Framework Management (7)
| Command | Version | Status |
|---------|---------|--------|
| /mount | - | ✓ Install Sigil |
| /setup | - | ✓ First-time setup |
| /update | - | ✓ Pull updates |
| /update-loa | - | ✓ Pull Loa updates |
| /switch-channel | - | ✓ Release channels |
| /mcp-config | - | ✓ MCP configuration |
| /contribute | - | ✓ Upstream PRs |

### Documentation (4)
| Command | Version | Status |
|---------|---------|--------|
| /translate | - | ✓ Tech → exec |
| /translate-ride | - | ✓ Ride → exec |
| /inscribe | - | ✓ Learnings → rules |
| /feedback | - | ✓ Submit feedback |

### Run Mode (7)
| Command | Version | Status |
|---------|---------|--------|
| /run | - | ✓ Autonomous impl |
| /run-sprint-plan | - | ✓ Auto planning |
| /run-status | - | ✓ Check progress |
| /run-halt | - | ✓ Safety brake |
| /run-resume | - | ✓ Resume halted |
| /snapshot | - | ✓ Capture state |
| /test-flow | - | ✓ Test without commit |

### Utilities (8+)
| Command | Version | Status |
|---------|---------|--------|
| /ledger | - | ✓ Sprint ledger |
| /permission-audit | - | ✓ HITL analysis |
| /oracle | - | ✓ Anthropic Oracle |
| /oracle-analyze | - | ✓ Oracle analysis |
| /archive-cycle | - | ✓ Archive cycle |
| /retrospective | - | ✓ Retro analysis |
| /skill-audit | - | ✓ Audit skills |
| /ward-all | - | ✓ Batch physics audit |

### Previously Missing (Now Present)
| Command | Previous Status | Current |
|---------|-----------------|---------|
| /codify | NOT FOUND | Deprecated (use /craft) |
| /craft | NOT FOUND | ✓ Present (v2.0.0) |
| /approve | NOT FOUND | Deprecated |

## Rules (NEW Section)

### Core Rules
| Rule | File | Tokens |
|------|------|--------|
| Priority & Actions | 00-sigil-core.md | ~2k |
| Behavioral Physics | 01-sigil-physics.md | ~1k |
| Effect Detection | 02-sigil-detection.md | ~1k |
| Golden Patterns | 03-sigil-patterns.md | ~2k |
| Protected Capabilities | 04-sigil-protected.md | ~500 |

### Physics Layers
| Rule | File | Focus |
|------|------|-------|
| Animation | 05-sigil-animation.md | Easing, springs |
| Taste | 06-sigil-taste.md | Signal accumulation |
| Material | 07-sigil-material.md | Surfaces, grit |

### Reference
| Rule | File | Focus |
|------|------|-------|
| Lexicon | 08-sigil-lexicon.md | Keywords, domains |
| RLM Summary | rlm-core-summary.md | Decision tree (~1k) |

### React Implementation
| Rule | File | Priority |
|------|------|----------|
| Core | 10-react-core.md | Framework |
| Async | 11-react-async.md | CRITICAL |
| Bundle | 12-react-bundle.md | CRITICAL |
| Rendering | 13-react-rendering.md | MEDIUM |
| Re-renders | 14-react-rerender.md | MEDIUM |
| Server | 15-react-server.md | HIGH |
| JavaScript | 16-react-js.md | LOW-MEDIUM |

### Specialized
| Rule | File | Focus |
|------|------|-------|
| Semantic Search | 17-semantic-search.md | `ck` tool |
| Complexity | 18-sigil-complexity.md | Detection |
| Data Physics | 19-sigil-data-physics.md | Sources |
| Web3 Flows | 20-sigil-web3-flows.md | Transactions |

## Skills Inventory

### Physics Skills (7)
| Skill | Command | Status |
|-------|---------|--------|
| crafting-physics | /craft | ✓ |
| animating-motion | /animate | ✓ |
| styling-material | /style | ✓ |
| applying-behavior | /behavior | ✓ |
| validating-physics | /ward | ✓ |
| surveying-patterns | /garden | ✓ |
| continuous-learning | (auto) | ✓ |

### Generation Skills (6)
| Skill | Command | Status |
|-------|---------|--------|
| implementing-tasks | /implement | ✓ |
| planning-sprints | /sprint-plan | ✓ |
| discovering-requirements | /plan-and-analyze | ✓ |
| designing-architecture | /architect | ✓ |
| distilling-components | /distill | ✓ |
| riding-codebase | /ride | ✓ |

### Analysis Skills (4)
| Skill | Command | Status |
|-------|---------|--------|
| observing-users | /observe | ✓ |
| auditing-security | /audit* | ✓ |
| reviewing-code | /review-sprint | ✓ |
| web3-testing | (specialized) | ✓ |

### Framework Skills (4)
| Skill | Command | Status |
|-------|---------|--------|
| mounting-sigil | /mount | ✓ |
| mounting-framework | (Loa) | ✓ |
| updating-sigil | /update | ✓ |
| updating-framework | /update-loa | ✓ |

### Specialized Skills (4+)
| Skill | Command | Status |
|-------|---------|--------|
| translating-for-executives | /translate* | ✓ |
| inscribing-taste | /inscribe | ✓ |
| deploying-infrastructure | /deploy-production | ✓ |
| blockchain-inspector | (diagnose) | ✓ |

## Subagents (NEW)

| Subagent | File | Purpose |
|----------|------|---------|
| Architecture Validator | architecture-validator.md | Design coherence |
| Documentation Coherence | documentation-coherence.md | Doc consistency |
| Security Scanner | security-scanner.md | OWASP Top 10 |
| Test Adequacy Reviewer | test-adequacy-reviewer.md | Coverage validation |

## Protocols (NEW)

### Categories
| Category | Count | Examples |
|----------|-------|----------|
| Core | 5 | run-mode, session-continuity |
| Safety | 7 | git-safety, preflight-integrity |
| Execution | 6 | beads-integration, subagent-invocation |
| Context | 4 | jit-retrieval, context-compaction |
| Integration | 4 | integrations, browser-automation |
| Advanced | 4 | grounding-enforcement, citations |
| Utility | 3 | search-fallback, recommended-hooks |

## Key Physics Model

### Effect → Physics Table
| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Soft Delete | Optimistic | 200ms | Toast+Undo |
| Standard | Optimistic | 200ms | None |
| Local | Immediate | 100ms | None |
| High-freq | Immediate | 0ms | None |

### Protected Capabilities (Non-Negotiable)
1. **Withdraw** - Always reachable
2. **Cancel** - Always visible
3. **Balance** - Always accurate
4. **Error Recovery** - Always available
5. **Touch Target** - ≥44px
6. **Focus Ring** - Always visible

### Taste Accumulation
| Signal | Weight | Trigger |
|--------|--------|---------|
| ACCEPT | +1 | Used as-is |
| MODIFY | +5 | User edited |
| REJECT | -3 | User refused |

## Governance

| File | Status |
|------|--------|
| CHANGELOG.md | ✓ Comprehensive |
| CONTRIBUTING.md | ✓ Present |
| SECURITY.md | ✓ Present |
| LICENSE.md | ✓ AGPL-3.0 |
| CODEOWNERS | ✗ Missing |

## Version Tags

Present: v1.3.0, v2.0.0-v2.5.0, v5.0.0, v11.0.0-v11.1.0

**Current**: v2.5.0 "Web3 Flow Validation"

## Tech Stack

- **Runtime**: Claude Code CLI
- **Format**: Markdown + YAML
- **Dependencies**: None (standard shell)
- **Optional**: jq, yq, agent-browser

## Integration Points

| System | Status |
|--------|--------|
| Loa Framework | ✓ Construct |
| Claude Code | ✓ Commands, skills |
| Git | ✓ Version control |
| MCP | ✓ Registry |
| Beads | ✓ Task management |
