import { Menu, MenuOptions, noOp, notImplemented } from "../utils/menu.js";
import { UserInterface } from "../utils/user-interface.js";

const mainMenuOptions: MenuOptions = {
  "1": { name: "Ledger", action: ledgerMenu },
  "2": { name: "Reports", action: reportsMenu },
  "3": { name: "Config", action: configMenu },
  q: { name: "Quit", action: noOp, isExitOption: true },
};

const ledgerMenuOptions: MenuOptions = {
  "1": { name: "Add", action: notImplemented },
  "2": { name: "Update", action: notImplemented },
  "3": { name: "Delete", action: notImplemented },
  b: { name: "Back", action: noOp, isExitOption: true },
};

const reportsMenuOptions: MenuOptions = {
  "1": { name: "Current Quarter", action: notImplemented },
  "2": { name: "Current Year", action: notImplemented },
  "3": { name: "Specific Quarter", action: notImplemented },
  "4": { name: "Specific Year", action: notImplemented },
  b: { name: "Back", action: noOp, isExitOption: true },
};

const configMenuOptions: MenuOptions = {
  "1": { name: "Categories", action: categoriesMenu },
  "2": { name: "Tax Rate", action: notImplemented },
  "3": { name: "Retirement", action: notImplemented },
  b: { name: "Back", action: noOp, isExitOption: true },
};

const categoriesMenuOptions: MenuOptions = {
  "1": { name: "List Income Categories", action: notImplemented },
  "2": { name: "List Expense Categories", action: notImplemented },
  "3": { name: "Add Category", action: notImplemented },
  "4": { name: "Remove Category", action: notImplemented },
  "5": { name: "Update Category", action: notImplemented },
  b: { name: "Back", action: noOp, isExitOption: true },
};

export async function mainMenu(ui: UserInterface) {
  const menu = new Menu(ui, "Main Menu", mainMenuOptions);
  await menu.run();
}

async function configMenu(ui: UserInterface) {
  const menu = new Menu(ui, "Configuration Menu", configMenuOptions);
  await menu.run();
}

async function ledgerMenu(ui: UserInterface) {
  const menu = new Menu(ui, "Ledger Menu", ledgerMenuOptions);
  await menu.run();
}

async function reportsMenu(ui: UserInterface) {
  const menu = new Menu(ui, "Reports Menu", reportsMenuOptions);
  await menu.run();
}

async function categoriesMenu(ui: UserInterface) {
  const menu = new Menu(ui, "Categories Menu", categoriesMenuOptions);
  await menu.run();
}
