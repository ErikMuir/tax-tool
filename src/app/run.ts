import { mainMenu } from "./menus/main.js";

export async function run(): Promise<void> {
  await mainMenu();
}
