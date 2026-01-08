/**
 * Sigil ESLint Plugin - zone-compliance Rule
 *
 * Enforces zone-appropriate timing values in animations and transitions.
 * Detects framer-motion duration props and Tailwind duration classes.
 *
 * @module rules/zone-compliance
 * @version 4.1.0
 *
 * Motion constraints (ms):
 * - instant: 0-50ms
 * - snappy: 100-200ms
 * - warm: 200-400ms
 * - deliberate: 500-1000ms
 * - reassuring: 800-1500ms
 *
 * @example
 * // In critical zone (motion: deliberate):
 *
 * // Bad - too fast for deliberate zone
 * <motion.div animate={{ transition: { duration: 0.2 } }}>
 *
 * // Good - appropriate for deliberate zone
 * <motion.div animate={{ transition: { duration: 0.8 } }}>
 */

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { loadConfig, getMotionConstraints, type SigilConfig } from "../config-loader";
import { resolveZone } from "../zone-resolver";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://sigil.dev/eslint/${name}`
);

type MessageIds = "durationTooFast" | "durationTooSlow";

export interface ZoneComplianceOptions {
  /** Override zone for all files (useful for testing) */
  zone?: string;
}

/**
 * Tailwind duration class pattern
 * Matches: duration-75, duration-100, duration-150, etc.
 */
const TAILWIND_DURATION_PATTERN = /duration-(\d+)/g;

/**
 * Convert Tailwind duration value to milliseconds
 * Tailwind uses ms values directly (duration-150 = 150ms)
 */
function tailwindToMs(value: string): number {
  return parseInt(value, 10);
}

/**
 * Convert framer-motion seconds to milliseconds
 * Framer-motion uses seconds (0.2 = 200ms)
 */
function secondsToMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

export const zoneCompliance = createRule<[ZoneComplianceOptions], MessageIds>({
  name: "zone-compliance",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce zone-appropriate timing values in animations and transitions.",
    },
    messages: {
      durationTooFast:
        "Duration {{duration}}ms is too fast for {{zone}} zone (motion: {{motion}}). Minimum: {{min}}ms.",
      durationTooSlow:
        "Duration {{duration}}ms is too slow for {{zone}} zone (motion: {{motion}}). Maximum: {{max}}ms.",
    },
    schema: [
      {
        type: "object",
        properties: {
          zone: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const filename = context.filename || context.getFilename();
    let config: SigilConfig;

    try {
      config = loadConfig();
    } catch {
      // If config loading fails, skip this rule
      return {};
    }

    // Resolve zone from file path or use override
    const resolvedZone = options.zone
      ? {
          name: options.zone,
          motion: config.zones[options.zone]?.motion || "warm",
        }
      : resolveZone(filename, config);

    const motion = resolvedZone.motion;
    const constraints = getMotionConstraints(motion);

    /**
     * Check if a duration (in ms) violates zone constraints
     */
    function checkDuration(
      durationMs: number,
      node: TSESTree.Node
    ): void {
      if (durationMs < constraints.min) {
        context.report({
          node,
          messageId: "durationTooFast",
          data: {
            duration: String(durationMs),
            zone: resolvedZone.name,
            motion,
            min: String(constraints.min),
          },
        });
      } else if (durationMs > constraints.max) {
        context.report({
          node,
          messageId: "durationTooSlow",
          data: {
            duration: String(durationMs),
            zone: resolvedZone.name,
            motion,
            max: String(constraints.max),
          },
        });
      }
    }

    /**
     * Check className for Tailwind duration classes
     */
    function checkClassNameForDuration(
      value: string,
      node: TSESTree.Node
    ): void {
      TAILWIND_DURATION_PATTERN.lastIndex = 0;
      let match;

      while ((match = TAILWIND_DURATION_PATTERN.exec(value)) !== null) {
        const durationMs = tailwindToMs(match[1]);
        checkDuration(durationMs, node);
      }
    }

    /**
     * Check if a property is a duration property
     */
    function isDurationProperty(node: TSESTree.Property): boolean {
      return (
        node.key.type === "Identifier" &&
        node.key.name === "duration"
      );
    }

    /**
     * Extract numeric value from a node
     */
    function getNumericValue(node: TSESTree.Node): number | null {
      if (node.type === "Literal" && typeof node.value === "number") {
        return node.value;
      }
      return null;
    }

    /**
     * Check a property for duration values
     */
    function checkDurationProperty(node: TSESTree.Property): void {
      const value = getNumericValue(node.value);
      if (value !== null) {
        // Framer-motion uses seconds, convert to ms
        const durationMs = secondsToMs(value);
        checkDuration(durationMs, node);
      }
    }

    return {
      // Check className attributes for Tailwind duration classes
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (
          node.name.type !== "JSXIdentifier" ||
          (node.name.name !== "className" && node.name.name !== "class")
        ) {
          return;
        }

        const value = node.value;
        if (!value) return;

        // String literal
        if (value.type === "Literal" && typeof value.value === "string") {
          checkClassNameForDuration(value.value, node);
          return;
        }

        // Expression container with string literal
        if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "Literal" &&
          typeof value.expression.value === "string"
        ) {
          checkClassNameForDuration(value.expression.value, node);
          return;
        }

        // Template literal
        if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ) {
          for (const quasi of value.expression.quasis) {
            checkClassNameForDuration(quasi.value.raw, node);
          }
        }
      },

      // Check object properties for framer-motion duration
      Property(node: TSESTree.Property) {
        if (isDurationProperty(node)) {
          checkDurationProperty(node);
        }
      },
    };
  },
});

export default zoneCompliance;
