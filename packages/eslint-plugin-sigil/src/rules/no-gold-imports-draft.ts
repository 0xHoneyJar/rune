/**
 * sigil/no-gold-imports-draft
 *
 * Ensures Gold components never import Draft code.
 * This is the core contagion rule — Draft is quarantined.
 *
 * Draft code CAN exist and CAN be merged to main.
 * But Gold code CANNOT depend on Draft code.
 *
 * The quarantine model:
 * - Draft is experimental/deadline code
 * - Draft can use anything
 * - Nothing canonical (Gold) can use Draft
 * - This prevents experimental code from infecting stable patterns
 *
 * Part of Sigil v7.5 "The Reference Studio" - contagion enforcement.
 *
 * @version 7.5.0
 */

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import * as path from "path";
import * as fs from "fs";

export type NoGoldImportsDraftOptions = [
  {
    /** Custom Gold registry path (default: src/gold/index.ts) */
    goldRegistryPath?: string;
  }?
];

export type NoGoldImportsDraftMessageIds = "goldCannotImportDraft";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/sigil/eslint-plugin-sigil/blob/main/docs/rules/${name}.md`
);

// Cache for Gold exports
let goldExportsCache: Set<string> | null = null;
let goldExportsCacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Check if an import is from Draft registry
 */
function isDraftImport(importPath: string): boolean {
  return (
    importPath === "@/draft" ||
    importPath.startsWith("@/draft/") ||
    importPath.includes("/draft/") ||
    importPath.startsWith("draft/")
  );
}

/**
 * Get the list of Gold-exported components by parsing the registry
 */
function getGoldExports(projectRoot: string, customPath?: string): Set<string> {
  const now = Date.now();

  // Return cached result if fresh
  if (goldExportsCache && now - goldExportsCacheTime < CACHE_TTL) {
    return goldExportsCache;
  }

  const exports = new Set<string>();

  try {
    const possiblePaths = customPath
      ? [path.join(projectRoot, customPath)]
      : [
          path.join(projectRoot, "src/gold/index.ts"),
          path.join(projectRoot, "src/gold/index.js"),
          path.join(projectRoot, "src/gold/index.tsx"),
        ];

    for (const goldIndexPath of possiblePaths) {
      if (fs.existsSync(goldIndexPath)) {
        const content = fs.readFileSync(goldIndexPath, "utf-8");

        // Parse export statements
        const exportRegex = /export\s*\{[^}]+\}\s*from\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = exportRegex.exec(content)) !== null) {
          exports.add(match[1]);
        }

        // Also parse: export * from '../components/Button';
        const reExportRegex = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
        while ((match = reExportRegex.exec(content)) !== null) {
          exports.add(match[1]);
        }

        break;
      }
    }
  } catch {
    // Silently fail
  }

  goldExportsCache = exports;
  goldExportsCacheTime = now;

  return exports;
}

/**
 * Find project root by looking for package.json
 */
function findProjectRoot(startPath: string): string {
  let currentPath = startPath;

  while (currentPath !== path.dirname(currentPath)) {
    if (fs.existsSync(path.join(currentPath, "package.json"))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }

  return startPath;
}

/**
 * Check if a file is in the Gold registry or is a Gold-exported component
 */
function isGoldFile(
  filename: string,
  projectRoot: string,
  customRegistryPath?: string
): boolean {
  const normalized = filename.replace(/\\/g, "/");

  // Files in src/gold/ directory
  if (normalized.includes("/src/gold/")) {
    return true;
  }

  // Check if this file is exported from Gold registry
  const goldExports = getGoldExports(projectRoot, customRegistryPath);
  const relativePath = path.relative(projectRoot, filename).replace(/\\/g, "/");

  for (const exportPath of goldExports) {
    const normalizedExport = exportPath
      .replace(/^\.\.\//, "src/")
      .replace(/^\.\//, "src/gold/");
    const withoutExt = normalizedExport.replace(/\.(ts|tsx|js|jsx)$/, "");
    if (relativePath.includes(withoutExt)) {
      return true;
    }
  }

  return false;
}

export const noGoldImportsDraft = createRule<
  NoGoldImportsDraftOptions,
  NoGoldImportsDraftMessageIds
>({
  name: "no-gold-imports-draft",
  meta: {
    type: "problem",
    docs: {
      description: "Gold components cannot import from Draft registry",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          goldRegistryPath: {
            type: "string",
            description: "Custom path to Gold registry file",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      goldCannotImportDraft:
        "Gold components cannot import Draft code. Draft is quarantined. " +
        "Either promote the Draft component to Silver, or remove this import. " +
        'Import: "{{path}}"',
    },
  },
  defaultOptions: [{}],

  create(context, [options = {}]) {
    const filename = context.filename ?? context.getFilename();
    const projectRoot = findProjectRoot(path.dirname(filename));
    const goldRegistryPath = options.goldRegistryPath;

    // Only apply to Gold files
    if (!isGoldFile(filename, projectRoot, goldRegistryPath)) {
      return {};
    }

    function checkImport(node: TSESTree.ImportDeclaration | TSESTree.CallExpression) {
      let importPath: string;

      if (node.type === "ImportDeclaration") {
        importPath = node.source.value;
      } else {
        const arg = node.arguments[0];
        if (!arg || arg.type !== "Literal" || typeof arg.value !== "string") {
          return;
        }
        importPath = arg.value;
      }

      if (isDraftImport(importPath)) {
        context.report({
          node,
          messageId: "goldCannotImportDraft",
          data: { path: importPath },
        });
      }
    }

    return {
      ImportDeclaration: checkImport,

      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type === "Import" ||
          (callee.type === "Identifier" && callee.name === "require")
        ) {
          checkImport(node);
        }
      },
    };
  },
});

export default noGoldImportsDraft;
