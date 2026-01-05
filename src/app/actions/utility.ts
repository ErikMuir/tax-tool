import { getUI } from "../../utils/ui.js";

export const noOp = async () => { };

export const quickExit = async () => {
  getUI().lineFeed().write("Exiting...").lineFeed();
  process.exit(0);
};

export const notImplemented = async () => {
  await getUI().write("Not implemented.", { color: "yellow" }).continue();
};

export async function getPercentageInput(promptMessage: string): Promise<number | null> {
  const ui = getUI();
  const raw = await ui.prompt(promptMessage);
  const formatted = raw.replaceAll("%", "").trim();
  if (formatted === "") {
    ui.log("Value unchanged.");
    await ui.continue();
    return null;
  }
  const parsed = Number(formatted);
  if (isNaN(parsed) || parsed < 0 || parsed > 100) {
    ui.error(`Invalid value: ${parsed}. Must be a number between 0 and 100.`);
    return null;
  }
  return parsed < 1 ? parsed * 100 : parsed;
}

export async function getDateInput(promptMessage: string): Promise<string | null> {
  const ui = getUI();
  const raw = await ui.prompt(`${promptMessage} (leave blank for today)`);
  const date = raw.trim() === "" ? new Date() : new Date(raw);
  if (isNaN(date.getTime())) {
    ui.error(`Invalid date format: "${raw}". Please use YYYY-MM-DD format.`);
    return null;
  }
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate || null;
}

export async function getMoneyInput(promptMessage: string): Promise<number | null> {
  const ui = getUI();
  const raw = await ui.prompt(promptMessage);
  const formatted = raw.replace(/[^0-9.]/g, "").trim();
  const parsed = Number(formatted);
  if (isNaN(parsed)) {
    ui.error(`Invalid dollar amount: "${raw}". Please enter a valid number.`);
    return null;
  }
  return parsed;
}
