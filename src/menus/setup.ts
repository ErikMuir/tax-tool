import { categoriesMenu } from "./categories.js";
import { ActionType, MenuOptions, noOp, notImplemented, quickExit } from "./shared.js";
import { getUserInterface } from "../utils/user-interface.js";

export async function setupMenu(): Promise<void> {
  const ui = getUserInterface();
  const options: MenuOptions = {
    "0": { name: "Back", action: noOp, type: ActionType.GoBack },
    "1": { name: "Categories", action: categoriesMenu, type: ActionType.Stay },
    "2": { name: "Tax Rate", action: setTaxRate, type: ActionType.Stay },
    "3": { name: "Retirement", action: setRetirement, type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  };
  await ui.menu("Setup Menu", options);
}

async function setTaxRate(): Promise<void> {
  return notImplemented();
}

async function setRetirement(): Promise<void> {
  return notImplemented();
}
