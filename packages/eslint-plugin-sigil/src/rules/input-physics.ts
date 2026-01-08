/**
 * Sigil ESLint Plugin - input-physics Rule
 *
 * Enforces keyboard navigation in admin/machinery zones.
 * Detects onClick handlers without corresponding onKeyDown/tabIndex.
 *
 * @module rules/input-physics
 * @version 4.1.0
 *
 * @example
 * // In admin zone:
 *
 * // Bad - no keyboard support
 * <div onClick={handleClick}>
 *
 * // Good - full keyboard support
 * <div onClick={handleClick} onKeyDown={handleKey} tabIndex={0}>
 *
 * // Good - native interactive element (exempt)
 * <button onClick={handleClick}>
 */

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { loadConfig, type SigilConfig } from "../config-loader";
import { resolveZone, zoneRequiresInputPhysics } from "../zone-resolver";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://sigil.dev/eslint/${name}`
);

type MessageIds = "missingKeyboardSupport" | "missingTabIndex";

export interface InputPhysicsOptions {
  /** Override zone for all files (useful for testing) */
  zone?: string;
  /** Additional zones that require input physics */
  additionalZones?: string[];
  /** Elements to exempt from the rule */
  exemptElements?: string[];
}

/**
 * Native interactive elements that are exempt from this rule
 * These elements already support keyboard interaction
 */
const NATIVE_INTERACTIVE_ELEMENTS = new Set([
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "summary",
  "details",
]);

/**
 * Interactive role values that exempt an element
 */
const INTERACTIVE_ROLES = new Set([
  "button",
  "link",
  "checkbox",
  "radio",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "tab",
  "treeitem",
  "gridcell",
  "switch",
  "searchbox",
  "spinbutton",
  "combobox",
  "listbox",
  "slider",
  "textbox",
]);

export const inputPhysics = createRule<[InputPhysicsOptions], MessageIds>({
  name: "input-physics",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce keyboard navigation for interactive elements in admin zones.",
    },
    messages: {
      missingKeyboardSupport:
        "Interactive element in {{zone}} zone should have onKeyDown handler for keyboard navigation.",
      missingTabIndex:
        "Interactive element in {{zone}} zone should have tabIndex for keyboard focus.",
    },
    schema: [
      {
        type: "object",
        properties: {
          zone: {
            type: "string",
          },
          additionalZones: {
            type: "array",
            items: { type: "string" },
          },
          exemptElements: {
            type: "array",
            items: { type: "string" },
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
    const zoneName = options.zone || resolveZone(filename, config).name;

    // Check if this zone requires input physics
    const additionalZones = new Set(options.additionalZones || []);
    const requiresInputPhysics =
      zoneRequiresInputPhysics(zoneName) || additionalZones.has(zoneName);

    // If zone doesn't require input physics, skip rule
    if (!requiresInputPhysics) {
      return {};
    }

    // Build exempt elements set
    const exemptElements = new Set([
      ...NATIVE_INTERACTIVE_ELEMENTS,
      ...(options.exemptElements || []),
    ]);

    /**
     * Get the element name from a JSX element
     */
    function getElementName(
      node: TSESTree.JSXOpeningElement
    ): string | null {
      if (node.name.type === "JSXIdentifier") {
        return node.name.name;
      }
      if (node.name.type === "JSXMemberExpression") {
        // Handle cases like motion.div
        if (node.name.property.type === "JSXIdentifier") {
          return node.name.property.name;
        }
      }
      return null;
    }

    /**
     * Check if an element is exempt (native interactive or configured)
     */
    function isExemptElement(elementName: string | null): boolean {
      if (!elementName) return false;
      return exemptElements.has(elementName.toLowerCase());
    }

    /**
     * Check if element has an interactive role
     */
    function hasInteractiveRole(
      attributes: TSESTree.JSXOpeningElement["attributes"]
    ): boolean {
      for (const attr of attributes) {
        if (
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.name.name === "role" &&
          attr.value
        ) {
          if (
            attr.value.type === "Literal" &&
            typeof attr.value.value === "string"
          ) {
            return INTERACTIVE_ROLES.has(attr.value.value.toLowerCase());
          }
        }
      }
      return false;
    }

    /**
     * Check if element has a specific attribute
     */
    function hasAttribute(
      attributes: TSESTree.JSXOpeningElement["attributes"],
      name: string
    ): boolean {
      return attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.name.name === name
      );
    }

    /**
     * Check if element has onClick handler
     */
    function hasOnClick(
      attributes: TSESTree.JSXOpeningElement["attributes"]
    ): boolean {
      return hasAttribute(attributes, "onClick");
    }

    /**
     * Check if element has onKeyDown handler
     */
    function hasOnKeyDown(
      attributes: TSESTree.JSXOpeningElement["attributes"]
    ): boolean {
      return (
        hasAttribute(attributes, "onKeyDown") ||
        hasAttribute(attributes, "onKeyUp") ||
        hasAttribute(attributes, "onKeyPress")
      );
    }

    /**
     * Check if element has tabIndex
     */
    function hasTabIndex(
      attributes: TSESTree.JSXOpeningElement["attributes"]
    ): boolean {
      return hasAttribute(attributes, "tabIndex");
    }

    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const elementName = getElementName(node);

        // Skip exempt elements (native interactive)
        if (isExemptElement(elementName)) {
          return;
        }

        // Skip if no onClick handler
        if (!hasOnClick(node.attributes)) {
          return;
        }

        // Skip if element has interactive role (handled by browser)
        if (hasInteractiveRole(node.attributes)) {
          return;
        }

        // Check for keyboard support
        if (!hasOnKeyDown(node.attributes)) {
          context.report({
            node,
            messageId: "missingKeyboardSupport",
            data: {
              zone: zoneName,
            },
          });
        }

        // Check for tabIndex
        if (!hasTabIndex(node.attributes)) {
          context.report({
            node,
            messageId: "missingTabIndex",
            data: {
              zone: zoneName,
            },
          });
        }
      },
    };
  },
});

export default inputPhysics;
