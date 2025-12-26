import { UserInterface } from "../utils/user-interface.js";

export type MenuAction = (ui: UserInterface) => Promise<void>;

export type MenuOption = {
  name: string;
  action: MenuAction;
  isExitOption?: boolean;
};

export type MenuOptions = Record<string, MenuOption>;

export class Menu {
  private ui: UserInterface;
  private title: string;
  private options: MenuOptions;

  constructor(ui: UserInterface, title: string, options: MenuOptions) {
    this.ui = ui;
    this.title = title;
    this.options = options;
  }

  async run(): Promise<void> {
    let exit = false;
    while (!exit) {
      const selectedOption = await this.ui.menu(this.title, this.options);
      await selectedOption.action(this.ui);
      if (selectedOption.isExitOption) {
        exit = true;
      }
    }
  }
}

export const noOp = async () => {};

export const notImplemented = async (ui: UserInterface) => {
  await ui.warn("Not implemented.").lineFeed().continue();
};
