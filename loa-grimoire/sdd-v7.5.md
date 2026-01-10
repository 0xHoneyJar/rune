# Software Design Document: Sigil v7.5 "The Reference Studio"

> *"Control the patterns, not the files."*

**Version:** 1.0
**Date:** 2026-01-09
**Status:** SDD Draft
**PRD Reference:** `loa-grimoire/prd-v7.5.md`

---

## 1. Executive Summary

This SDD details the technical architecture for upgrading Sigil from v6.1 "Agile Muse" to v7.5 "The Reference Studio". The core architectural shift is from **survival-based tracking** to **registry-based authority** with **contagion enforcement**.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Registry location | `src/gold/index.ts` | TypeScript native, standard pattern |
| ESLint plugin | Local in repo | Always in sync, no publish overhead |
| Sentinel approach | Hook-based (PreToolUse) | Uses existing v6.1 pattern |
| Survival.json | Historical tracking only | Registries become source of truth |

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLAUDE.MD                                │
│                   (Agent Instructions)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SIGIL CORE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Registries │  │   Sentinel  │  │      Gardener           │ │
│  │ gold/silver │  │  (PreTool)  │  │  (Nomination/Demotion)  │ │
│  │   /draft    │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ENFORCEMENT LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              eslint-plugin-sigil                         │   │
│  │  • gold-imports-only                                     │   │
│  │  • no-gold-imports-draft                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE LAYER                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ principles/│  │  workshop  │  │  survival  │               │
│  │  (expert   │  │   .json    │  │   .json    │               │
│  │ knowledge) │  │  (index)   │  │ (history)  │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USER PROJECT                                │
│                                                                       │
│  src/                                                                 │
│  ├── components/          # ALL components (stable paths)             │
│  │   ├── Button.tsx                                                  │
│  │   ├── CriticalButton.tsx                                          │
│  │   └── ExperimentalNav.tsx                                         │
│  ├── gold/                                                            │
│  │   └── index.ts         # Gold registry (THE CANON)                │
│  ├── silver/                                                          │
│  │   └── index.ts         # Silver registry                          │
│  ├── draft/                                                           │
│  │   └── index.ts         # Draft registry                           │
│  └── features/            # Feature code (can import any)            │
│                                                                       │
│  .sigil/                                                              │
│  ├── taste-profile.yaml   # Physics, zones, vocabulary               │
│  ├── workshop.json        # Pre-computed index                       │
│  └── survival.json        # Historical pattern tracking              │
│                                                                       │
│  sigil-mark/                                                          │
│  ├── principles/          # Expert knowledge (agent consumes)        │
│  ├── moodboard/           # Visual references                        │
│  └── rules.md             # Design rules                             │
│                                                                       │
│  eslint-plugin-sigil/     # Contagion enforcement                    │
│  └── ...                                                              │
│                                                                       │
│  CLAUDE.md                # Agent instructions                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
User Intent
    │
    ▼
┌─────────────────┐
│   CLAUDE.MD     │  ← Agent reads instructions
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Read Registry  │  ← FIRST action: read src/gold/index.ts
│  (src/gold/)    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Match Intent   │  ← vocabulary → zone → physics → component
│  to Archetype   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   PreToolUse    │  ← Sentinel validates before write
│    (Sentinel)   │
└─────────────────┘
    │
    ├── PASS ───────────────┐
    │                       ▼
    │               ┌─────────────────┐
    │               │  Generate Code  │
    │               └─────────────────┘
    │                       │
    │                       ▼
    │               ┌─────────────────┐
    │               │  PostToolUse    │  ← Update survival.json
    │               │  (Observer)     │
    │               └─────────────────┘
    │
    └── FAIL ───────────────┐
                            ▼
                    ┌─────────────────┐
                    │  Block + Fix    │  ← Contagion violation
                    │  Suggestion     │
                    └─────────────────┘
```

---

## 3. Component Design

### 3.1 Registry System

#### 3.1.1 Gold Registry (`src/gold/index.ts`)

```typescript
/**
 * Sigil Gold Registry
 *
 * THE CANON. Components exported here are "Gold" status.
 * Agent reads this file FIRST on any UI task.
 *
 * Promotion: Add export line (1 line change)
 * Demotion: Remove export line (1 line change)
 * Components NEVER move from src/components/
 */

// =============================================================================
// BUTTONS
// =============================================================================

/**
 * CriticalButton — For irreversible financial actions
 * @sigil-zone critical
 * @sigil-physics server-tick (600ms)
 */
export { CriticalButton } from '../components/CriticalButton';

/**
 * Button — Standard interactive button
 * @sigil-zone casual/important
 * @sigil-physics snappy (150ms)
 */
export { Button } from '../components/Button';

// =============================================================================
// LAYOUT
// =============================================================================

/**
 * Card — Standard content container
 * @sigil-zone casual
 * @sigil-physics smooth (300ms)
 */
export { Card } from '../components/Card';

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { CriticalButtonProps } from '../components/CriticalButton';
export type { ButtonProps } from '../components/Button';
export type { CardProps } from '../components/Card';
```

#### 3.1.2 Silver Registry (`src/silver/index.ts`)

```typescript
/**
 * Sigil Silver Registry
 *
 * Proven components, not yet canonical.
 * Can import from Gold and Silver.
 * Cannot import from Draft.
 */

export { Tooltip } from '../components/Tooltip';
export { Badge } from '../components/Badge';

export type { TooltipProps } from '../components/Tooltip';
export type { BadgeProps } from '../components/Badge';
```

#### 3.1.3 Draft Registry (`src/draft/index.ts`)

```typescript
/**
 * Sigil Draft Registry
 *
 * Experimental components. Quarantined.
 * Can import from anything.
 * Gold/Silver CANNOT import from Draft.
 *
 * @draft — These components are experimental
 */

export { ExperimentalNav } from '../components/ExperimentalNav';

export type { ExperimentalNavProps } from '../components/ExperimentalNav';
```

#### 3.1.4 Registry Parser

```typescript
// sigil-mark/process/registry-parser.ts

export interface RegistryEntry {
  name: string;
  path: string;
  zone?: string;
  physics?: string;
  docComment?: string;
}

export interface RegistryState {
  gold: RegistryEntry[];
  silver: RegistryEntry[];
  draft: RegistryEntry[];
  lastParsed: string;
}

/**
 * Parse a registry file and extract exported components
 */
export function parseRegistry(content: string): RegistryEntry[] {
  const entries: RegistryEntry[] = [];

  // Match: export { ComponentName } from '../components/ComponentName';
  const exportRegex = /\/\*\*[\s\S]*?@sigil-zone\s+(\w+)[\s\S]*?@sigil-physics\s+(\w+)[\s\S]*?\*\/\s*export\s*{\s*(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    entries.push({
      name: match[3],
      path: match[4],
      zone: match[1],
      physics: match[2],
    });
  }

  // Fallback: simple exports without JSDoc
  const simpleExportRegex = /export\s*{\s*(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/g;
  while ((match = simpleExportRegex.exec(content)) !== null) {
    if (!entries.find(e => e.name === match[1])) {
      entries.push({
        name: match[1],
        path: match[2],
      });
    }
  }

  return entries;
}

/**
 * Load all registries
 */
export async function loadRegistries(projectRoot: string): Promise<RegistryState> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const goldPath = path.join(projectRoot, 'src/gold/index.ts');
  const silverPath = path.join(projectRoot, 'src/silver/index.ts');
  const draftPath = path.join(projectRoot, 'src/draft/index.ts');

  const [goldContent, silverContent, draftContent] = await Promise.all([
    fs.readFile(goldPath, 'utf-8').catch(() => ''),
    fs.readFile(silverPath, 'utf-8').catch(() => ''),
    fs.readFile(draftPath, 'utf-8').catch(() => ''),
  ]);

  return {
    gold: parseRegistry(goldContent),
    silver: parseRegistry(silverContent),
    draft: parseRegistry(draftContent),
    lastParsed: new Date().toISOString(),
  };
}
```

### 3.2 Sentinel (PreToolUse Hook)

#### 3.2.1 Sentinel Validator

```typescript
// sigil-mark/process/sentinel-validator.ts

import { loadRegistries, RegistryState } from './registry-parser';
import { loadTasteProfile, TasteProfile } from './taste-profile';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  valid: boolean;
  severity: ValidationSeverity;
  rule: string;
  message: string;
  suggestion?: string;
}

export interface SentinelContext {
  registries: RegistryState;
  tasteProfile: TasteProfile;
  currentFile: string;
}

/**
 * Validate code before write
 */
export async function validatePreWrite(
  code: string,
  filePath: string,
  context: SentinelContext
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // Determine file's registry status
  const fileStatus = getFileStatus(filePath, context.registries);

  // Check contagion rules
  const contagionResults = validateContagion(code, fileStatus, context.registries);
  results.push(...contagionResults);

  // Check physics compliance
  const physicsResults = validatePhysics(code, context.tasteProfile);
  results.push(...physicsResults);

  // Check Gold archetype usage (in /craft mode)
  const archetypeResults = validateArchetype(code, context.registries);
  results.push(...archetypeResults);

  return results;
}

/**
 * Determine if file is Gold, Silver, Draft, or Feature
 */
function getFileStatus(
  filePath: string,
  registries: RegistryState
): 'gold' | 'silver' | 'draft' | 'feature' {
  // Check if file is exported from any registry
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const entry of registries.gold) {
    if (normalizedPath.includes(entry.path.replace('../', ''))) {
      return 'gold';
    }
  }

  for (const entry of registries.silver) {
    if (normalizedPath.includes(entry.path.replace('../', ''))) {
      return 'silver';
    }
  }

  for (const entry of registries.draft) {
    if (normalizedPath.includes(entry.path.replace('../', ''))) {
      return 'draft';
    }
  }

  return 'feature';
}

/**
 * Validate contagion rules
 */
function validateContagion(
  code: string,
  fileStatus: 'gold' | 'silver' | 'draft' | 'feature',
  registries: RegistryState
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Extract imports
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1];

    // Gold cannot import Silver or Draft
    if (fileStatus === 'gold') {
      if (importPath.includes('/silver') || importPath.includes('@/silver')) {
        results.push({
          valid: false,
          severity: 'error',
          rule: 'gold-imports-only',
          message: 'Gold components cannot import from Silver',
          suggestion: 'Import from @/gold instead, or demote this component',
        });
      }

      if (importPath.includes('/draft') || importPath.includes('@/draft')) {
        results.push({
          valid: false,
          severity: 'error',
          rule: 'no-gold-imports-draft',
          message: 'Gold components cannot import from Draft',
          suggestion: 'Draft is quarantined. Promote the Draft component first.',
        });
      }
    }

    // Silver cannot import Draft
    if (fileStatus === 'silver') {
      if (importPath.includes('/draft') || importPath.includes('@/draft')) {
        results.push({
          valid: false,
          severity: 'error',
          rule: 'no-silver-imports-draft',
          message: 'Silver components cannot import from Draft',
          suggestion: 'Draft is quarantined. Promote the Draft component first.',
        });
      }
    }
  }

  return results;
}

/**
 * Validate physics compliance
 */
function validatePhysics(
  code: string,
  tasteProfile: TasteProfile
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check for duration values
  const durationRegex = /duration[:\s]+(\d+)/g;
  let match;

  while ((match = durationRegex.exec(code)) !== null) {
    const duration = parseInt(match[1]);

    // Check if duration matches any physics profile
    const validPhysics = Object.values(tasteProfile.physics).find(
      p => Math.abs(p.duration - duration) <= (tasteProfile.constraints?.physics?.[0]?.tolerance || 50)
    );

    if (!validPhysics) {
      results.push({
        valid: true, // Warning, not error
        severity: 'warning',
        rule: 'physics-timing',
        message: `Duration ${duration}ms doesn't match any physics profile`,
        suggestion: `Valid durations: ${Object.entries(tasteProfile.physics).map(([k, v]) => `${k}: ${v.duration}ms`).join(', ')}`,
      });
    }
  }

  return results;
}

/**
 * Validate Gold archetype usage
 */
function validateArchetype(
  code: string,
  registries: RegistryState
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check if code uses raw HTML elements when Gold alternatives exist
  const goldComponents = registries.gold.map(e => e.name);

  // Check for raw <button> when CriticalButton exists
  if (goldComponents.includes('CriticalButton') && /<button\s/i.test(code)) {
    // Check if it's importing from Gold
    if (!code.includes("from '@/gold'") && !code.includes("from '../gold'")) {
      results.push({
        valid: true, // Warning in /forge, error in /craft
        severity: 'warning',
        rule: 'prefer-gold-archetype',
        message: 'Raw <button> used when CriticalButton is available in Gold',
        suggestion: "import { CriticalButton } from '@/gold'",
      });
    }
  }

  return results;
}
```

#### 3.2.2 PreToolUse Hook Integration

```yaml
# .claude/hooks/pre-tool-use.yaml

name: sigil-sentinel
description: Validate code against Sigil registries before write
triggers:
  - tool: Write
  - tool: Edit

script: |
  #!/bin/bash
  # Load registries and validate
  node -e "
    const { validatePreWrite, loadRegistries, loadTasteProfile } = require('./sigil-mark/process/sentinel-validator');

    async function validate() {
      const registries = await loadRegistries(process.cwd());
      const tasteProfile = await loadTasteProfile(process.cwd());

      const code = process.env.TOOL_CONTENT || '';
      const filePath = process.env.TOOL_PATH || '';

      const results = await validatePreWrite(code, filePath, { registries, tasteProfile, currentFile: filePath });

      const errors = results.filter(r => r.severity === 'error');
      if (errors.length > 0) {
        console.error(JSON.stringify({ blocked: true, errors }));
        process.exit(1);
      }

      const warnings = results.filter(r => r.severity === 'warning');
      if (warnings.length > 0) {
        console.log(JSON.stringify({ warnings }));
      }
    }

    validate().catch(console.error);
  "
```

### 3.3 ESLint Plugin

#### 3.3.1 Plugin Structure

```
eslint-plugin-sigil/
├── index.js              # Plugin entry point
├── package.json
└── rules/
    ├── gold-imports-only.js
    └── no-gold-imports-draft.js
```

#### 3.3.2 Package.json

```json
{
  "name": "eslint-plugin-sigil",
  "version": "7.5.0",
  "description": "ESLint rules for Sigil contagion model",
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=8.0.0"
  },
  "keywords": ["eslint", "eslintplugin", "sigil", "design-system"]
}
```

#### 3.3.3 Plugin Index

```javascript
// eslint-plugin-sigil/index.js

module.exports = {
  rules: {
    'gold-imports-only': require('./rules/gold-imports-only'),
    'no-gold-imports-draft': require('./rules/no-gold-imports-draft'),
  },
  configs: {
    recommended: {
      plugins: ['sigil'],
      rules: {
        'sigil/gold-imports-only': 'error',
        'sigil/no-gold-imports-draft': 'error',
      },
    },
  },
};
```

#### 3.3.4 Gold Imports Only Rule

```javascript
// eslint-plugin-sigil/rules/gold-imports-only.js

const fs = require('fs');
const path = require('path');

/**
 * Cache for Gold exports
 */
let goldExportsCache = null;
let goldExportsCacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Get Gold exports from registry
 */
function getGoldExports(projectRoot) {
  const now = Date.now();
  if (goldExportsCache && now - goldExportsCacheTime < CACHE_TTL) {
    return goldExportsCache;
  }

  try {
    const goldIndexPath = path.join(projectRoot, 'src/gold/index.ts');
    if (!fs.existsSync(goldIndexPath)) {
      return new Set();
    }

    const content = fs.readFileSync(goldIndexPath, 'utf-8');
    const exports = new Set();

    const exportRegex = /export\s*{\s*(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.add(match[2]); // Add the path
    }

    goldExportsCache = exports;
    goldExportsCacheTime = now;
    return exports;
  } catch (e) {
    return new Set();
  }
}

/**
 * Check if file is a Gold component
 */
function isGoldFile(filename, projectRoot) {
  const normalized = filename.replace(/\\/g, '/');

  // Files in src/gold/ directory
  if (normalized.includes('/src/gold/')) {
    return true;
  }

  // Files exported from Gold registry
  const goldExports = getGoldExports(projectRoot);
  for (const exportPath of goldExports) {
    const resolvedPath = exportPath.replace('../', '/src/');
    if (normalized.includes(resolvedPath)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Gold components can only import from Gold registry',
      category: 'Sigil Contagion',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      goldCannotImportSilver:
        'Gold components cannot import from Silver. Import from @/gold instead.',
      goldCannotImportDraft:
        'Gold components cannot import from Draft. Draft is quarantined.',
    },
  },

  create(context) {
    const filename = context.getFilename();
    const projectRoot = context.getCwd();

    if (!isGoldFile(filename, projectRoot)) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (importPath.includes('/silver') || importPath.includes('@/silver')) {
          context.report({
            node,
            messageId: 'goldCannotImportSilver',
          });
        }

        if (importPath.includes('/draft') || importPath.includes('@/draft')) {
          context.report({
            node,
            messageId: 'goldCannotImportDraft',
          });
        }
      },
    };
  },
};
```

### 3.4 Gardener (Nomination/Demotion)

#### 3.4.1 Nomination Generator

```typescript
// sigil-mark/process/nomination-generator.ts

import { loadRegistries, RegistryEntry } from './registry-parser';

export interface NominationEvidence {
  uses: number;
  files: string[];
  judgeScore: number;
  consistency: number;
  mutinies: number;
}

export interface Nomination {
  component: string;
  currentStatus: 'draft' | 'silver';
  proposedStatus: 'silver' | 'gold';
  evidence: NominationEvidence;
  registryChange: string;
}

/**
 * Identify components ready for nomination
 */
export async function identifyNominations(
  survival: SurvivalData,
  registries: RegistryState
): Promise<Nomination[]> {
  const nominations: Nomination[] = [];

  for (const [pattern, data] of Object.entries(survival.patterns)) {
    // Check nomination criteria
    if (
      data.occurrences >= 5 &&
      data.judgeScore >= 95 &&
      (data.mutinies || 0) === 0
    ) {
      // Determine current and proposed status
      const componentName = extractComponentName(pattern);
      const currentStatus = getComponentStatus(componentName, registries);

      if (currentStatus === 'draft') {
        nominations.push({
          component: componentName,
          currentStatus: 'draft',
          proposedStatus: 'silver',
          evidence: {
            uses: data.occurrences,
            files: data.files,
            judgeScore: data.judgeScore,
            consistency: data.consistency || 100,
            mutinies: data.mutinies || 0,
          },
          registryChange: generateRegistryChange(componentName, 'silver'),
        });
      } else if (currentStatus === 'silver') {
        nominations.push({
          component: componentName,
          currentStatus: 'silver',
          proposedStatus: 'gold',
          evidence: {
            uses: data.occurrences,
            files: data.files,
            judgeScore: data.judgeScore,
            consistency: data.consistency || 100,
            mutinies: data.mutinies || 0,
          },
          registryChange: generateRegistryChange(componentName, 'gold'),
        });
      }
    }
  }

  return nominations;
}

/**
 * Generate PR body for nomination
 */
export function generateNominationPRBody(nominations: Nomination[]): string {
  return `## Sigil Nomination

The following components have achieved nomination criteria:

${nominations.map(n => `
### ${n.component}

**Current Status:** ${n.currentStatus}
**Proposed Status:** ${n.proposedStatus}

**Evidence:**
- Uses: ${n.evidence.uses}
- Judge Score: ${n.evidence.judgeScore}%
- Consistency: ${n.evidence.consistency}%
- Mutinies: ${n.evidence.mutinies}

**Files:**
${n.evidence.files.map(f => `- \`${f}\``).join('\n')}

**Registry Change:**
\`\`\`typescript
${n.registryChange}
\`\`\`
`).join('\n---\n')}

---

**Human action required:** Merge to promote, Close to reject.

*Generated by Sigil Gardener*
`;
}

function generateRegistryChange(component: string, status: 'silver' | 'gold'): string {
  return `// Add to src/${status}/index.ts:
export { ${component} } from '../components/${component}';`;
}
```

#### 3.4.2 Auto-Demotion Detector

```typescript
// sigil-mark/process/demotion-detector.ts

import { loadRegistries } from './registry-parser';

export interface DemotionCandidate {
  component: string;
  currentStatus: 'gold' | 'silver';
  reason: string;
  modifiedBy: string;
  modifiedAt: string;
}

/**
 * Detect Gold components modified without sanctify label
 */
export async function detectDemotions(
  prFiles: { path: string; status: string }[],
  prLabels: string[]
): Promise<DemotionCandidate[]> {
  // If sanctify label present, no demotions
  if (prLabels.includes('sanctify')) {
    return [];
  }

  const registries = await loadRegistries(process.cwd());
  const demotions: DemotionCandidate[] = [];

  for (const file of prFiles) {
    if (file.status !== 'modified') continue;

    // Check if file is a Gold component
    const isGold = registries.gold.some(e =>
      file.path.includes(e.path.replace('../', ''))
    );

    if (isGold) {
      demotions.push({
        component: extractComponentName(file.path),
        currentStatus: 'gold',
        reason: 'Modified without sanctify label',
        modifiedBy: process.env.PR_AUTHOR || 'unknown',
        modifiedAt: new Date().toISOString(),
      });
    }
  }

  return demotions;
}
```

---

## 4. Data Architecture

### 4.1 Taste Profile Schema

```yaml
# .sigil/taste-profile.yaml

version: "1.0"

physics:
  server-tick:
    duration: 600
    easing: ease-out
    description: "For irreversible financial actions"

  deliberate:
    duration: 800
    easing: cubic-bezier(0.4, 0, 0.2, 1)
    description: "For significant state changes"

  snappy:
    duration: 150
    easing: ease-out
    description: "For instant feedback"

  smooth:
    duration: 300
    easing: cubic-bezier(0.4, 0, 0.2, 1)
    description: "For content transitions"

zones:
  critical:
    description: "Money movement, irreversible actions"
    physics: [server-tick, deliberate]
    requires_gold: true

  important:
    description: "Significant but reversible actions"
    physics: [deliberate, smooth]
    requires_gold: false

  casual:
    description: "Navigation, information display"
    physics: [snappy, smooth]
    requires_gold: false

vocabulary:
  claim: { zone: critical, physics: server-tick, component_hint: CriticalButton }
  deposit: { zone: critical, physics: server-tick, component_hint: CriticalButton }
  withdraw: { zone: critical, physics: server-tick, component_hint: CriticalButton }
  save: { zone: important, physics: deliberate, component_hint: Button }
  navigate: { zone: casual, physics: snappy, component_hint: Link }

constraints:
  structural:
    - rule: gold-imports-only
    - rule: no-gold-imports-draft
  physics:
    - rule: physics-timing
      tolerance: 50
  taste:
    - rule: color-system
    - rule: spacing-scale

governance:
  nomination:
    min_uses: 5
    min_judge_score: 95
    max_mutinies: 0
    auto_promote: false
  demotion:
    trigger: modification_without_sanctify
    auto_demote: true
```

### 4.2 Survival Schema (Historical)

```typescript
// .sigil/survival.json

interface SurvivalData {
  version: string;
  era: string;
  lastScan: string;
  patterns: Record<string, PatternData>;
}

interface PatternData {
  status: 'experimental' | 'surviving' | 'canonical-candidate' | 'canonical';
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  files: string[];
  judgeScore: number;
  consistency: number;
  mutinies: number;
}
```

### 4.3 Workshop Schema (Existing)

```typescript
// .sigil/workshop.json

interface WorkshopData {
  indexed_at: string;
  package_hash: string;
  imports_hash: string;
  materials: Record<string, MaterialData>;
  components: Record<string, ComponentData>;
  physics: Record<string, PhysicsData>;
  zones: Record<string, ZoneData>;
}
```

---

## 5. CLAUDE.md Updates

### 5.1 Core Instructions Addition

```markdown
## The Registry Is The Canon

**CRITICAL**: Before generating any UI code, you MUST read the Gold registry:

```
src/gold/index.ts
```

This file defines what components are "blessed" (canonical).

**Your first action on any UI task**: Read `src/gold/index.ts`

### Authority Hierarchy

1. **Gold** (`src/gold/index.ts`): Canonical. Copy exactly.
2. **Silver** (`src/silver/index.ts`): Proven. Use when Gold doesn't cover.
3. **Draft** (`src/draft/index.ts`): Experimental. Quarantined.

### Contagion Rules

```
Gold can import: Gold only
Silver can import: Gold, Silver
Draft can import: anything
```

**NEVER** generate code where Gold imports from Draft.

### Nomination (Never Auto-Promote)

When you identify a pattern that should be Gold:
1. Collect evidence: Uses, consistency, files
2. Propose nomination: Suggest adding to registry
3. Wait for human approval: Never modify registry yourself

### Performance Defaults

For batch operations (images, files):
- Use GNU `parallel` by default
- Operations >30s: run in background
- Heavy image work: mention `vips` as alternative
```

---

## 6. File Structure (Complete)

```
project/
├── src/
│   ├── components/              # ALL components (stable paths)
│   │   ├── Button.tsx
│   │   ├── CriticalButton.tsx
│   │   ├── Card.tsx
│   │   └── ExperimentalNav.tsx
│   ├── gold/
│   │   └── index.ts            # Gold registry
│   ├── silver/
│   │   └── index.ts            # Silver registry
│   ├── draft/
│   │   └── index.ts            # Draft registry
│   └── features/               # Feature code
│
├── .sigil/
│   ├── taste-profile.yaml      # Physics, zones, vocabulary
│   ├── workshop.json           # Pre-computed index
│   ├── survival.json           # Historical tracking
│   └── feedback-notes.md       # Observations
│
├── sigil-mark/
│   ├── process/                # Agent-time utilities
│   │   ├── registry-parser.ts
│   │   ├── sentinel-validator.ts
│   │   ├── nomination-generator.ts
│   │   └── demotion-detector.ts
│   ├── principles/             # Expert knowledge
│   │   ├── motion-implementation.md
│   │   ├── image-tooling.md
│   │   ├── color-oklch.md
│   │   └── svg-patterns.md
│   ├── moodboard/              # Visual references
│   ├── context/                # Drop-in research
│   └── rules.md                # Design rules
│
├── eslint-plugin-sigil/
│   ├── index.js
│   ├── package.json
│   └── rules/
│       ├── gold-imports-only.js
│       └── no-gold-imports-draft.js
│
├── .claude/
│   └── hooks/
│       └── pre-tool-use.yaml   # Sentinel hook
│
├── CLAUDE.md                   # Agent instructions
└── .eslintrc.js               # ESLint config with Sigil plugin
```

---

## 7. Migration Plan

### 7.1 Phase 1: Registry Setup

1. Create registry directories:
   ```bash
   mkdir -p src/gold src/silver src/draft
   ```

2. Create registry files with existing components:
   ```typescript
   // src/gold/index.ts
   // Move existing canonical components here
   ```

3. Update path aliases in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/gold": ["./src/gold"],
         "@/silver": ["./src/silver"],
         "@/draft": ["./src/draft"]
       }
     }
   }
   ```

### 7.2 Phase 2: ESLint Plugin

1. Copy `eslint-plugin-sigil/` to project
2. Install as local dependency:
   ```bash
   npm install ./eslint-plugin-sigil
   ```
3. Update `.eslintrc.js`:
   ```javascript
   module.exports = {
     plugins: ['sigil'],
     rules: {
       'sigil/gold-imports-only': 'error',
       'sigil/no-gold-imports-draft': 'error',
     },
   };
   ```

### 7.3 Phase 3: Hooks

1. Add Sentinel hook to `.claude/hooks/`
2. Test validation flow
3. Configure severity levels

### 7.4 Phase 4: CLAUDE.md

1. Update CLAUDE.md with registry-first instructions
2. Add contagion rules
3. Add nomination protocol
4. Add performance defaults

---

## 8. Testing Strategy

### 8.1 Registry Tests

```typescript
describe('Registry Parser', () => {
  it('parses Gold registry exports', async () => {
    const registries = await loadRegistries('./test-fixtures');
    expect(registries.gold).toContainEqual({
      name: 'CriticalButton',
      path: '../components/CriticalButton',
    });
  });
});
```

### 8.2 Contagion Tests

```typescript
describe('Contagion Rules', () => {
  it('blocks Gold importing Draft', async () => {
    const code = `import { ExperimentalNav } from '@/draft';`;
    const results = await validatePreWrite(code, 'src/components/CriticalButton.tsx', context);
    expect(results).toContainEqual(expect.objectContaining({
      rule: 'no-gold-imports-draft',
      severity: 'error',
    }));
  });
});
```

### 8.3 ESLint Tests

```javascript
const { RuleTester } = require('eslint');
const rule = require('./rules/gold-imports-only');

const tester = new RuleTester();

tester.run('gold-imports-only', rule, {
  valid: [
    { code: `import { Button } from '@/gold';`, filename: 'src/gold/index.ts' },
  ],
  invalid: [
    {
      code: `import { Draft } from '@/draft';`,
      filename: 'src/gold/index.ts',
      errors: [{ messageId: 'goldCannotImportDraft' }],
    },
  ],
});
```

---

## 9. Success Criteria

| Criteria | Measurement | Target |
|----------|-------------|--------|
| Registry adoption | Projects using registry pattern | 100% |
| Contagion enforcement | ESLint errors in Gold | 0 |
| Promotion friction | Files changed per promotion | 1 |
| Sentinel latency | PreToolUse validation time | <50ms |
| Nomination flow | PRs generated per nomination | 1 |

---

## 10. Appendix: Type Definitions

See `loa-grimoire/context/sigil-v7.5-reference/sigil-v7.5-reference/types/sigil.d.ts` for complete type definitions.

---

*SDD generated with Loa /architect*
*Based on PRD: loa-grimoire/prd-v7.5.md*
*Date: 2026-01-09*
