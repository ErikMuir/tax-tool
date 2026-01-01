import { getUserInterface } from "../utils/user-interface.js";
import { ActionType, MenuOptions, noOp, notImplemented, quickExit } from "./shared.js";

export async function reportsMenu(stack: string[]): Promise<void> {
  const ui = getUserInterface();
  const newStack = [...stack, "Reports"];
  const options: MenuOptions = {
    "0": { name: "Back", action: noOp, type: ActionType.GoBack },
    "1": { name: "Current Quarter", action: currentQuarterReport, type: ActionType.Stay },
    "2": { name: "Current Year", action: currentYearReport, type: ActionType.Stay },
    "3": { name: "Specific Quarter", action: specificQuarterReport, type: ActionType.Stay },
    "4": { name: "Specific Year", action: specificYearReport, type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  };
  await ui.menu(newStack, options);
}

async function currentQuarterReport(): Promise<void> {
  return notImplemented();
}

async function currentYearReport(): Promise<void> {
  return notImplemented();
}

async function specificQuarterReport(): Promise<void> {
  return notImplemented();
}

async function specificYearReport(): Promise<void> {
  return notImplemented();
}
