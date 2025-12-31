export type EntryType = "Income" | "Expense";

export type Settings = {
  categories: {
    income: string[];
    expense: string[];
  };
  rates: { // expressed as percentages (e.g., 25 for 25%)
    tax: number;
    ira: number;
  };
};

export type Entry = {
  id: string; // UUID
  date: string; // ISO date string
  type: EntryType;
  category: string;
  amount: number; // in dollars
  notes?: string;
};
