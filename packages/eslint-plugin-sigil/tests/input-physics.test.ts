/**
 * Tests for input-physics rule
 *
 * @module tests/input-physics
 */

import { RuleTester } from "@typescript-eslint/rule-tester";
import { inputPhysics } from "../src/rules/input-physics";
import { describe, it, beforeAll } from "vitest";

// Configure RuleTester for JSX
const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

describe("input-physics", () => {
  beforeAll(() => {
    // Ensure test environment is set up
  });

  it("should enforce keyboard support in admin zone", () => {
    ruleTester.run("input-physics", inputPhysics, {
      valid: [
        // Native interactive elements are exempt
        {
          code: "<button onClick={handleClick}>Click me</button>",
          options: [{ zone: "admin" }],
        },
        {
          code: '<a href="#" onClick={handleClick}>Link</a>',
          options: [{ zone: "admin" }],
        },
        {
          code: "<input onClick={handleClick} />",
          options: [{ zone: "admin" }],
        },
        {
          code: "<select onClick={handleClick}><option>Option</option></select>",
          options: [{ zone: "admin" }],
        },
        {
          code: "<textarea onClick={handleClick} />",
          options: [{ zone: "admin" }],
        },
        // Full keyboard support
        {
          code: "<div onClick={handleClick} onKeyDown={handleKey} tabIndex={0}>",
          options: [{ zone: "admin" }],
        },
        // With onKeyUp instead of onKeyDown
        {
          code: "<div onClick={handleClick} onKeyUp={handleKey} tabIndex={0}>",
          options: [{ zone: "admin" }],
        },
        // Interactive role (browser handles keyboard)
        {
          code: '<div onClick={handleClick} role="button">',
          options: [{ zone: "admin" }],
        },
        {
          code: '<div onClick={handleClick} role="link">',
          options: [{ zone: "admin" }],
        },
        // Non-admin zone doesn't require keyboard support
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "marketing" }],
        },
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "default" }],
        },
        // No onClick, no requirements
        {
          code: "<div onMouseEnter={handleHover}>",
          options: [{ zone: "admin" }],
        },
        // Exempt element via options
        {
          code: "<CustomButton onClick={handleClick}>",
          options: [{ zone: "admin", exemptElements: ["CustomButton"] }],
        },
      ],
      invalid: [
        // Missing onKeyDown
        {
          code: "<div onClick={handleClick} tabIndex={0}>",
          options: [{ zone: "admin" }],
          errors: [{ messageId: "missingKeyboardSupport" }],
        },
        // Missing tabIndex
        {
          code: "<div onClick={handleClick} onKeyDown={handleKey}>",
          options: [{ zone: "admin" }],
          errors: [{ messageId: "missingTabIndex" }],
        },
        // Missing both
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "admin" }],
          errors: [
            { messageId: "missingKeyboardSupport" },
            { messageId: "missingTabIndex" },
          ],
        },
        // Span with onClick
        {
          code: "<span onClick={handleClick}>Click me</span>",
          options: [{ zone: "admin" }],
          errors: [
            { messageId: "missingKeyboardSupport" },
            { messageId: "missingTabIndex" },
          ],
        },
        // Custom component with onClick
        {
          code: "<Card onClick={handleClick}>",
          options: [{ zone: "admin" }],
          errors: [
            { messageId: "missingKeyboardSupport" },
            { messageId: "missingTabIndex" },
          ],
        },
        // Additional zone requires input physics
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "machinery", additionalZones: ["machinery"] }],
          errors: [
            { messageId: "missingKeyboardSupport" },
            { messageId: "missingTabIndex" },
          ],
        },
      ],
    });
  });

  it("should skip non-admin zones by default", () => {
    ruleTester.run("input-physics", inputPhysics, {
      valid: [
        // Marketing zone - no requirements
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "marketing" }],
        },
        // Critical zone - no requirements (deliberate but not admin)
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "critical" }],
        },
        // Default zone - no requirements
        {
          code: "<div onClick={handleClick}>",
          options: [{ zone: "default" }],
        },
      ],
      invalid: [],
    });
  });
});
