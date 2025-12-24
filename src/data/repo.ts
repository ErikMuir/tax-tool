import fs from "fs";
import { Category, Entry, EntryType, BaseModel } from "./models.js";

const CATEGORY_DATA_PATH = "./categories.json";
const ENTRY_DATA_PATH = "./entries.json";

export class Repo {
  private categories: Category[] = [];
  private entries: Entry[] = [];

  constructor() {
    this.categories = this.load<Category>(CATEGORY_DATA_PATH);
    this.entries = this.load<Entry>(ENTRY_DATA_PATH);
  }

  getCategories(type: EntryType): Category[] {
    return this.categories.filter((cat) => cat.type === type);
  }

  getEntries(type: EntryType): Entry[] {
    return this.entries.filter((entry) => entry.type === type);
  }

  private load<T extends BaseModel>(path: string): T[] {
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
}
