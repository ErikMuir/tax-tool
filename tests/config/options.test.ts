import { describe, it } from "node:test";
import assert from "node:assert";
import { getOptions, optionDefinitions } from "../../dist/config/options.js";

describe("options", () => {
  describe("optionDefinitions", () => {
    it("should define help option with correct properties", () => {
      const helpOption = optionDefinitions.find((opt) => opt.name === "help");

      assert.ok(helpOption, "help option should be defined");
      assert.strictEqual(helpOption.name, "help");
      assert.strictEqual(helpOption.alias, "h");
      assert.strictEqual(helpOption.type, Boolean);
      assert.strictEqual(helpOption.description, "Display this usage guide.");
    });

    it("should export an array of option definitions", () => {
      assert.ok(Array.isArray(optionDefinitions));
      assert.ok(optionDefinitions.length > 0);
    });
  });

  describe("getOptions", () => {
    it("should return an object when called", () => {
      const options = getOptions();
      assert.ok(typeof options === "object");
      assert.ok(options !== null);
    });

    it("should cache options after first call", () => {
      const options1 = getOptions();
      const options2 = getOptions();

      // Should return the same object instance (cached)
      assert.strictEqual(options1, options2);
    });
  });
});
