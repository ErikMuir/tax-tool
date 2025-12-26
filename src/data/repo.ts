import fs from "fs";
import { Category, Entry, EntryType, BaseModel } from "./models.js";

const CATEGORY_DATA_PATH = "./categories.json";
const ENTRY_DATA_PATH = "./entries.json";

export class Repo {
  private categories: Category[] = [];
  private entries: Entry[] = [];

  constructor() {
    this.categories = this._load<Category>(CATEGORY_DATA_PATH);
    this.entries = this._load<Entry>(ENTRY_DATA_PATH);
  }

  getCategories(type?: EntryType): Category[] {
    return type ? this.categories.filter((cat) => cat.type === type) : this.categories;
  }

  addCategory(category: Category): void {
    if (this.categories.find((cat) => cat.name === category.name && cat.type === category.type)) {
      throw new Error(`${category.type} category "${category.name}" already exists.`);
    }
    this.categories = [...this.categories, category].sort(this._byTypeAndName);
    this._save<Category>(CATEGORY_DATA_PATH, this.categories);
  }

  deleteCategory(category: Category): void {
    const newCategories = this.categories.filter((cat) => !(cat.name === category.name && cat.type === category.type));
    if (newCategories.length === this.categories.length) {
      throw new Error(`${category.type} category "${category.name}" not found.`);
    }
    this.categories = newCategories.sort(this._byTypeAndName);
    this._save<Category>(CATEGORY_DATA_PATH, this.categories);
  }

  updateCategory(oldCategory: Category, newCategory: Category): void {
    if (!this.categories.find((cat) => cat.name === oldCategory.name && cat.type === oldCategory.type)) {
      throw new Error(`${oldCategory.type} category "${oldCategory.name}" not found.`);
    }
    if (this.categories.find((cat) => cat.name === newCategory.name && cat.type === newCategory.type)) {
      throw new Error(`${newCategory.type} category "${newCategory.name}" already exists.`);
    }
    this.categories = [
      ...this.categories.filter((cat) => !(cat.name === oldCategory.name && cat.type === oldCategory.type)),
      newCategory,
    ].sort(this._byTypeAndName);
    this._save<Category>(CATEGORY_DATA_PATH, this.categories);
  }

  getEntries(type?: EntryType): Entry[] {
    return type ? this.entries.filter((entry) => entry.type === type) : this.entries;
  }

  addEntry(entry: Entry): void {
    this.entries.push(entry);
    this._save<Entry>(ENTRY_DATA_PATH, this.entries);
  }

  updateEntry(entry: Entry): void {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index === -1) {
      throw new Error(`Entry with id "${entry.id}" not found.`);
    }
    this.entries[index] = entry;
    this._save<Entry>(ENTRY_DATA_PATH, this.entries);
  }

  deleteEntry(id: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== id);
    this._save<Entry>(ENTRY_DATA_PATH, this.entries);
  }

  private _save<T extends BaseModel>(path: string, data: T[]): void {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  private _load<T extends BaseModel>(path: string): T[] {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([], null, 2));
    }
    const dataJson = fs.readFileSync(path, "utf-8");
    const data: unknown = JSON.parse(dataJson);
    if (!Array.isArray(data)) {
      throw new Error(`${path}: data is corrupt!`);
    }
    return data as T[];
  }

  private _byTypeAndName(this: void, a: Category, b: Category): number {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type.localeCompare(b.type);
  }
}
