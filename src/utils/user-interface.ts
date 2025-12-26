import * as readline from "readline";
import { MenuOption, MenuOptions } from "./menu.js";

export const Colors: Record<string, string> = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  grey: "\x1b[90m",
};

export class UserInterface {
  private NC: string = "\x1b[0m";
  private currentColor?: string | undefined;
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

  setColor = (color: keyof typeof Colors): UserInterface => {
    this.currentColor = Colors[color];
    return this;
  };

  resetColor = (): UserInterface => {
    this.currentColor = undefined;
    return this;
  };

  log = (data: string | object): UserInterface => {
    this._write(data, Colors.grey);
    return this;
  };

  write = (data: string | object, preventNewline: boolean = false): UserInterface => {
    this._write(data, this.currentColor, preventNewline);
    return this;
  };

  info = (data: string | object, preventNewline: boolean = false): UserInterface => {
    this._write(data, Colors.cyan, preventNewline);
    return this;
  };

  success = (data: string | object, preventNewline: boolean = false): UserInterface => {
    this._write(data, Colors.green, preventNewline);
    return this;
  };

  warn = (data: string | object, preventNewline: boolean = false): UserInterface => {
    this._write(data, Colors.yellow, preventNewline);
    return this;
  };

  error = (data: string | object, preventNewline: boolean = false): UserInterface => {
    this._write(data, Colors.red, preventNewline);
    return this;
  };

  lineFeed = (lineCount: number = 1): UserInterface => {
    for (let i = 0; i < lineCount; i++) {
      this.write("");
    }
    return this;
  };

  separator = (preventNewline: boolean = false): UserInterface => {
    return this.info("» ", true).success("» ", true).warn("» ", true).error("» ", preventNewline);
  };

  continue = async (message = "Press Enter to continue..."): Promise<UserInterface> => {
    this._ensureNotDisposed();
    this.write(message, true);
    return new Promise((resolve) => {
      this.rl.once("line", () => {
        resolve(this);
      });
    });
  };

  confirm = async (message: string, defaultOption: boolean): Promise<boolean> => {
    this._ensureNotDisposed();
    const options = defaultOption ? "[Y/n]" : "[y/N]";
    this.write(`${message} ${options}: `, true);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        const response = line.trim().toLowerCase() || (defaultOption ? "y" : "n");
        resolve(response === "y" || response === "yes");
      });
    });
  };

  prompt = async (message: string): Promise<string> => {
    this._ensureNotDisposed();
    this.write(`${message}: `, true);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        resolve(line.trim());
      });
    });
  };

  menu = async (message: string, options: MenuOptions): Promise<MenuOption> => {
    this._ensureNotDisposed();
    this.lineFeed().write(message);
    for (const [key, opt] of Object.entries(options)) {
      this.info(`  ${key} -> `, true).write(opt.name);
    }
    this.lineFeed().write("Select an option: ", true);
    return new Promise((resolve) => {
      this.rl.once("line", (line) => {
        const choice = line.trim();
        if (options.hasOwnProperty(choice)) {
          resolve(options[choice]!);
        } else {
          this.error("Invalid option selected.");
          resolve(this.menu(message, options));
        }
      });
    });
  };

  private _write = (data: string | object, colorCode?: string, preventNewline?: boolean): void => {
    if (typeof data !== "string") data = JSON.stringify(data);
    if (colorCode) data = `${colorCode}${data}${this.NC}`;
    if (!preventNewline) data += "\n";
    process.stdout.write(data);
  };

  private _ensureNotDisposed(): void {
    if (this.disposed) {
      throw new Error("UserInterface has been disposed.");
    }
  }
}
