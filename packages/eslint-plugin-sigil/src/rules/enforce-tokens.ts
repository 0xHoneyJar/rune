/**
 * Sigil ESLint Plugin - enforce-tokens Rule
 *
 * Detects arbitrary Tailwind values (magic numbers) in className attributes.
 * Enforces use of design tokens instead of hardcoded values.
 *
 * @module rules/enforce-tokens
 * @version 4.1.0
 *
 * @example
 * // Bad - arbitrary values
 * <div className="gap-[13px]">
 * <div className="text-[#ff0000]">
 * <div className="w-[2rem]">
 *
 * // Good - token values
 * <div className="gap-2">
 * <div className="text-red-500">
 * <div className="w-8">
 */

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://sigil.dev/eslint/${name}`
);

/**
 * Pattern to detect arbitrary Tailwind values
 * Matches: [13px], [2rem], [#ff0000], [100%], etc.
 */
const ARBITRARY_VALUE_PATTERN = /\[[\d.]+(?:px|rem|em|%|vh|vw|ch|ex|fr)?\]|\[#[a-fA-F0-9]+\]/g;

/**
 * Pattern to extract the full Tailwind class with arbitrary value
 * Matches: gap-[13px], text-[#ff0000], w-[2rem], etc.
 */
const TAILWIND_ARBITRARY_PATTERN = /[\w-]+-\[[\d.]+(?:px|rem|em|%|vh|vw|ch|ex|fr)?\]|[\w-]+-\[#[a-fA-F0-9]+\]/g;

type MessageIds = "noMagicNumber";

export interface EnforceTokensOptions {
  /** Additional patterns to allow (regex strings) */
  allowPatterns?: string[];
  /** Whether to check template literals */
  checkTemplateLiterals?: boolean;
}

export const enforceTokens = createRule<[EnforceTokensOptions], MessageIds>({
  name: "enforce-tokens",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow arbitrary Tailwind values in className attributes. Use design tokens instead.",
    },
    messages: {
      noMagicNumber:
        "Use token value instead of arbitrary value: {{value}}. Consider using a design token from your Sigil configuration.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowPatterns: {
            type: "array",
            items: { type: "string" },
          },
          checkTemplateLiterals: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      allowPatterns: [],
      checkTemplateLiterals: true,
    },
  ],
  create(context, [options]) {
    const allowedPatterns = (options.allowPatterns || []).map(
      (p) => new RegExp(p)
    );

    /**
     * Check if a value is allowed by custom patterns
     */
    function isAllowed(value: string): boolean {
      return allowedPatterns.some((pattern) => pattern.test(value));
    }

    /**
     * Check a string value for arbitrary Tailwind values
     */
    function checkStringValue(
      value: string,
      node: TSESTree.Node
    ): void {
      // Reset regex lastIndex
      TAILWIND_ARBITRARY_PATTERN.lastIndex = 0;

      let match;
      while ((match = TAILWIND_ARBITRARY_PATTERN.exec(value)) !== null) {
        const fullMatch = match[0];

        // Extract just the arbitrary part for the message
        ARBITRARY_VALUE_PATTERN.lastIndex = 0;
        const arbitraryMatch = ARBITRARY_VALUE_PATTERN.exec(fullMatch);
        const arbitraryValue = arbitraryMatch ? arbitraryMatch[0] : fullMatch;

        if (!isAllowed(fullMatch)) {
          context.report({
            node,
            messageId: "noMagicNumber",
            data: {
              value: arbitraryValue,
            },
          });
        }
      }
    }

    /**
     * Check if an attribute is a className attribute
     */
    function isClassNameAttribute(node: TSESTree.JSXAttribute): boolean {
      return (
        node.name.type === "JSXIdentifier" &&
        (node.name.name === "className" || node.name.name === "class")
      );
    }

    /**
     * Process a JSX attribute value
     */
    function processAttributeValue(
      value: TSESTree.JSXAttribute["value"],
      parentNode: TSESTree.JSXAttribute
    ): void {
      if (!value) return;

      // String literal: className="gap-[13px]"
      if (value.type === "Literal" && typeof value.value === "string") {
        checkStringValue(value.value, parentNode);
        return;
      }

      // Expression: className={...}
      if (value.type === "JSXExpressionContainer") {
        const expr = value.expression;

        // String literal in expression: className={"gap-[13px]"}
        if (expr.type === "Literal" && typeof expr.value === "string") {
          checkStringValue(expr.value, parentNode);
          return;
        }

        // Template literal: className={`gap-[13px] ${condition}`}
        if (options.checkTemplateLiterals && expr.type === "TemplateLiteral") {
          for (const quasi of expr.quasis) {
            checkStringValue(quasi.value.raw, parentNode);
          }
          return;
        }

        // String concatenation: className={"gap-[13px] " + moreClasses}
        if (expr.type === "BinaryExpression" && expr.operator === "+") {
          checkBinaryExpression(expr, parentNode);
        }
      }
    }

    /**
     * Recursively check binary expressions for string literals
     */
    function checkBinaryExpression(
      node: TSESTree.BinaryExpression,
      reportNode: TSESTree.Node
    ): void {
      if (node.left.type === "Literal" && typeof node.left.value === "string") {
        checkStringValue(node.left.value, reportNode);
      } else if (node.left.type === "BinaryExpression") {
        checkBinaryExpression(node.left, reportNode);
      }

      if (node.right.type === "Literal" && typeof node.right.value === "string") {
        checkStringValue(node.right.value, reportNode);
      } else if (node.right.type === "BinaryExpression") {
        checkBinaryExpression(node.right, reportNode);
      }
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (isClassNameAttribute(node)) {
          processAttributeValue(node.value, node);
        }
      },
    };
  },
});

export default enforceTokens;
