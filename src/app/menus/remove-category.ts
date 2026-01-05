import { EntryType, getRepo } from "../../utils/repo.js";
import { ActionType, getUI, MenuOptions } from "../../utils/ui.js";
import { removeCategory } from "../actions/setup.js";
import { noOp } from "../actions/utility.js";

export async function removeCategoryMenu(menuStack: string[], categoryType: EntryType): Promise<void> {
  const ui = getUI();
  const repo = getRepo();
  const categories = repo.getCategories(categoryType);
  if (categories.length === 0) {
    ui.warning(`No ${categoryType} categories to delete.`);
    await ui.continue();
    return;
  }
  const options: MenuOptions = { "0": { name: "Cancel", type: ActionType.GoBack, action: noOp } };
  categories.forEach((category, index) => {
    options[(index + 1).toString()] = {
      name: category,
      type: ActionType.GoBack,
      action: async () => removeCategory(categoryType, category),
    };
  });
  await ui.menu([...menuStack, "Remove"], options);
}
