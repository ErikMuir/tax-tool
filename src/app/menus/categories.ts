import { removeCategoryMenu } from "./remove-category.js";
import { addCategory, listCategories } from "../actions/setup.js";
import { noOp, quickExit } from "../actions/utility.js";
import { ActionType, getUI, MenuOptions } from "../../utils/ui.js";
import { EntryType } from "../../utils/repo.js";

export async function categoriesMenu(menuStack: string[], categoryType?: EntryType): Promise<void> {
  const ui = getUI();
  const options: MenuOptions = {};
  const newStack = [...menuStack, categoryType || "Categories"];
  options["0"] = { name: "Back", type: ActionType.GoBack, action: noOp };
  if (!categoryType) {
    options["1"] = { name: "Income", type: ActionType.Stay, action: async () => categoriesMenu(newStack, "Income") };
    options["2"] = { name: "Expense", type: ActionType.Stay, action: async () => categoriesMenu(newStack, "Expense") };
  } else {
    options["1"] = { name: "List", type: ActionType.Stay, action: async () => listCategories(categoryType) };
    options["2"] = { name: "Add", type: ActionType.Stay, action: async () => addCategory(categoryType) };
    options["3"] = { name: "Remove", type: ActionType.Stay, action: async () => removeCategoryMenu(newStack, categoryType) };
  }
  options["q"] = { name: "Quit", type: ActionType.Exit, action: quickExit };
  await ui.menu(newStack, options);
}
