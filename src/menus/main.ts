import { ActionType, MenuOptions } from "./shared.js";
import { ledgerMenu } from "./ledger.js";
import { reportsMenu } from "./reports.js";
import { setupMenu } from "./setup.js";
import { quickExit } from "./shared.js";
import { getUserInterface } from "../utils/user-interface.js";

export async function mainMenu(stack: string[] = []) {
  const ui = getUserInterface();
  const newStack = [...stack, "Main"];
  const options: MenuOptions = {
    "1": { name: "Ledger", action: () => ledgerMenu(newStack), type: ActionType.Stay },
    "2": { name: "Reports", action: () => reportsMenu(newStack), type: ActionType.Stay },
    "3": { name: "Setup", action: () => setupMenu(newStack), type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  }
  await ui.menu(newStack, options);
}
