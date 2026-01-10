/**
 * sigil/gold-imports-only
 *
 * Ensures Gold components only import from the Gold registry.
 * This maintains the purity of canonical patterns.
 *
 * Gold can import:
 * - @/gold (Gold registry)
 * - node_modules (external packages)
 * - Relative imports within Gold files
 *
 * Gold CANNOT import:
 * - @/silver (Silver registry)
 * - @/draft (Draft registry)
 * - ../components/* directly (must go through registry)
 *
 * Part of Sigil v7.5 "The Reference Studio" - contagion enforcement.
 *
 * @version 7.5.0
 */

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

export type GoldImportsOnlyOptions = [
  {
    /** Additional allowed import patterns (regex strings) */
    allowedPatterns?: string[];
    /** Whether to allow direct component imports (default: false) */
    allowDirectComponentImports?: boolean;
  }?
];

export type GoldImportsOnlyMessageIds =
  | "forbiddenSilverImport"
  | "forbiddenDraftImport"
  | "directComponentImport";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/sigil/eslint-plugin-sigil/blob/main/docs/rules/${name}.md`
);

/**
 * Check if a file is in the Gold registry
 */
function isGoldFile(filename: string): boolean {
  const normalized = filename.replace(/\\/g, "/");
  return normalized.includes("/src/gold/");
}

/**
 * Check if an import is from Silver
 */
function isSilverImport(importPath: string): boolean {
  return (
    importPath === "@/silver" ||
    importPath.startsWith("@/silver/") ||
    importPath.includes("/silver/")
  );
}

/**
 * Check if an import is from Draft
 */
function isDraftImport(importPath: string): boolean {
  return (
    importPath === "@/draft" ||
    importPath.startsWith("@/draft/") ||
    importPath.includes("/draft/")
  );
}

/**
 * Check if import is a direct component import
 */
function isDirectComponentImport(importPath: string): boolean {
  return (
    importPath.includes("/components/") ||
    importPath.includes("../components/")
  );
}

/**
 * Check if import matches any allowed pattern
 */
function matchesAllowedPattern(
  importPath: string,
  allowedPatterns: string[]
): boolean {
  return allowedPatterns.some((pattern) => new RegExp(pattern).test(importPath));
}

export const goldImportsOnly = createRule<GoldImportsOnlyOptions, GoldImportsOnlyMessageIds>({
  name: "gold-imports-only",
  meta: {
    type: "problem",
    docs: {
      description: "Gold components can only import from Gold registry",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          allowedPatterns: {
            type: "array",
            items: { type: "string" },
            description: "Additional allowed import patterns (regex)",
          },
          allowDirectComponentImports: {
            type: "boolean",
            description: "Whether to allow direct component imports",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbiddenSilverImport:
        "Gold components cannot import from Silver. " +
        "Gold can only import from @/gold. " +
        'Import: "{{path}}"',
      forbiddenDraftImport:
        "Gold components cannot import from Draft. " +
        "Gold can only import from @/gold. Draft is quarantined. " +
        'Import: "{{path}}"',
      directComponentImport:
        "Gold components cannot import components directly. " +
        "Use @/gold registry exports instead. " +
        'Import: "{{path}}"',
    },
  },
  defaultOptions: [{}],

  create(context, [options = {}]) {
    const filename = context.filename ?? context.getFilename();
    const allowedPatterns = options.allowedPatterns ?? [];
    const allowDirectComponentImports = options.allowDirectComponentImports ?? false;

    // Only apply to Gold files
    if (!isGoldFile(filename)) {
      return {};
    }

    function checkImport(node: TSESTree.ImportDeclaration | TSESTree.CallExpression) {
      let importPath: string;

      if (node.type === "ImportDeclaration") {
        importPath = node.source.value;
      } else {
        // CallExpression (require or dynamic import)
        const arg = node.arguments[0];
        if (!arg || arg.type !== "Literal" || typeof arg.value !== "string") {
          return;
        }
        importPath = arg.value;
      }

      // Check for allowed patterns first
      if (matchesAllowedPattern(importPath, allowedPatterns)) {
        return;
      }

      // Check for Silver imports
      if (isSilverImport(importPath)) {
        context.report({
          node,
          messageId: "forbiddenSilverImport",
          data: { path: importPath },
        });
        return;
      }

      // Check for Draft imports
      if (isDraftImport(importPath)) {
        context.report({
          node,
          messageId: "forbiddenDraftImport",
          data: { path: importPath },
        });
        return;
      }

      // Check for direct component imports
      if (!allowDirectComponentImports && isDirectComponentImport(importPath)) {
        context.report({
          node,
          messageId: "directComponentImport",
          data: { path: importPath },
        });
      }
    }

    return {
      ImportDeclaration: checkImport,

      CallExpression(node) {
        // Check for require() and dynamic import()
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

export default goldImportsOnly;
