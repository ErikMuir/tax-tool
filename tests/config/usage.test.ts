import { describe, it } from "node:test";
import assert from "node:assert";
import { getUsage } from "../../dist/config/usage.js";

describe("usage", () => {
  describe("getUsage", () => {
    it("should return a formatted usage string", () => {
      const usage = getUsage();

      assert.ok(typeof usage === "string");
      assert.ok(usage.length > 0);
    });

    it("should include the Tool-99 header", () => {
      const usage = getUsage();

      assert.ok(usage.includes("Tool-99"));
    });

    it("should include the description", () => {
      const usage = getUsage();

      assert.ok(usage.includes("For tracking 1099 income/expenses to simplify tax filing."));
    });

    it("should include Options section", () => {
      const usage = getUsage();

      assert.ok(usage.includes("Options"));
    });

    it("should include help option details", () => {
      const usage = getUsage();

      assert.ok(usage.includes("help") || usage.includes("-h"));
      assert.ok(usage.includes("Display this usage guide."));
    });

    it("should cache usage string after first call", () => {
      const usage1 = getUsage();
      const usage2 = getUsage();

      // Should return the same string (cached)
      assert.strictEqual(usage1, usage2);
    });
  });
});
