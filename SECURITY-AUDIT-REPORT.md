# Sigil v4.1 "Living Guardrails" Security Audit Report

**Audit Date**: 2026-01-07
**Auditor**: Paranoid Cypherpunk Auditor (Claude Opus 4.5)
**Version Audited**: Sigil v4.1.0 "Living Guardrails"
**Previous Audit**: v1.2.4 (2026-01-05)
**Audit Scope**: Runtime code, ESLint plugin, configuration files, process layer, scripts

---

## 1. Executive Summary

### Overall Risk Level: LOW

Sigil v4.1 demonstrates **solid security practices** overall. The codebase follows defensive programming patterns, implements proper input validation, uses safe configuration loading, and maintains clear boundaries between agent-only and runtime code.

**Key Findings:**
- **0 Critical Issues** - No hardcoded secrets, command injection, or XSS vulnerabilities found
- **1 High Priority Issue** - Potential ReDoS in ESLint rule regex patterns
- **3 Medium Priority Issues** - Minor improvements recommended
- **7 Positive Findings** - Notable security-conscious design decisions

The framework is **APPROVED for production use** with minor recommendations addressed below.

---

## 2. Critical Issues

### None Found

The audit did not identify any critical security vulnerabilities including:

| Check | Status | Notes |
|-------|--------|-------|
| Hardcoded secrets/API keys | PASS | No secrets found in codebase |
| Command injection | PASS | Shell scripts use proper quoting and `set -euo pipefail` |
| XSS vectors | PASS | No dangerouslySetInnerHTML, no raw HTML injection |
| Path traversal | PASS | All file operations use proper path resolution |
| Prototype pollution | PASS | Object spreads are safe, no unsafe merging |

---

## 3. High Priority Issues

### H1: Potential ReDoS in ESLint Regex Patterns

**Location**: `/packages/eslint-plugin-sigil/src/rules/enforce-tokens.ts`

**Issue**: The regex patterns for detecting arbitrary Tailwind values could potentially be exploited with crafted input to cause excessive backtracking:

```typescript
// Lines 32-38
const ARBITRARY_VALUE_PATTERN = /\[[\d.]+(?:px|rem|em|%|vh|vw|ch|ex|fr)?\]|\[#[a-fA-F0-9]+\]/g;
const TAILWIND_ARBITRARY_PATTERN = /[\w-]+-\[[\d.]+(?:px|rem|em|%|vh|vw|ch|ex|fr)?\]|[\w-]+-\[#[a-fA-F0-9]+\]/g;
```

**Risk**: LOW-MEDIUM (ESLint rules run at dev time, not production)

**Recommendation**:
1. Add length limits before regex matching
2. Consider using atomic groups or possessive quantifiers if regex engine supports them
3. This is mitigated by the fact that ESLint runs at development time, not in production

---

## 4. Medium Priority Issues

### M1: Console Warnings May Leak Internal Paths

**Locations**:
- `/sigil-mark/providers/remote-soul.ts:643`
- `/sigil-mark/process/physics-reader.ts:431-435`
- `/packages/eslint-plugin-sigil/src/config-loader.ts:189-193`

**Issue**: Error messages include file paths which could expose internal directory structure:

```typescript
console.warn(`[Sigil Physics] File not found: ${filePath}, using defaults`);
```

**Risk**: LOW (informational disclosure)

**Recommendation**: In production builds, consider:
1. Using generic error messages
2. Conditionalizing verbose logging on `process.env.NODE_ENV !== 'production'`

---

### M2: Missing Timeout on Remote Config Subscriptions

**Location**: `/sigil-mark/providers/remote-soul.ts`

**Issue**: While the initial fetch has a proper 100ms timeout (NFR-3 compliant), the subscription callbacks don't have timeout protection. A slow or malicious remote config provider could potentially block the main thread during updates.

**Risk**: LOW (DoS potential in edge cases)

**Recommendation**: Consider wrapping subscription callbacks with timeout protection:
```typescript
const unsubscribe = adapter.subscribe((newVibes) => {
  const timeoutId = setTimeout(() => {
    console.warn('[Sigil] Subscription callback timed out');
  }, 100);

  try {
    // ... process vibes
  } finally {
    clearTimeout(timeoutId);
  }
});
```

---

### M3: Timing Modifier Bounds Could Be Tighter

**Location**: `/sigil-mark/providers/remote-soul.ts:455-468`

**Issue**: The timing modifier allows values from 0.5 to 2.0, meaning animations could be halved or doubled. While not a security issue, extreme values could impact UX.

**Current Implementation**:
```typescript
const MIN = 0.5;
const MAX = 2.0;
```

**Risk**: LOW (UX impact only)

**Recommendation**: Consider tighter bounds (0.8-1.5) or add monitoring for extreme values:
```typescript
if (value < 0.8 || value > 1.5) {
  console.warn(`[Sigil] Unusual timing_modifier: ${value}`);
}
```

---

## 5. Low Priority Issues

### L1: Global Cache Without TTL in Config Loader

**Location**: `/packages/eslint-plugin-sigil/src/config-loader.ts:122-124`

**Issue**: The config cache uses `mtime` for invalidation but has no TTL. In long-running processes (like ESLint with `--cache`), stale configs could persist.

**Recommendation**: Consider adding a TTL check in addition to mtime:
```typescript
const CACHE_TTL = 60000; // 1 minute
let configCacheTime: number | null = null;

if (Date.now() - (configCacheTime ?? 0) > CACHE_TTL) {
  clearConfigCache();
}
```

---

### L2: Synchronous Requires in Reader Functions

**Locations**:
- `/sigil-mark/process/physics-reader.ts:461`
- `/sigil-mark/process/vocabulary-reader.ts:310`
- `/sigil-mark/process/constitution-reader.ts:258`

**Issue**: Sync reader functions use `require('fs')` dynamically, which works but could be more explicit:

```typescript
// Current
const fsSync = require('fs');

// Better
import * as fsSync from 'fs';
// Then use readFileSync directly
```

**Risk**: MINIMAL (works correctly, just a code quality issue)

---

## 6. Positive Findings

The audit identified several security-conscious design decisions:

### P1: Proper Separation of Kernel and Vibe Configuration

**Location**: `/sigil-mark/remote-soul.yaml`

The framework correctly separates engineering-controlled "kernel" values from marketing-controlled "vibe" values. Critical settings like physics timing and sync strategies are explicitly locked:

```yaml
kernel_locked:
  - physics
  - sync
  - protected_zones
  - zones.critical
```

**Impact**: Prevents marketing from accidentally breaking critical UX through A/B tests.

---

### P2: Agent-Only Process Layer with Runtime Protection

**Location**: `/sigil-mark/process/index.ts`

The process layer correctly:
1. Documents that it's agent-only with clear warnings
2. Uses Node.js `fs` (which would crash in browsers, providing fail-fast behavior)
3. Provides `SigilProvider` as the correct runtime alternative

```typescript
// AGENT-ONLY: Do not import in browser code
// This module uses Node.js fs and will crash in browser environments.
```

---

### P3: Shell Scripts Use Safe Practices

**Locations**:
- `/scripts/check-process-imports.sh`
- `/scripts/verify-version.sh`

Both scripts:
1. Use `set -euo pipefail` (exit on error, unset variables, pipe failures)
2. Quote all variables properly
3. Use arrays for exclude patterns instead of string concatenation
4. Handle edge cases gracefully

---

### P4: YAML Parsing with Graceful Degradation

**All Reader Files**

The readers implement defensive parsing:
1. Never throw exceptions - always return valid defaults
2. Log warnings for invalid configurations
3. Skip invalid entries rather than failing entirely
4. Use the `yaml` library (not `js-yaml` which has known issues)

---

### P5: Input Validation in Physics Resolver

**Location**: `/sigil-mark/hooks/physics-resolver.ts`

Motion and sync strategy names are validated against allowlists:
```typescript
const VALID_MOTION_NAMES: MotionName[] = [
  'instant', 'snappy', 'warm', 'deliberate', 'reassuring', 'celebratory', 'reduced'
];

function isValidMotionName(name: string): name is MotionName {
  return VALID_MOTION_NAMES.includes(name as MotionName);
}
```

---

### P6: Proper React Context Cleanup

**Location**: `/sigil-mark/layouts/*.tsx`

All layout components properly cleanup zone context on unmount:
```typescript
useEffect(() => {
  sigilZone.setZone('critical');
  return () => {
    sigilZone.setZone(null); // Cleanup
  };
}, [sigilZone]);
```

---

### P7: No Eval or Dynamic Code Execution

The entire codebase was checked and contains:
- No `eval()`
- No `new Function()`
- No `innerHTML` or `dangerouslySetInnerHTML`
- No dynamic script injection

---

## 7. Recommendations

### Immediate (Before Next Release)

1. **Add input length validation before regex matching in ESLint rules** (addresses H1)
   - Limit className string length before applying regex

### Short-term (Within 1-2 Sprints)

2. **Conditionalize verbose logging** (addresses M1)
   - Wrap detailed error messages in `NODE_ENV !== 'production'` checks

3. **Add subscription timeout protection** (addresses M2)
   - Wrap remote config subscription callbacks with timeout

### Long-term (Backlog)

4. **Consider tighter timing modifier bounds** (addresses M3)
5. **Add TTL to config cache** (addresses L1)
6. **Refactor sync requires to static imports** (addresses L2)

---

## 8. Full Security Checklist

### Critical (Must Pass)
| Item | Status | Notes |
|------|--------|-------|
| No hardcoded secrets/API keys | PASS | Checked all files |
| No command injection vulnerabilities | PASS | Shell scripts use safe practices |
| No XSS vectors | PASS | No raw HTML injection |
| No path traversal vulnerabilities | PASS | Proper path resolution used |
| Proper input validation | PASS | Allowlists and validation throughout |

### High Priority
| Item | Status | Notes |
|------|--------|-------|
| Network requests have timeouts | PASS | 100ms timeout per NFR-3 |
| Error handling doesn't leak sensitive info | WARN | File paths exposed in logs (M1) |
| State properly cleaned up | PASS | useEffect cleanup in all layouts |
| No memory leaks in hooks/contexts | PASS | Proper ref cleanup |
| YAML parsing is safe | PASS | Uses yaml library with validation |

### Medium Priority
| Item | Status | Notes |
|------|--------|-------|
| Process layer truly agent-only | PASS | Uses Node.js fs (crashes in browser) |
| Deprecation warnings are helpful | PASS | Clear migration path provided |
| CSS variable generation is safe | PASS | No user input in CSS values |
| Remote config has fallbacks | PASS | DEFAULT_VIBES fallback always available |

---

## 9. Threat Model Summary

### Assets Protected
1. **User financial data** - Protected by critical zone enforcement
2. **Application state** - Protected by proper sync strategies
3. **UX consistency** - Protected by kernel-locked configurations
4. **Accessibility** - Protected by reduced motion settings

### Attack Vectors Considered
| Vector | Status | Mitigation |
|--------|--------|------------|
| Malicious remote config | MITIGATED | Kernel values locked, timing modifier clamped |
| Process layer in browser | MITIGATED | Crashes fast with Node.js fs |
| ReDoS in ESLint | LOW RISK | Dev-time only, recommendation provided |
| Config file tampering | MITIGATED | Validation and graceful degradation |

### Trust Boundaries
1. **Engineering (kernel)** -> Immutable at runtime
2. **Marketing (vibes)** -> Constrained by validation
3. **Remote config** -> Timeout + fallback protection
4. **User input** -> Never reaches CSS/HTML generation directly

---

## 10. Files Audited

### Runtime Code
- `sigil-mark/providers/sigil-provider.tsx`
- `sigil-mark/providers/remote-soul.ts`
- `sigil-mark/hooks/use-sigil-mutation.ts`
- `sigil-mark/hooks/physics-resolver.ts`
- `sigil-mark/core/use-critical-action.ts`
- `sigil-mark/layouts/critical-zone.tsx`
- `sigil-mark/layouts/glass-layout.tsx`
- `sigil-mark/layouts/machinery-layout.tsx`

### ESLint Plugin
- `packages/eslint-plugin-sigil/src/config-loader.ts`
- `packages/eslint-plugin-sigil/src/zone-resolver.ts`
- `packages/eslint-plugin-sigil/src/rules/enforce-tokens.ts`
- `packages/eslint-plugin-sigil/src/rules/zone-compliance.ts`
- `packages/eslint-plugin-sigil/src/rules/input-physics.ts`

### Configuration Files
- `.sigilrc.yaml`
- `sigil-mark/remote-soul.yaml`
- `sigil-mark/kernel/physics.yaml`
- `sigil-mark/vocabulary/vocabulary.yaml`

### Process Layer
- `sigil-mark/process/index.ts`
- `sigil-mark/process/physics-reader.ts`
- `sigil-mark/process/vocabulary-reader.ts`
- `sigil-mark/process/constitution-reader.ts`

### Scripts
- `scripts/check-process-imports.sh`
- `scripts/verify-version.sh`

---

## 11. Delta from Previous Audit (v1.2.4)

| Aspect | v1.2.4 | v4.1.0 |
|--------|--------|--------|
| Overall Risk Level | LOW | LOW |
| Critical Issues | 0 | 0 |
| High Issues | 0 | 1 (new ReDoS pattern) |
| Medium Issues | 4 | 3 |
| Low Issues | 5 | 2 |
| Positive Findings | 10 | 7 |

**New in v4.1:**
- SigilProvider with full RemoteSoul integration
- ESLint plugin (3 rules)
- Process layer separation (agent-only)
- Shell scripts for validation

**Improvements since v1.2.4:**
- Better separation of kernel/vibe configuration
- Explicit agent-only boundaries
- Proper timeout handling for remote config
- Comprehensive deprecation warnings

---

## 12. Conclusion

Sigil v4.1 "Living Guardrails" demonstrates mature security practices appropriate for a design system framework. The clear separation between kernel and vibe configurations, the proper isolation of agent-only code, and the defensive programming throughout the codebase provide a solid security foundation.

**Approval Status**: APPROVED

**Conditions**:
1. Address H1 (ReDoS potential) before next release
2. Consider M1-M3 recommendations for future sprints

---

## Audit Sign-Off

| Role | Status | Date |
|------|--------|------|
| Paranoid Cypherpunk Auditor | APPROVED | 2026-01-07 |
| Recommended Fixes | 1 HIGH, 3 MEDIUM, 2 LOW | - |
| Production Deployment | APPROVED with conditions | - |

---

*Audit completed by Paranoid Cypherpunk Auditor (Claude Opus 4.5)*
*Audit methodology: Static code analysis, pattern matching, threat modeling*
*"Trust nothing. Verify everything. Ship with confidence."*
