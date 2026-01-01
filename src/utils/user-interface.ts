import * as readline from "readline";
import { ActionType, MenuOption, MenuOptions } from "../menus/shared.js";

export type Color = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "grey";

export const ColorCodes: Record<Color, string> = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  grey: "\x1b[90m",
};

export type WriteOptions = {
  color?: Color | undefined;
  inline?: boolean | undefined;
};

export const inline: WriteOptions = { inline: true };

let userInterface: UserInterface | null = null;
export function getUserInterface(): UserInterface {
  if (!userInterface) {
    userInterface = new UserInterface();
  }
  return userInterface;
}

class UserInterface {
  private NC: string = "\x1b[0m";
  private rl: readline.Interface;
  private disposed = false;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  dispose(): void {
    if (this.disposed) return;
    if (this.rl) this.rl.close();
    this.disposed = true;
  }

  write = (data: string | object, options: WriteOptions = {}): UserInterface => {
    if (typeof data !== "string") data = JSON.stringify(data);
    if (options.color) data = `${ColorCodes[options.color]}${data}${this.NC}`;
    if (!options.inline) data += "\n";
    process.stdout.write(data);
    return this;
  }

  info = (data: string | object, inline?: boolean): UserInterface => {
    return this.write(data, { color: "cyan", inline });
  }

  success = (data: string | object, inline?: boolean): UserInterface => {
    return this.write(data, { color: "green", inline });
  }

  warning = (data: string | object, inline?: boolean): UserInterface => {
    return this.write(data, { color: "yellow", inline });
  }

  error = (data: string | object, inline?: boolean): UserInterface => {
    return this.write(data, { color: "red", inline });
  }

  log = (data: string | object, inline?: boolean): UserInterface => {
    return this.write(data, { color: "grey", inline });
  }

  lineFeed = (lineCount: number = 1): UserInterface => {
    for (let i = 0; i < lineCount; i++) {
      this.write("");
    }
    return this;
  };

  continue = async (message = "Press Enter to continue..."): Promise<UserInterface> => {
    this._ensureNotDisposed();
    this.lineFeed().write(message, { inline: true });
    return new Promise((resolve) => {
      this.rl.once("line", () => {
        resolve(this);
      });
    });
  };

  confirm = async (message: string, defaultOption: boolean): Promise<boolean> => {
    this._ensureNotDisposed();
    const options = defaultOption ? "[Y/n]" : "[y/N]";
    this.write(`${message} ${options}: `, inline);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        const response = line.trim().toLowerCase() || (defaultOption ? "y" : "n");
        resolve(response === "y" || response === "yes");
      });
    });
  };

  prompt = async (message: string): Promise<string> => {
    this._ensureNotDisposed();
    const normalizedMessage = this._normalizePromptMessage(message);
    this.write(`${normalizedMessage}: `, inline);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        resolve(line.trim());
      });
    });
  };

  choose = async (message: string, choices: string[]): Promise<string> => {
    this._ensureNotDisposed();
    const normalizedMessage = this._normalizePromptMessage(message);
    choices.forEach((choice, index) => {
      this
        .lineFeed()
        .write(`  ${index + 1}`, { color: "cyan", inline: true })
        .write(" -> ", { color: "grey", inline: true })
        .write(choice);
    });
    this.lineFeed().write(`${normalizedMessage}: `, inline);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        const choiceIndex = parseInt(line.trim(), 10) - 1;
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
          resolve(choices[choiceIndex]!);
        } else {
          this.write("Invalid option selected.", { color: "red" });
          resolve(this.choose(message, choices));
        }
      });
    });
  }

  menu = async (stack: string[], options: MenuOptions): Promise<void> => {
    this._ensureNotDisposed();
    const title = stack.length > 0 ? stack.join(" > ") : "Menu";
    let exit = false;
    while (!exit) {
      const { action, type } = await this._menu(title, options);
      await action();
      exit = type === ActionType.GoBack || type === ActionType.Exit;
    }
  }

  private async _menu(title: string, options: MenuOptions): Promise<MenuOption> {
    this._ensureNotDisposed();
    const separatorLine = "-".repeat(title.length + 2);
    this.lineFeed().write(separatorLine).write(` ${title} `).write(separatorLine);
    for (const [key, option] of Object.entries(options)) {
      const color = option.type === ActionType.Exit ? "red" : key === "0" ? "grey" : undefined;
      this.write(key, { color: color || "cyan", inline: true })
        .write(" -> ", { color: "grey", inline: true })
        .write(option.name, { color: color });
    }
    this.lineFeed().write("Select an option: ", inline);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        const choice = line.trim();
        if (options.hasOwnProperty(choice)) {
          resolve(options[choice]!);
        } else {
          this.write("Invalid option selected.", { color: "red" });
          resolve(this._menu(title, options));
        }
      });
    });
  };

  private _ensureNotDisposed(): void {
    if (this.disposed) {
      throw new Error("UserInterface has been disposed.");
    }
  }

  private _normalizePromptMessage(message: string): string {
    return message.replace(/[:\s]+$/, "");
  }
}
