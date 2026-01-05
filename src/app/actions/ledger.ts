import { Entry, EntryType, getRepo } from "../../utils/repo.js";
import { getUI } from "../../utils/ui.js";
import { getDateInput, getMoneyInput } from "./utility.js";

export async function ledgerEntry(): Promise<void> {
  const ui = getUI();
  ui.banner(["Ledger"]);
  const entry = await promptEntry();
  const confirm = entry !== null && await confirmEntry(entry);
  if (confirm) {
    getRepo().addEntry(entry);
    ui.log("Entry added successfully.");
  } else {
    ui.log("Entry cancelled.");
  }
  await ui.continue();
}

async function promptEntry(): Promise<Entry | null> {
  const ui = getUI();
  const type = await ui.choose("Entry Type", ["Income", "Expense"]) as EntryType;
  ui.lineFeed();
  const category = await ui.choose(`${type} Category`, getRepo().getCategories(type));
  ui.lineFeed();
  const date = await getDateInput("Entry Date");
  if (date === null) return null;
  ui.lineFeed();
  const amount = await getMoneyInput("Entry Amount");
  if (amount === null) return null;
  ui.lineFeed();
  const rawNotes = (await ui.prompt("Notes (optional)")).trim();
  const notes = rawNotes === "" ? undefined : rawNotes;
  const entry: Entry = {
    type,
    category,
    date,
    amount,
    notes,
    created: new Date().toISOString(),
  };
  return entry;
}

async function confirmEntry(entry: Entry): Promise<boolean> {
  if (!entry) return false;
  const ui = getUI();
  ui.lineFeed()
    .warning("Please confirm the following entry:")
    .write(`${entry.type} | ${entry.category} | ${entry.date} | $${entry.amount.toFixed(2)}`)
    .writeIf(!!entry.notes, entry.notes!);
  const confirm = await ui.confirm("Is this correct?", true);
  return confirm;
}
