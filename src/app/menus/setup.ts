import { categoriesMenu } from "./categories.js";
import { retirementRate, taxRate } from "../actions/setup.js";
import { noOp, quickExit } from "../actions/utility.js";
import { ActionType, getUI, MenuOptions } from "../../utils/ui.js";

export async function setupMenu(stack: string[]): Promise<void> {
  const ui = getUI();
  const newStack = [...stack, "Setup"];
  const options: MenuOptions = {
    "0": { name: "Back", type: ActionType.GoBack, action: noOp },
    "1": { name: "Categories", type: ActionType.Stay, action: () => categoriesMenu(newStack) },
    "2": { name: "Tax Rate", type: ActionType.Stay, action: taxRate },
    "3": { name: "Retirement", type: ActionType.Stay, action: retirementRate },
    "q": { name: "Quit", type: ActionType.Exit, action: quickExit },
  };
  await ui.menu(newStack, options);
}
