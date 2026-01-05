import { ActionType, getUI, MenuOptions } from "../../utils/ui.js";
import { currentQuarterReport, currentYearReport, specificQuarterReport, specificYearReport } from "../actions/reports.js";
import { noOp, quickExit } from "../actions/utility.js";

export async function reportsMenu(stack: string[]): Promise<void> {
  const ui = getUI();
  const newStack = [...stack, "Reports"];
  const options: MenuOptions = {
    "0": { name: "Back", type: ActionType.GoBack, action: noOp },
    "1": { name: "Current Quarter", type: ActionType.Stay, action: currentQuarterReport },
    "2": { name: "Current Year", type: ActionType.Stay, action: currentYearReport },
    "3": { name: "Specific Quarter", type: ActionType.Stay, action: specificQuarterReport },
    "4": { name: "Specific Year", type: ActionType.Stay, action: specificYearReport },
    "q": { name: "Quit", type: ActionType.Exit, action: quickExit },
  };
  await ui.menu(newStack, options);
}
