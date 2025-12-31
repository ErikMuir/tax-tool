import { getUserInterface } from "../utils/user-interface.js";

export const noOp = async () => { };

export const quickExit = async () => {
  getUserInterface().lineFeed().write("Exiting...").lineFeed();
  process.exit(0);
};

export const notImplemented = async () => {
  await getUserInterface().write("Not implemented.", { color: "yellow" }).continue();
};

export type MenuAction = () => Promise<void>;

export enum ActionType { Stay, GoBack, Exit }

export type MenuOption = {
  name: string;
  action: MenuAction;
  type: ActionType;
};

export type MenuOptions = Record<string, MenuOption>;
