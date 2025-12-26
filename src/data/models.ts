export type EntryType = "Income" | "Expense";

export type BaseModel = object;

export type Category = BaseModel & {
  type: EntryType;
  name: string;
};

export type Entry = BaseModel & {
  id: string; // UUID
  date: string; // ISO date string
  type: EntryType;
  category: string;
  amount: number; // in dollars
  notes?: string;
};
