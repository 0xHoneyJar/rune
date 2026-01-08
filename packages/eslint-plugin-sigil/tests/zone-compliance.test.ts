/**
 * Tests for zone-compliance rule
 *
 * @module tests/zone-compliance
 */

import { RuleTester } from "@typescript-eslint/rule-tester";
import { zoneCompliance } from "../src/rules/zone-compliance";
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

describe("zone-compliance", () => {
  beforeAll(() => {
    // Ensure test environment is set up
  });

  it("should enforce timing constraints for deliberate zone", () => {
    ruleTester.run("zone-compliance", zoneCompliance, {
      valid: [
        // Deliberate zone: 500-1000ms
        // 800ms = 0.8s is valid for deliberate
        {
          code: "const config = { duration: 0.8 };",
          options: [{ zone: "critical" }],
        },
        {
          code: "const config = { duration: 0.5 };",
          options: [{ zone: "critical" }],
        },
        {
          code: "const config = { duration: 1.0 };",
          options: [{ zone: "critical" }],
        },
        // Tailwind duration-500 to duration-1000 valid for deliberate
        {
          code: '<div className="duration-500">',
          options: [{ zone: "critical" }],
        },
        {
          code: '<div className="duration-700">',
          options: [{ zone: "critical" }],
        },
      ],
      invalid: [
        // 200ms = 0.2s is too fast for deliberate (min: 500ms)
        {
          code: "const config = { duration: 0.2 };",
          options: [{ zone: "critical" }],
          errors: [{ messageId: "durationTooFast" }],
        },
        // 1500ms = 1.5s is too slow for deliberate (max: 1000ms)
        {
          code: "const config = { duration: 1.5 };",
          options: [{ zone: "critical" }],
          errors: [{ messageId: "durationTooSlow" }],
        },
        // Tailwind duration-100 too fast for deliberate
        {
          code: '<div className="duration-100">',
          options: [{ zone: "critical" }],
          errors: [{ messageId: "durationTooFast" }],
        },
        // Tailwind duration-1500 too slow for deliberate
        {
          code: '<div className="duration-1500">',
          options: [{ zone: "critical" }],
          errors: [{ messageId: "durationTooSlow" }],
        },
      ],
    });
  });

  it("should enforce timing constraints for snappy zone", () => {
    ruleTester.run("zone-compliance", zoneCompliance, {
      valid: [
        // Snappy zone: 100-200ms
        {
          code: "const config = { duration: 0.15 };",
          options: [{ zone: "admin" }],
        },
        {
          code: "const config = { duration: 0.1 };",
          options: [{ zone: "admin" }],
        },
        {
          code: "const config = { duration: 0.2 };",
          options: [{ zone: "admin" }],
        },
        // Tailwind duration-100 to duration-200 valid for snappy
        {
          code: '<div className="duration-150">',
          options: [{ zone: "admin" }],
        },
      ],
      invalid: [
        // 50ms = 0.05s is too fast for snappy (min: 100ms)
        {
          code: "const config = { duration: 0.05 };",
          options: [{ zone: "admin" }],
          errors: [{ messageId: "durationTooFast" }],
        },
        // 500ms = 0.5s is too slow for snappy (max: 200ms)
        {
          code: "const config = { duration: 0.5 };",
          options: [{ zone: "admin" }],
          errors: [{ messageId: "durationTooSlow" }],
        },
        // Tailwind duration-500 too slow for snappy
        {
          code: '<div className="duration-500">',
          options: [{ zone: "admin" }],
          errors: [{ messageId: "durationTooSlow" }],
        },
      ],
    });
  });

  it("should enforce timing constraints for warm zone", () => {
    ruleTester.run("zone-compliance", zoneCompliance, {
      valid: [
        // Warm zone: 200-400ms
        {
          code: "const config = { duration: 0.3 };",
          options: [{ zone: "marketing" }],
        },
        {
          code: "const config = { duration: 0.2 };",
          options: [{ zone: "marketing" }],
        },
        {
          code: "const config = { duration: 0.4 };",
          options: [{ zone: "marketing" }],
        },
        // Tailwind duration-200 to duration-400 valid for warm
        {
          code: '<div className="duration-300">',
          options: [{ zone: "marketing" }],
        },
      ],
      invalid: [
        // 100ms = 0.1s is too fast for warm (min: 200ms)
        {
          code: "const config = { duration: 0.1 };",
          options: [{ zone: "marketing" }],
          errors: [{ messageId: "durationTooFast" }],
        },
        // 800ms = 0.8s is too slow for warm (max: 400ms)
        {
          code: "const config = { duration: 0.8 };",
          options: [{ zone: "marketing" }],
          errors: [{ messageId: "durationTooSlow" }],
        },
      ],
    });
  });
});
