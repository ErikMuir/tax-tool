import { getUserInterface } from "../utils/user-interface.js";
import { ActionType, MenuOptions } from "./shared.js";
import { noOp, notImplemented, quickExit } from "./shared.js";

export async function ledgerMenu(stack: string[]): Promise<void> {
  const ui = getUserInterface();
  const newStack = [...stack, "Ledger"];
  const options: MenuOptions = {
    "0": { name: "Back", action: noOp, type: ActionType.GoBack },
    "1": { name: "Add", action: addEntry, type: ActionType.Stay },
    "2": { name: "Update", action: updateEntry, type: ActionType.Stay },
    "3": { name: "Delete", action: deleteEntry, type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  };
  await ui.menu(newStack, options);
}

async function addEntry(): Promise<void> {
  return notImplemented();
}

async function updateEntry(): Promise<void> {
  return notImplemented();
}

async function deleteEntry(): Promise<void> {
  return notImplemented();
}
