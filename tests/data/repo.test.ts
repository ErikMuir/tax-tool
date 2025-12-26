import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import fs from "fs";
import { Repo } from "../../dist/data/repo.js";
import type { Category, Entry } from "../../dist/data/models.js";

describe("Repo", () => {
  const testCategoriesPath = "./test-categories.json";
  const testEntriesPath = "./test-entries.json";

  beforeEach(() => {
    // Clean up any existing test files
    if (fs.existsSync(testCategoriesPath)) {
      fs.unlinkSync(testCategoriesPath);
    }
    if (fs.existsSync(testEntriesPath)) {
      fs.unlinkSync(testEntriesPath);
    }
    if (fs.existsSync("./categories.json")) {
      fs.unlinkSync("./categories.json");
    }
    if (fs.existsSync("./entries.json")) {
      fs.unlinkSync("./entries.json");
    }
  });

  afterEach(() => {
    // Clean up test files after each test
    if (fs.existsSync(testCategoriesPath)) {
      fs.unlinkSync(testCategoriesPath);
    }
    if (fs.existsSync(testEntriesPath)) {
      fs.unlinkSync(testEntriesPath);
    }
    if (fs.existsSync("./categories.json")) {
      fs.unlinkSync("./categories.json");
    }
    if (fs.existsSync("./entries.json")) {
      fs.unlinkSync("./entries.json");
    }
  });

  describe("constructor", () => {
    it("should create empty data files if they don't exist", () => {
      assert.ok(!fs.existsSync("./categories.json"));
      assert.ok(!fs.existsSync("./entries.json"));

      new Repo();

      assert.ok(fs.existsSync("./categories.json"));
      assert.ok(fs.existsSync("./entries.json"));

      const categoriesData = fs.readFileSync("./categories.json", "utf-8");
      const entriesData = fs.readFileSync("./entries.json", "utf-8");

      assert.deepStrictEqual(JSON.parse(categoriesData), []);
      assert.deepStrictEqual(JSON.parse(entriesData), []);
    });

    it("should load existing categories from file", () => {
      const categories: Category[] = [
        { type: "Income", name: "Consulting" },
        { type: "Expense", name: "Office Supplies" },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify(categories, null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      const repo = new Repo();

      const incomeCategories = repo.getCategories("Income");
      assert.strictEqual(incomeCategories.length, 1);
      assert.strictEqual(incomeCategories[0].name, "Consulting");

      const expenseCategories = repo.getCategories("Expense");
      assert.strictEqual(expenseCategories.length, 1);
      assert.strictEqual(expenseCategories[0].name, "Office Supplies");
    });

    it("should load existing entries from file", () => {
      const entries: Entry[] = [
        {
          id: "entry-1",
          date: "2025-01-15",
          type: "Income",
          category: "Consulting",
          amount: 5000.0,
        },
        {
          id: "entry-2",
          date: "2025-01-16",
          type: "Expense",
          category: "Office Supplies",
          amount: 150.5,
          notes: "Printer ink",
        },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify(entries, null, 2));

      const repo = new Repo();

      const incomeEntries = repo.getEntries("Income");
      assert.strictEqual(incomeEntries.length, 1);
      assert.strictEqual(incomeEntries[0].amount, 5000.0);

      const expenseEntries = repo.getEntries("Expense");
      assert.strictEqual(expenseEntries.length, 1);
      assert.strictEqual(expenseEntries[0].amount, 150.5);
    });

    it("should throw error if categories file contains invalid JSON", () => {
      fs.writeFileSync("./categories.json", "not valid json");
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      assert.throws(() => new Repo(), SyntaxError);
    });

    it("should throw error if categories file is not an array", () => {
      fs.writeFileSync("./categories.json", '{"not": "an array"}');
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      assert.throws(() => new Repo(), /\.\/categories\.json: data is corrupt!/);
    });

    it("should throw error if entries file contains invalid JSON", () => {
      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", "not valid json");

      assert.throws(() => new Repo(), SyntaxError);
    });

    it("should throw error if entries file is not an array", () => {
      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", '{"not": "an array"}');

      assert.throws(() => new Repo(), /\.\/entries\.json: data is corrupt!/);
    });
  });

  describe("getCategories", () => {
    it("should return empty array when no categories exist", () => {
      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      const repo = new Repo();
      const incomeCategories = repo.getCategories("Income");

      assert.ok(Array.isArray(incomeCategories));
      assert.strictEqual(incomeCategories.length, 0);
    });

    it("should filter categories by Income type", () => {
      const categories: Category[] = [
        { type: "Income", name: "Consulting" },
        { type: "Income", name: "Freelance" },
        { type: "Expense", name: "Office Supplies" },
        { type: "Expense", name: "Travel" },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify(categories, null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      const repo = new Repo();
      const incomeCategories = repo.getCategories("Income");

      assert.strictEqual(incomeCategories.length, 2);
      assert.strictEqual(incomeCategories[0].name, "Consulting");
      assert.strictEqual(incomeCategories[1].name, "Freelance");
      assert.ok(incomeCategories.every((cat) => cat.type === "Income"));
    });

    it("should filter categories by Expense type", () => {
      const categories: Category[] = [
        { type: "Income", name: "Consulting" },
        { type: "Income", name: "Freelance" },
        { type: "Expense", name: "Office Supplies" },
        { type: "Expense", name: "Travel" },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify(categories, null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      const repo = new Repo();
      const expenseCategories = repo.getCategories("Expense");

      assert.strictEqual(expenseCategories.length, 2);
      assert.strictEqual(expenseCategories[0].name, "Office Supplies");
      assert.strictEqual(expenseCategories[1].name, "Travel");
      assert.ok(expenseCategories.every((cat) => cat.type === "Expense"));
    });
  });

  describe("getEntries", () => {
    it("should return empty array when no entries exist", () => {
      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify([], null, 2));

      const repo = new Repo();
      const incomeEntries = repo.getEntries("Income");

      assert.ok(Array.isArray(incomeEntries));
      assert.strictEqual(incomeEntries.length, 0);
    });

    it("should filter entries by Income type", () => {
      const entries: Entry[] = [
        {
          id: "entry-1",
          date: "2025-01-15",
          type: "Income",
          category: "Consulting",
          amount: 5000.0,
        },
        {
          id: "entry-2",
          date: "2025-01-16",
          type: "Income",
          category: "Freelance",
          amount: 3000.0,
        },
        {
          id: "entry-3",
          date: "2025-01-17",
          type: "Expense",
          category: "Office Supplies",
          amount: 150.5,
        },
        {
          id: "entry-4",
          date: "2025-01-18",
          type: "Expense",
          category: "Travel",
          amount: 500.0,
        },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify(entries, null, 2));

      const repo = new Repo();
      const incomeEntries = repo.getEntries("Income");

      assert.strictEqual(incomeEntries.length, 2);
      assert.strictEqual(incomeEntries[0].amount, 5000.0);
      assert.strictEqual(incomeEntries[1].amount, 3000.0);
      assert.ok(incomeEntries.every((entry) => entry.type === "Income"));
    });

    it("should filter entries by Expense type", () => {
      const entries: Entry[] = [
        {
          id: "entry-1",
          date: "2025-01-15",
          type: "Income",
          category: "Consulting",
          amount: 5000.0,
        },
        {
          id: "entry-2",
          date: "2025-01-16",
          type: "Income",
          category: "Freelance",
          amount: 3000.0,
        },
        {
          id: "entry-3",
          date: "2025-01-17",
          type: "Expense",
          category: "Office Supplies",
          amount: 150.5,
        },
        {
          id: "entry-4",
          date: "2025-01-18",
          type: "Expense",
          category: "Travel",
          amount: 500.0,
        },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify(entries, null, 2));

      const repo = new Repo();
      const expenseEntries = repo.getEntries("Expense");

      assert.strictEqual(expenseEntries.length, 2);
      assert.strictEqual(expenseEntries[0].amount, 150.5);
      assert.strictEqual(expenseEntries[1].amount, 500.0);
      assert.ok(expenseEntries.every((entry) => entry.type === "Expense"));
    });

    it("should preserve all entry fields including notes", () => {
      const entries: Entry[] = [
        {
          id: "entry-1",
          date: "2025-01-15",
          type: "Income",
          category: "Consulting",
          amount: 5000.0,
          notes: "Q4 project payment",
        },
      ];

      fs.writeFileSync("./categories.json", JSON.stringify([], null, 2));
      fs.writeFileSync("./entries.json", JSON.stringify(entries, null, 2));

      const repo = new Repo();
      const incomeEntries = repo.getEntries("Income");

      assert.strictEqual(incomeEntries[0].notes, "Q4 project payment");
      assert.strictEqual(incomeEntries[0].date, "2025-01-15");
      assert.strictEqual(incomeEntries[0].category, "Consulting");
    });
  });
});
