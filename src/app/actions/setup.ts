import { EntryType, getRepo } from "../../utils/repo.js";
import { getPercentageInput } from "./utility.js";
import { getUI } from "../../utils/ui.js";

export async function taxRate(): Promise<void> {
  const ui = getUI();
  const repo = getRepo();
  const currentTaxRate = repo.getTaxRate();
  ui.lineFeed().write(`Current tax rate: ${currentTaxRate}%`);
  const rate = await getPercentageInput("New tax rate (leave blank to keep the current value)");
  if (rate === null) return;
  repo.setTaxRate(rate);
  ui.log(`Tax rate set to ${rate}%.`);
  await ui.continue();
}

export async function retirementRate(): Promise<void> {
  const ui = getUI();
  const repo = getRepo();
  const currentRetirement = repo.getRetirementRate();
  ui.lineFeed().write(`Current retirement contribution percentage: ${currentRetirement}%`);
  const rate = await getPercentageInput("New retirement contribution percentage (leave blank to keep the current value)");
  if (rate === null) return;
  repo.setRetirementRate(rate);
  ui.log(`Retirement contribution percentage set to ${rate}%.`);
  await ui.continue();
}

export async function listCategories(categoryType: EntryType): Promise<void> {
  const ui = getUI();
  const categories = getRepo().getCategories(categoryType);
  ui.lineFeed().write(`${categoryType} Categories:`);
  if (categories.length === 0) {
    ui.write(`  (No ${categoryType} categories defined)`);
  }
  categories.forEach((category) => ui.write(`  - ${category}`));
  await ui.continue();
}

export async function addCategory(categoryType: EntryType): Promise<void> {
  const ui = getUI();
  const repo = getRepo();
  const category = await ui.prompt("New Category Name");
  repo.addCategory(categoryType, category);
  ui.log(`"${category}" added to ${categoryType} categories.`);
  await ui.continue();
}

export async function removeCategory(categoryType: EntryType, category: string): Promise<void> {
  const ui = getUI();
  const repo = getRepo();
  repo.removeCategory(categoryType, category);
  ui.log(`"${category}" removed from ${categoryType} categories.`);
  await ui.continue();
}
