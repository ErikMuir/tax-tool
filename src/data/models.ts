
export type EntryType = "Income" | "Expense";

export type Category = {
  type: EntryType;
  name: string;
}

export type Entry = {
  date: string; // ISO date string
  type: EntryType;
  category: string;
  amount: number; // in dollars
  notes?: string;
}

export type Model = Category | Entry;
