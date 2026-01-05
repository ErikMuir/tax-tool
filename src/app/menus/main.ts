import { ledgerEntry } from "../actions/ledger.js";
import { reportsMenu } from "./reports.js";
import { setupMenu } from "./setup.js";
import { quickExit } from "../actions/utility.js";
import { ActionType, getUI, MenuOptions } from "../../utils/ui.js";

export async function mainMenu(stack: string[] = []) {
  const ui = getUI();
  const newStack = [...stack, "Main"];
  const options: MenuOptions = {
    "1": { name: "Ledger", action: ledgerEntry, type: ActionType.Stay },
    "2": { name: "Reports", action: async () => reportsMenu(newStack), type: ActionType.Stay },
    "3": { name: "Setup", action: async () => setupMenu(newStack), type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  }
  await ui.menu(newStack, options);
}
