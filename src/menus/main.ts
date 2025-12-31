import { ActionType, MenuOptions } from "./shared.js";
import { ledgerMenu } from "./ledger.js";
import { reportsMenu } from "./reports.js";
import { setupMenu } from "./setup.js";
import { quickExit } from "./shared.js";
import { getUserInterface } from "../utils/user-interface.js";

export async function mainMenu() {
  const ui = getUserInterface();
  const options: MenuOptions = {
    "1": { name: "Ledger", action: ledgerMenu, type: ActionType.Stay },
    "2": { name: "Reports", action: reportsMenu, type: ActionType.Stay },
    "3": { name: "Setup", action: setupMenu, type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  }
  await ui.menu("Main Menu", options);
}
