/**
 * @sigil-tier gold
 * Sigil v7.5 — Nomination Generator
 *
 * Identifies patterns meeting promotion criteria and generates nomination PRs.
 * Criteria: 5+ uses, 95%+ consistency score, 0 mutinies.
 *
 * IMPORTANT: This generates nominations but NEVER auto-promotes.
 * Human approval is required for all registry changes.
 *
 * @module process/nomination-generator
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  AllRegistriesState,
  RegistryTier,
  getRegistries,
  getTier,
  getComponentsInTier,
} from './registry-parser';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Pattern usage statistics.
 */
export interface PatternUsage {
  /** Pattern/component name */
  name: string;
  /** Current tier */
  tier: RegistryTier | null;
  /** Number of uses across codebase */
  uses: number;
  /** Files where pattern is used */
  files: string[];
  /** Consistency score (0-100) */
  consistencyScore: number;
  /** Number of mutinies (deviations/violations) */
  mutinies: number;
  /** First seen date */
  firstSeen: string;
  /** Last seen date */
  lastSeen: string;
}

/**
 * Nomination criteria configuration.
 */
export interface NominationCriteria {
  /** Minimum uses required */
  minUses: number;
  /** Minimum consistency score (0-100) */
  minConsistencyScore: number;
  /** Maximum mutinies allowed */
  maxMutinies: number;
}

/**
 * Default nomination criteria.
 */
export const DEFAULT_NOMINATION_CRITERIA: NominationCriteria = {
  minUses: 5,
  minConsistencyScore: 95,
  maxMutinies: 0,
};

/**
 * Nomination candidate.
 */
export interface NominationCandidate {
  /** Component name */
  name: string;
  /** Current tier */
  currentTier: RegistryTier | null;
  /** Proposed tier */
  proposedTier: RegistryTier;
  /** Usage statistics */
  usage: PatternUsage;
  /** Evidence for nomination */
  evidence: NominationEvidence;
  /** Generated at timestamp */
  generatedAt: string;
}

/**
 * Evidence supporting a nomination.
 */
export interface NominationEvidence {
  /** Total uses */
  uses: number;
  /** Unique files */
  uniqueFiles: number;
  /** Consistency score */
  consistencyScore: number;
  /** Mutiny count */
  mutinies: number;
  /** Sample file paths */
  sampleFiles: string[];
  /** Time in current tier */
  daysInTier: number;
}

/**
 * Generated nomination PR.
 */
export interface NominationPR {
  /** PR title */
  title: string;
  /** PR body (markdown) */
  body: string;
  /** Branch name suggestion */
  branchName: string;
  /** Files to modify */
  filesToModify: string[];
  /** Candidate details */
  candidate: NominationCandidate;
}

// =============================================================================
// USAGE ANALYSIS
// =============================================================================

/**
 * Load survival.json if available.
 */
export function loadSurvivalData(projectRoot: string): Record<string, PatternUsage> | null {
  const survivalPath = path.join(projectRoot, '.sigil', 'survival.json');

  if (!fs.existsSync(survivalPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(survivalPath, 'utf-8');
    const data = JSON.parse(content);

    // Convert survival patterns to PatternUsage format
    const usages: Record<string, PatternUsage> = {};

    if (data.patterns) {
      for (const [name, pattern] of Object.entries(data.patterns as Record<string, any>)) {
        usages[name] = {
          name,
          tier: null, // Will be resolved separately
          uses: pattern.occurrences || 0,
          files: pattern.files || [],
          consistencyScore: pattern.consistencyScore || 100,
          mutinies: pattern.mutinies || 0,
          firstSeen: pattern.first_seen || new Date().toISOString(),
          lastSeen: pattern.last_seen || new Date().toISOString(),
        };
      }
    }

    return usages;
  } catch {
    return null;
  }
}

/**
 * Analyze component usage from survival data.
 */
export function analyzeUsage(
  componentName: string,
  survivalData: Record<string, PatternUsage> | null,
  registries: AllRegistriesState
): PatternUsage {
  // Check survival data first
  if (survivalData && survivalData[componentName]) {
    const usage = survivalData[componentName];
    usage.tier = getTier(registries, componentName);
    return usage;
  }

  // Default usage for unknown component
  return {
    name: componentName,
    tier: getTier(registries, componentName),
    uses: 0,
    files: [],
    consistencyScore: 100,
    mutinies: 0,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  };
}

// =============================================================================
// NOMINATION IDENTIFICATION
// =============================================================================

/**
 * Check if a pattern meets nomination criteria for promotion.
 */
export function meetsNominationCriteria(
  usage: PatternUsage,
  criteria: NominationCriteria = DEFAULT_NOMINATION_CRITERIA
): boolean {
  return (
    usage.uses >= criteria.minUses &&
    usage.consistencyScore >= criteria.minConsistencyScore &&
    usage.mutinies <= criteria.maxMutinies
  );
}

/**
 * Determine proposed tier for promotion.
 */
export function getProposedTier(currentTier: RegistryTier | null): RegistryTier {
  switch (currentTier) {
    case null:
    case 'draft':
      return 'silver';
    case 'silver':
      return 'gold';
    case 'gold':
      return 'gold'; // Already at top
  }
}

/**
 * Find all nomination candidates in a tier.
 */
export function findNominationCandidates(
  projectRoot: string,
  fromTier: RegistryTier | null,
  criteria: NominationCriteria = DEFAULT_NOMINATION_CRITERIA
): NominationCandidate[] {
  const candidates: NominationCandidate[] = [];
  const registries = getRegistries(projectRoot);
  const survivalData = loadSurvivalData(projectRoot);

  // Get components to analyze
  let componentNames: string[];
  if (fromTier) {
    componentNames = getComponentsInTier(registries, fromTier);
  } else {
    // Analyze all known patterns from survival data
    componentNames = survivalData ? Object.keys(survivalData) : [];
  }

  for (const name of componentNames) {
    const usage = analyzeUsage(name, survivalData, registries);

    if (meetsNominationCriteria(usage, criteria)) {
      const proposedTier = getProposedTier(usage.tier);

      // Skip if already at proposed tier
      if (usage.tier === proposedTier) {
        continue;
      }

      // Calculate days in tier
      const firstSeen = new Date(usage.firstSeen);
      const now = new Date();
      const daysInTier = Math.floor((now.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));

      candidates.push({
        name,
        currentTier: usage.tier,
        proposedTier,
        usage,
        evidence: {
          uses: usage.uses,
          uniqueFiles: usage.files.length,
          consistencyScore: usage.consistencyScore,
          mutinies: usage.mutinies,
          sampleFiles: usage.files.slice(0, 5),
          daysInTier,
        },
        generatedAt: new Date().toISOString(),
      });
    }
  }

  return candidates;
}

// =============================================================================
// PR GENERATION
// =============================================================================

/**
 * Generate PR title for nomination.
 */
export function generatePRTitle(candidate: NominationCandidate): string {
  const tierLabel = candidate.proposedTier.charAt(0).toUpperCase() + candidate.proposedTier.slice(1);
  return `[Sigil] Nominate \`${candidate.name}\` for ${tierLabel} registry`;
}

/**
 * Generate PR body markdown.
 */
export function generatePRBody(candidate: NominationCandidate): string {
  const { evidence, currentTier, proposedTier, name } = candidate;

  const currentTierLabel = currentTier
    ? currentTier.charAt(0).toUpperCase() + currentTier.slice(1)
    : 'Unregistered';
  const proposedTierLabel = proposedTier.charAt(0).toUpperCase() + proposedTier.slice(1);

  return `## Nomination: ${name}

**Current Tier:** ${currentTierLabel}
**Proposed Tier:** ${proposedTierLabel}

---

## Evidence

| Metric | Value | Threshold |
|--------|-------|-----------|
| Uses | ${evidence.uses} | ≥5 |
| Unique Files | ${evidence.uniqueFiles} | - |
| Consistency Score | ${evidence.consistencyScore}% | ≥95% |
| Mutinies | ${evidence.mutinies} | 0 |
| Days in Current Tier | ${evidence.daysInTier} | - |

---

## Sample Usage

${evidence.sampleFiles.map(f => `- \`${f}\``).join('\n')}

---

## Registry Change

\`\`\`typescript
// Add to src/${proposedTier}/index.ts:
export { ${name} } from '../components/${name}';
\`\`\`

${currentTier ? `\`\`\`typescript
// Remove from src/${currentTier}/index.ts:
// export { ${name} } from '../components/${name}';
\`\`\`` : ''}

---

## Checklist

- [ ] Component has been reviewed for quality
- [ ] Component follows ${proposedTierLabel} tier standards
- [ ] No breaking changes to existing consumers
- [ ] Documentation is up to date

---

**⚠️ IMPORTANT:** This is a nomination, not an auto-promotion.
Human review and approval is required before merging.

---

*Generated by Sigil v7.5 Nomination Generator*
*Generated at: ${candidate.generatedAt}*
`;
}

/**
 * Generate branch name for nomination.
 */
export function generateBranchName(candidate: NominationCandidate): string {
  const tierLabel = candidate.proposedTier;
  const sanitizedName = candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `sigil/nominate-${sanitizedName}-to-${tierLabel}`;
}

/**
 * Generate full nomination PR.
 */
export function generateNominationPR(candidate: NominationCandidate): NominationPR {
  const filesToModify = [
    `src/${candidate.proposedTier}/index.ts`,
  ];

  if (candidate.currentTier) {
    filesToModify.push(`src/${candidate.currentTier}/index.ts`);
  }

  return {
    title: generatePRTitle(candidate),
    body: generatePRBody(candidate),
    branchName: generateBranchName(candidate),
    filesToModify,
    candidate,
  };
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Generate all nomination PRs for a project.
 */
export function generateAllNominations(
  projectRoot: string,
  criteria: NominationCriteria = DEFAULT_NOMINATION_CRITERIA
): NominationPR[] {
  const prs: NominationPR[] = [];

  // Find candidates in Draft tier
  const draftCandidates = findNominationCandidates(projectRoot, 'draft', criteria);
  for (const candidate of draftCandidates) {
    prs.push(generateNominationPR(candidate));
  }

  // Find candidates in Silver tier
  const silverCandidates = findNominationCandidates(projectRoot, 'silver', criteria);
  for (const candidate of silverCandidates) {
    prs.push(generateNominationPR(candidate));
  }

  // Find unregistered patterns
  const unregisteredCandidates = findNominationCandidates(projectRoot, null, criteria);
  for (const candidate of unregisteredCandidates) {
    prs.push(generateNominationPR(candidate));
  }

  return prs;
}

/**
 * Get nomination summary for a project.
 */
export function getNominationSummary(projectRoot: string): {
  draftToSilver: number;
  silverToGold: number;
  unregisteredToSilver: number;
  total: number;
} {
  const nominations = generateAllNominations(projectRoot);

  return {
    draftToSilver: nominations.filter(
      n => n.candidate.currentTier === 'draft' && n.candidate.proposedTier === 'silver'
    ).length,
    silverToGold: nominations.filter(
      n => n.candidate.currentTier === 'silver' && n.candidate.proposedTier === 'gold'
    ).length,
    unregisteredToSilver: nominations.filter(
      n => n.candidate.currentTier === null && n.candidate.proposedTier === 'silver'
    ).length,
    total: nominations.length,
  };
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

/**
 * CLI entry point for nomination generation.
 */
export function nominateCLI(projectRoot: string = process.cwd()): void {
  const nominations = generateAllNominations(projectRoot);

  if (nominations.length === 0) {
    console.log('No nomination candidates found.');
    return;
  }

  console.log(`Found ${nominations.length} nomination candidate(s):\n`);

  for (const pr of nominations) {
    console.log(`## ${pr.candidate.name}`);
    console.log(`   ${pr.candidate.currentTier || 'unregistered'} → ${pr.candidate.proposedTier}`);
    console.log(`   Uses: ${pr.candidate.evidence.uses}, Score: ${pr.candidate.evidence.consistencyScore}%`);
    console.log(`   Branch: ${pr.branchName}`);
    console.log('');
  }
}
