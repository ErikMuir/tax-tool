import { getRepo } from "../data/repo.js";
import { getUserInterface } from "../utils/user-interface.js";
import { categoriesMenu } from "./categories.js";
import { ActionType, getPercentageInput, MenuOptions, noOp, quickExit } from "./shared.js";

export async function setupMenu(): Promise<void> {
  const ui = getUserInterface();
  const options: MenuOptions = {
    "0": { name: "Back", action: noOp, type: ActionType.GoBack },
    "1": { name: "Categories", action: categoriesMenu, type: ActionType.Stay },
    "2": { name: "Tax Rate", action: taxRate, type: ActionType.Stay },
    "3": { name: "Retirement", action: retirementRate, type: ActionType.Stay },
    "q": { name: "Quit", action: quickExit, type: ActionType.Exit },
  };
  await ui.menu("Setup Menu", options);
}

async function taxRate(): Promise<void> {
  const ui = getUserInterface();
  const repo = getRepo();
  const currentTaxRate = repo.getTaxRate();
  ui.lineFeed().write(`Current tax rate: ${currentTaxRate}%`);
  const rate = await getPercentageInput("New tax rate");
  if (rate === null) return;
  repo.setTaxRate(rate);
  ui.log(`Tax rate set to ${rate}%.`);
  await ui.continue();
}

async function retirementRate(): Promise<void> {
  const ui = getUserInterface();
  const repo = getRepo();
  const currentRetirement = repo.getRetirementRate();
  ui.lineFeed().write(`Current retirement contribution percentage: ${currentRetirement}%`);
  const rate = await getPercentageInput("New retirement contribution percentage");
  if (rate === null) return;
  repo.setRetirementRate(rate);
  ui.log(`Retirement contribution percentage set to ${rate}%.`);
  await ui.continue();
}
