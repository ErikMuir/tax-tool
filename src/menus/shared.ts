import { getUserInterface } from "../utils/user-interface.js";

export type MenuAction = () => Promise<void>;

export enum ActionType { Stay, GoBack, Exit }

export type MenuOption = {
  name: string;
  action: MenuAction;
  type: ActionType;
};

export type MenuOptions = Record<string, MenuOption>;

export const noOp = async () => { };

export const quickExit = async () => {
  getUserInterface().lineFeed().write("Exiting...").lineFeed();
  process.exit(0);
};

export const notImplemented = async () => {
  await getUserInterface().write("Not implemented.", { color: "yellow" }).continue();
};

export async function getPercentageInput(promptMessage: string): Promise<number | null> {
  const ui = getUserInterface();
  const raw = await ui.prompt(`${promptMessage} (leave blank to keep the current value)`);
  const formatted = raw.replaceAll("%", "").trim();
  if (formatted === "") {
    ui.log("Value unchanged.");
    await ui.continue();
    return null;
  }
  const parsed = Number(formatted);
  if (isNaN(parsed) || parsed < 0 || parsed > 100) {
    ui.error(`Invalid value: ${parsed}. Must be a number between 0 and 100.`);
    return null;
  }
  return parsed < 1 ? parsed * 100 : parsed;
}
