import fs from "fs";
import { Settings, Entry, EntryType } from "./models.js";

const SETTINGS_DATA_PATH = "./src/data/settings.json";
const ENTRY_DATA_PATH = "./src/data/entries.json";

let repo: Repo | null = null;
export function getRepo(): Repo {
  if (!repo) {
    repo = new Repo();
  }
  return repo;
}

class Repo {
  private settings: Settings = { categories: { income: [], expense: [] }, rates: { tax: 0, ira: 0 } };
  private entries: Entry[] = [];

  constructor() {
    this.settings = this._loadSettings();
    this.entries = this._loadEntries();
  }

  // Settings Methods

  getCategories(type: EntryType): string[] {
    return type === "Income" ? this.settings.categories.income : this.settings.categories.expense;
  }
  
  addCategory(type: EntryType, category: string): void {
    const categories = this.getCategories(type);
    if (categories.includes(category)) {
      throw new Error(`${type} category "${category}" already exists.`);
    }
    categories.push(category);
    this._saveSettings();
  }

  removeCategory(type: EntryType, category: string): void {
    const categories = this.getCategories(type);
    const index = categories.indexOf(category);
    if (index === -1) {
      throw new Error(`${type} category "${category}" not found.`);
    }
    categories.splice(index, 1);
    this._saveSettings();
  }

  updateCategory(type: EntryType, oldCategory: string, newCategory: string): void {
    const categories = this.getCategories(type);
    const index = categories.indexOf(oldCategory);
    if (index === -1) {
      throw new Error(`${type} category "${oldCategory}" not found.`);
    }
    if (categories.includes(newCategory)) {
      throw new Error(`${type} category "${newCategory}" already exists.`);
    }
    categories[index] = newCategory;
    this._saveSettings();
  }

  getTaxRate(): number {
    return this.settings.rates.tax;
  }

  setTaxRate(rate: number): void {
    if (rate < 0 || rate > 100) {
      throw new Error(`Tax rate must be between 0 and 100. Given: ${rate}`);
    }
    this.settings.rates.tax = rate;
    this._saveSettings();
  }

  getRetirementRate(): number {
    return this.settings.rates.ira;
  }

  setRetirementRate(rate: number): void {
    if (rate < 0 || rate > 100) {
      throw new Error(`Retirement rate must be between 0 and 100. Given: ${rate}`);
    }
    this.settings.rates.ira = rate;
    this._saveSettings();
  }

  private _saveSettings(): void {
    this.settings.categories.income.sort();
    this.settings.categories.expense.sort();
    fs.writeFileSync(SETTINGS_DATA_PATH, JSON.stringify(this.settings, null, 2));
  }

  private _loadSettings(): Settings {
    if (!fs.existsSync(SETTINGS_DATA_PATH)) {
      fs.writeFileSync(SETTINGS_DATA_PATH, JSON.stringify(this.settings, null, 2));
    }
    const dataJson = fs.readFileSync(SETTINGS_DATA_PATH, "utf-8");
    const data: unknown = JSON.parse(dataJson);
    if (typeof data !== "object" || data === null || !("categories" in data) || !("rates" in data)) {
      throw new Error(`${SETTINGS_DATA_PATH}: settings data is corrupt!`);
    }
    return data as Settings;
  }

  // Entry Methods

  getEntries(type?: EntryType): Entry[] {
    return type ? this.entries.filter((entry) => entry.type === type) : this.entries;
  }

  addEntry(entry: Entry): void {
    this.entries.push(entry);
    this._saveEntries();
  }

  updateEntry(entry: Entry): void {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index === -1) {
      throw new Error(`Entry with id "${entry.id}" not found.`);
    }
    this.entries[index] = entry;
    this._saveEntries();
  }

  deleteEntry(id: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== id);
    this._saveEntries();
  }

  private _saveEntries(): void {
    fs.writeFileSync(ENTRY_DATA_PATH, JSON.stringify(this.entries, null, 2));
  }

  private _loadEntries(): Entry[] {
    if (!fs.existsSync(ENTRY_DATA_PATH)) {
      fs.writeFileSync(ENTRY_DATA_PATH, JSON.stringify([], null, 2));
    }
    const dataJson = fs.readFileSync(ENTRY_DATA_PATH, "utf-8");
    const data: unknown = JSON.parse(dataJson);
    if (!Array.isArray(data)) {
      throw new Error(`${ENTRY_DATA_PATH}: entries data is corrupt!`);
    }
    return data as Entry[];
  }
}
