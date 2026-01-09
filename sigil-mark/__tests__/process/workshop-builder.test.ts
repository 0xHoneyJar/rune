/**
 * @sigil-tier gold
 * Workshop Builder Tests
 *
 * Tests for the pre-computed workshop index builder.
 * Target: 5ms query performance, hash-based staleness detection.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  getFileHash,
  getPackageHash,
  getImportsHash,
  checkWorkshopStaleness,
  isWorkshopStale,
  readImportsList,
  extractExportsFromDts,
  extractSignaturesFromDts,
  extractMaterial,
  parseJSDocPragmas,
  extractImportsFromFile,
  extractComponent,
  scanSanctuary,
  parseSigilConfig,
  buildWorkshop,
  loadWorkshop,
  queryMaterial,
  queryComponent,
  queryPhysics,
  queryZone,
} from '../../process/workshop-builder';
import {
  Workshop,
  EMPTY_WORKSHOP,
} from '../../types/workshop';

// =============================================================================
// TEST FIXTURES
// =============================================================================

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'workshop');

// Create test fixtures before running tests
function createTestFixtures() {
  const fixturesPath = FIXTURES_DIR;

  // Create directories
  fs.mkdirSync(path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist'), { recursive: true });
  fs.mkdirSync(path.join(fixturesPath, 'src', 'sanctuary', 'gold'), { recursive: true });
  fs.mkdirSync(path.join(fixturesPath, '.sigil'), { recursive: true });

  // Create package.json
  fs.writeFileSync(
    path.join(fixturesPath, 'package.json'),
    JSON.stringify({ name: 'test-project', version: '1.0.0', dependencies: { 'test-pkg': '^1.0.0' } })
  );

  // Create imports.yaml
  fs.writeFileSync(
    path.join(fixturesPath, '.sigil', 'imports.yaml'),
    '- test-pkg\n- framer-motion\n'
  );

  // Create test package
  fs.writeFileSync(
    path.join(fixturesPath, 'node_modules', 'test-pkg', 'package.json'),
    JSON.stringify({ name: 'test-pkg', version: '2.0.0', types: './dist/index.d.ts' })
  );

  fs.writeFileSync(
    path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts'),
    `export function motion(props: MotionProps): JSX.Element;
export const AnimatePresence: React.FC<AnimatePresenceProps>;
export type MotionProps = { animate?: object };
export interface SpringConfig { stiffness: number; }
export default motion;`
  );

  fs.writeFileSync(
    path.join(fixturesPath, 'node_modules', 'test-pkg', 'README.md'),
    '# Test Package\n\nA test package.'
  );

  // Create sanctuary component
  fs.writeFileSync(
    path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx'),
    `/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-physics deliberate
 * @sigil-vocabulary claim, withdraw
 */

import { motion } from 'test-pkg';
import React from 'react';

export function ClaimButton() {
  return <motion.button>Claim</motion.button>;
}`
  );

  // Create sigil.yaml
  fs.writeFileSync(
    path.join(fixturesPath, 'sigil.yaml'),
    `physics:
  snappy:
    timing: "150ms"
    easing: "ease-out"
    description: "Quick feedback"
  deliberate:
    timing: "800ms"
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
    description: "Weighty actions"

zones:
  critical:
    physics: deliberate
    timing: "800ms"
    description: "Irreversible actions"
  standard:
    physics: snappy
    timing: "150ms"
    description: "Normal interactions"`
  );

  return fixturesPath;
}

// Clean up test fixtures
function cleanupTestFixtures() {
  if (fs.existsSync(FIXTURES_DIR)) {
    fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
  }
}

// =============================================================================
// HASH UTILITY TESTS
// =============================================================================

describe('Hash Utilities', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('getFileHash', () => {
    it('returns MD5 hash of file contents', () => {
      const packageJsonPath = path.join(fixturesPath, 'package.json');
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const expectedHash = crypto.createHash('md5').update(content).digest('hex');

      expect(getFileHash(packageJsonPath)).toBe(expectedHash);
    });

    it('returns empty string for non-existent file', () => {
      expect(getFileHash('/non/existent/file.json')).toBe('');
    });

    it('returns consistent hash for same content', () => {
      const packageJsonPath = path.join(fixturesPath, 'package.json');
      const hash1 = getFileHash(packageJsonPath);
      const hash2 = getFileHash(packageJsonPath);

      expect(hash1).toBe(hash2);
    });
  });

  describe('getPackageHash', () => {
    it('returns hash of package.json', () => {
      const hash = getPackageHash(fixturesPath);
      expect(hash).toHaveLength(32); // MD5 hex length
    });
  });

  describe('getImportsHash', () => {
    it('returns hash of imports.yaml', () => {
      const hash = getImportsHash(fixturesPath);
      expect(hash).toHaveLength(32);
    });
  });
});

// =============================================================================
// STALENESS DETECTION TESTS
// =============================================================================

describe('Staleness Detection', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('checkWorkshopStaleness', () => {
    it('reports stale when workshop.json is missing', () => {
      const result = checkWorkshopStaleness(fixturesPath);

      expect(result.stale).toBe(true);
      expect(result.reason).toBe('missing');
    });

    it('reports stale when workshop.json is corrupted', () => {
      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      fs.writeFileSync(workshopPath, 'not valid json');

      const result = checkWorkshopStaleness(fixturesPath);

      expect(result.stale).toBe(true);
      expect(result.reason).toBe('corrupted');
    });

    it('reports stale when package hash changed', () => {
      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      fs.writeFileSync(
        workshopPath,
        JSON.stringify({
          package_hash: 'old-hash',
          imports_hash: getImportsHash(fixturesPath),
        })
      );

      const result = checkWorkshopStaleness(fixturesPath);

      expect(result.stale).toBe(true);
      expect(result.reason).toBe('package_changed');
    });

    it('reports stale when imports hash changed', () => {
      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      fs.writeFileSync(
        workshopPath,
        JSON.stringify({
          package_hash: getPackageHash(fixturesPath),
          imports_hash: 'old-hash',
        })
      );

      const result = checkWorkshopStaleness(fixturesPath);

      expect(result.stale).toBe(true);
      expect(result.reason).toBe('imports_changed');
    });

    it('reports fresh when hashes match', () => {
      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      fs.writeFileSync(
        workshopPath,
        JSON.stringify({
          package_hash: getPackageHash(fixturesPath),
          imports_hash: getImportsHash(fixturesPath),
        })
      );

      const result = checkWorkshopStaleness(fixturesPath);

      expect(result.stale).toBe(false);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('isWorkshopStale', () => {
    it('returns boolean for convenience', () => {
      const result = isWorkshopStale(fixturesPath);
      expect(typeof result).toBe('boolean');
    });
  });
});

// =============================================================================
// MATERIAL EXTRACTION TESTS
// =============================================================================

describe('Material Extraction', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('readImportsList', () => {
    it('parses YAML list of imports', () => {
      const importsPath = path.join(fixturesPath, '.sigil', 'imports.yaml');
      const imports = readImportsList(importsPath);

      expect(imports).toContain('test-pkg');
      expect(imports).toContain('framer-motion');
    });

    it('returns empty array for missing file', () => {
      expect(readImportsList('/non/existent/imports.yaml')).toEqual([]);
    });
  });

  describe('extractExportsFromDts', () => {
    it('extracts named exports', () => {
      const dtsPath = path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts');
      const exports = extractExportsFromDts(dtsPath);

      expect(exports).toContain('motion');
      expect(exports).toContain('AnimatePresence');
    });

    it('extracts type exports', () => {
      const dtsPath = path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts');
      const exports = extractExportsFromDts(dtsPath);

      expect(exports).toContain('MotionProps');
      expect(exports).toContain('SpringConfig');
    });

    it('extracts default export', () => {
      const dtsPath = path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts');
      const exports = extractExportsFromDts(dtsPath);

      expect(exports).toContain('default');
    });
  });

  describe('extractSignaturesFromDts', () => {
    it('extracts function signatures', () => {
      const dtsPath = path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts');
      const signatures = extractSignaturesFromDts(dtsPath);

      expect(signatures).toHaveProperty('motion');
    });

    it('limits number of signatures', () => {
      const dtsPath = path.join(fixturesPath, 'node_modules', 'test-pkg', 'dist', 'index.d.ts');
      const signatures = extractSignaturesFromDts(dtsPath, 2);

      expect(Object.keys(signatures).length).toBeLessThanOrEqual(2);
    });
  });

  describe('extractMaterial', () => {
    it('extracts material entry from package', () => {
      const nodeModulesPath = path.join(fixturesPath, 'node_modules');
      const material = extractMaterial('test-pkg', nodeModulesPath);

      expect(material).not.toBeNull();
      expect(material!.version).toBe('2.0.0');
      expect(material!.types_available).toBe(true);
      expect(material!.readme_available).toBe(true);
      expect(material!.exports).toContain('motion');
    });

    it('returns null for non-existent package', () => {
      const nodeModulesPath = path.join(fixturesPath, 'node_modules');
      const material = extractMaterial('non-existent-pkg', nodeModulesPath);

      expect(material).toBeNull();
    });
  });
});

// =============================================================================
// COMPONENT EXTRACTION TESTS
// =============================================================================

describe('Component Extraction', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('parseJSDocPragmas', () => {
    it('parses @sigil-tier pragma', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const pragmas = parseJSDocPragmas(filePath);

      expect(pragmas.tier).toBe('gold');
    });

    it('parses @sigil-zone pragma', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const pragmas = parseJSDocPragmas(filePath);

      expect(pragmas.zone).toBe('critical');
    });

    it('parses @sigil-physics pragma', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const pragmas = parseJSDocPragmas(filePath);

      expect(pragmas.physics).toBe('deliberate');
    });

    it('parses @sigil-vocabulary pragma', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const pragmas = parseJSDocPragmas(filePath);

      expect(pragmas.vocabulary).toContain('claim');
      expect(pragmas.vocabulary).toContain('withdraw');
    });
  });

  describe('extractImportsFromFile', () => {
    it('extracts package imports', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const imports = extractImportsFromFile(filePath);

      expect(imports).toContain('test-pkg');
      expect(imports).toContain('react');
    });

    it('ignores relative imports', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const imports = extractImportsFromFile(filePath);

      // Should not contain relative paths
      const hasRelative = imports.some(imp => imp.startsWith('./') || imp.startsWith('../'));
      expect(hasRelative).toBe(false);
    });
  });

  describe('extractComponent', () => {
    it('extracts component entry', () => {
      const filePath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx');
      const component = extractComponent(filePath, fixturesPath);

      expect(component).not.toBeNull();
      expect(component!.tier).toBe('gold');
      expect(component!.zone).toBe('critical');
      expect(component!.physics).toBe('deliberate');
      expect(component!.imports).toContain('test-pkg');
    });

    it('returns null for files without @sigil-tier', () => {
      // Create a file without pragmas
      const noTierPath = path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'NoTier.tsx');
      fs.writeFileSync(noTierPath, 'export const NoTier = () => null;');

      const component = extractComponent(noTierPath, fixturesPath);
      expect(component).toBeNull();
    });
  });

  describe('scanSanctuary', () => {
    it('scans sanctuary for components', () => {
      const sanctuaryPath = path.join(fixturesPath, 'src', 'sanctuary');
      const components = scanSanctuary(sanctuaryPath, fixturesPath);

      expect(components).toHaveProperty('ClaimButton');
      expect(components['ClaimButton'].tier).toBe('gold');
    });

    it('returns empty object for non-existent directory', () => {
      const components = scanSanctuary('/non/existent/sanctuary', fixturesPath);
      expect(components).toEqual({});
    });
  });
});

// =============================================================================
// CONFIG PARSING TESTS
// =============================================================================

describe('Config Parsing', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('parseSigilConfig', () => {
    it('parses physics definitions', () => {
      const configPath = path.join(fixturesPath, 'sigil.yaml');
      const { physics } = parseSigilConfig(configPath);

      expect(physics).toHaveProperty('snappy');
      expect(physics['snappy'].timing).toBe('150ms');
      expect(physics['snappy'].easing).toBe('ease-out');
    });

    it('parses zone definitions', () => {
      const configPath = path.join(fixturesPath, 'sigil.yaml');
      const { zones } = parseSigilConfig(configPath);

      expect(zones).toHaveProperty('critical');
      expect(zones['critical'].physics).toBe('deliberate');
    });

    it('returns empty objects for missing file', () => {
      const { physics, zones } = parseSigilConfig('/non/existent/sigil.yaml');

      expect(physics).toEqual({});
      expect(zones).toEqual({});
    });
  });
});

// =============================================================================
// WORKSHOP BUILDER TESTS
// =============================================================================

describe('Workshop Builder', () => {
  let fixturesPath: string;

  beforeAll(() => {
    fixturesPath = createTestFixtures();
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('buildWorkshop', () => {
    it('builds workshop index', async () => {
      const result = await buildWorkshop({
        projectRoot: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.materialCount).toBeGreaterThan(0);
      expect(result.componentCount).toBeGreaterThan(0);
    });

    it('creates workshop.json file', async () => {
      await buildWorkshop({
        projectRoot: fixturesPath,
      });

      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      expect(fs.existsSync(workshopPath)).toBe(true);
    });

    it('stores correct hashes', async () => {
      await buildWorkshop({
        projectRoot: fixturesPath,
      });

      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      const workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8')) as Workshop;

      expect(workshop.package_hash).toBe(getPackageHash(fixturesPath));
      expect(workshop.imports_hash).toBe(getImportsHash(fixturesPath));
    });

    it('records build duration', async () => {
      const result = await buildWorkshop({
        projectRoot: fixturesPath,
      });

      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('loadWorkshop', () => {
    it('loads workshop from file', async () => {
      await buildWorkshop({
        projectRoot: fixturesPath,
      });

      const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
      const workshop = loadWorkshop(workshopPath);

      expect(workshop.package_hash).toBeTruthy();
      expect(workshop.materials).toBeDefined();
      expect(workshop.components).toBeDefined();
    });

    it('returns empty workshop for missing file', () => {
      const workshop = loadWorkshop('/non/existent/workshop.json');
      expect(workshop).toEqual(EMPTY_WORKSHOP);
    });
  });
});

// =============================================================================
// QUERY TESTS
// =============================================================================

describe('Workshop Queries', () => {
  let workshop: Workshop;

  beforeAll(async () => {
    const fixturesPath = createTestFixtures();
    await buildWorkshop({
      projectRoot: fixturesPath,
    });

    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = loadWorkshop(workshopPath);
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('queryMaterial', () => {
    it('returns material entry', () => {
      const material = queryMaterial(workshop, 'test-pkg');
      expect(material).not.toBeNull();
      expect(material!.version).toBe('2.0.0');
    });

    it('returns null for unknown material', () => {
      const material = queryMaterial(workshop, 'unknown-pkg');
      expect(material).toBeNull();
    });
  });

  describe('queryComponent', () => {
    it('returns component entry', () => {
      const component = queryComponent(workshop, 'ClaimButton');
      expect(component).not.toBeNull();
      expect(component!.tier).toBe('gold');
    });

    it('returns null for unknown component', () => {
      const component = queryComponent(workshop, 'UnknownButton');
      expect(component).toBeNull();
    });
  });

  describe('queryPhysics', () => {
    it('returns physics definition', () => {
      const physics = queryPhysics(workshop, 'snappy');
      expect(physics).not.toBeNull();
      expect(physics!.timing).toBe('150ms');
    });

    it('returns null for unknown physics', () => {
      const physics = queryPhysics(workshop, 'unknown');
      expect(physics).toBeNull();
    });
  });

  describe('queryZone', () => {
    it('returns zone definition', () => {
      const zone = queryZone(workshop, 'critical');
      expect(zone).not.toBeNull();
      expect(zone!.physics).toBe('deliberate');
    });

    it('returns null for unknown zone', () => {
      const zone = queryZone(workshop, 'unknown');
      expect(zone).toBeNull();
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  let workshop: Workshop;
  let fixturesPath: string;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({
      projectRoot: fixturesPath,
    });

    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = loadWorkshop(workshopPath);
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  it('queries complete in <5ms', () => {
    const iterations = 100;
    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
      queryMaterial(workshop, 'test-pkg');
      queryComponent(workshop, 'ClaimButton');
      queryPhysics(workshop, 'snappy');
      queryZone(workshop, 'critical');
    }

    const elapsed = Date.now() - start;
    const avgPerQuery = elapsed / (iterations * 4);

    expect(avgPerQuery).toBeLessThan(5);
  });

  it('build completes in <2s', async () => {
    const result = await buildWorkshop({
      projectRoot: fixturesPath,
    });

    expect(result.durationMs).toBeLessThan(2000);
  });
});
