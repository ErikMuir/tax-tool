import { EntryType } from "../data/models.js";
import { getRepo } from "../data/repo.js";
import { getUserInterface } from "../utils/user-interface.js";
import { MenuOptions, noOp, ActionType, quickExit } from "./shared.js";

export async function categoriesMenu(categoryType?: EntryType): Promise<void> {
  const ui = getUserInterface();
  const options: MenuOptions = {};
  let title = "Categories";
  if (!categoryType) {
    options["1"] = { name: "Income", action: async () => categoriesMenu("Income"), type: ActionType.GoBack };
    options["2"] = { name: "Expense", action: async () => categoriesMenu("Expense"), type: ActionType.GoBack };
  } else {
    title = `${categoryType} Categories`;
    options["0"] = { name: "Back", action: noOp, type: ActionType.GoBack };
    options["1"] = { name: "List", action: () => listCategories(categoryType), type: ActionType.Stay };
    options["2"] = { name: "Add", action: () => addCategory(categoryType), type: ActionType.Stay };
    options["3"] = { name: "Remove", action: () => removeCategory(categoryType), type: ActionType.Stay };
    options["q"] = { name: "Quit", action: quickExit, type: ActionType.Exit };
  }
  await ui.menu(title, options);
}

async function listCategories(categoryType: EntryType): Promise<void> {
  const ui = getUserInterface();
  const repo = getRepo();
  const categories = repo.getCategories(categoryType);
  ui.lineFeed().write(`${categoryType} Categories:`);
  if (categories.length === 0) {
    ui.write(`  (No ${categoryType} categories defined)`);
  }
  categories.forEach((category) => ui.write(`  - ${category}`));
  await ui.continue();
}

async function addCategory(categoryType: EntryType): Promise<void> {
  const ui = getUserInterface();
  const repo = getRepo();
  const category = await ui.prompt("New Category Name");
  repo.addCategory(categoryType, category);
  ui.log(`"${category}" added to ${categoryType} categories.`);
  await ui.continue();
}

async function removeCategory(categoryType: EntryType): Promise<void> {
  const ui = getUserInterface();
  const repo = getRepo();
  const categories = repo.getCategories(categoryType);
  if (categories.length === 0) {
    ui.warning(`No ${categoryType} categories to delete.`);
    await ui.continue();
    return;
  }
  const options: MenuOptions = { "0": { name: "Cancel", action: noOp, type: ActionType.GoBack } };
  categories.forEach((category, index) => {
    options[(index + 1).toString()] = {
      name: category,
      action: async () => {
        repo.removeCategory(categoryType, category);
        ui.log(`"${category}" removed from ${categoryType} categories.`);
        await ui.continue();
      },
      type: ActionType.GoBack,
    };
  });
  await ui.menu(`Delete ${categoryType} Category`, options);
}
