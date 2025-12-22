import { describe, it } from "node:test";
import assert from "node:assert";
import type { EntryType, Category, Entry } from "../../dist/data/models.js";

describe("models", () => {
  describe("EntryType", () => {
    it("should support Income type", () => {
      const type: EntryType = "Income";
      assert.strictEqual(type, "Income");
    });

    it("should support Expense type", () => {
      const type: EntryType = "Expense";
      assert.strictEqual(type, "Expense");
    });
  });

  describe("Category", () => {
    it("should have correct shape for Income category", () => {
      const category: Category = {
        type: "Income",
        name: "Consulting",
      };

      assert.strictEqual(category.type, "Income");
      assert.strictEqual(category.name, "Consulting");
    });

    it("should have correct shape for Expense category", () => {
      const category: Category = {
        type: "Expense",
        name: "Office Supplies",
      };

      assert.strictEqual(category.type, "Expense");
      assert.strictEqual(category.name, "Office Supplies");
    });
  });

  describe("Entry", () => {
    it("should have correct shape with required fields", () => {
      const entry: Entry = {
        date: "2025-01-15",
        type: "Income",
        category: "Consulting",
        amount: 5000.0,
      };

      assert.strictEqual(entry.date, "2025-01-15");
      assert.strictEqual(entry.type, "Income");
      assert.strictEqual(entry.category, "Consulting");
      assert.strictEqual(entry.amount, 5000.0);
      assert.strictEqual(entry.notes, undefined);
    });

    it("should support optional notes field", () => {
      const entry: Entry = {
        date: "2025-01-15",
        type: "Expense",
        category: "Office Supplies",
        amount: 150.5,
        notes: "Printer ink and paper",
      };

      assert.strictEqual(entry.notes, "Printer ink and paper");
    });
  });
});
