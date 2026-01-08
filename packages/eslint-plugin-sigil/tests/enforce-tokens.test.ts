/**
 * Tests for enforce-tokens rule
 *
 * @module tests/enforce-tokens
 */

import { RuleTester } from "@typescript-eslint/rule-tester";
import { enforceTokens } from "../src/rules/enforce-tokens";
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

describe("enforce-tokens", () => {
  beforeAll(() => {
    // Ensure test environment is set up
  });

  it("should pass valid test cases", () => {
    ruleTester.run("enforce-tokens", enforceTokens, {
      valid: [
        // Token values are allowed
        {
          code: '<div className="gap-2">',
        },
        {
          code: '<div className="text-red-500">',
        },
        {
          code: '<div className="w-8 h-16 p-4">',
        },
        // Multiple classes without arbitrary values
        {
          code: '<div className="flex items-center justify-between gap-4 p-2">',
        },
        // Expression with token values
        {
          code: '<div className={"gap-2 p-4"}>',
        },
        // Template literal with token values
        {
          code: '<div className={`gap-2 ${condition ? "p-4" : "p-2"}`}>',
        },
        // Non-className attributes are ignored
        {
          code: '<div style="width: [13px]">',
        },
        // Allowed pattern option
        {
          code: '<div className="grid-cols-[200px_1fr]">',
          options: [{ allowPatterns: ["grid-cols-\\[.*\\]"] }],
        },
      ],
      invalid: [
        // Arbitrary pixel values
        {
          code: '<div className="gap-[13px]">',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // Arbitrary rem values
        {
          code: '<div className="w-[2rem]">',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // Arbitrary color values
        {
          code: '<div className="text-[#ff0000]">',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // Arbitrary percentage values
        {
          code: '<div className="w-[50%]">',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // Multiple arbitrary values
        {
          code: '<div className="gap-[10px] p-[20px]">',
          errors: [{ messageId: "noMagicNumber" }, { messageId: "noMagicNumber" }],
        },
        // In expression container
        {
          code: '<div className={"gap-[13px]"}>',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // In template literal
        {
          code: '<div className={`gap-[13px] ${condition}`}>',
          errors: [{ messageId: "noMagicNumber" }],
        },
        // Mixed with valid classes
        {
          code: '<div className="flex items-center gap-[10px]">',
          errors: [{ messageId: "noMagicNumber" }],
        },
      ],
    });
  });
});
