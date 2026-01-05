import * as readline from "readline";

export type Color = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "grey";

export type MenuAction = () => Promise<void>;

export enum ActionType { Stay, GoBack, Exit }

export type MenuOption = {
  name: string;
  action: MenuAction;
  type: ActionType;
};

export type MenuOptions = Record<string, MenuOption>;

export type VerticalBorderChar = "|" | "*" | "#" | ":";

export type HorizontalBorderChar = "-" | "=" | "~" | "*" | "#";

export type BannerConfig = {
  color?: Color | undefined;
  borderColor?: Color | undefined;
  verticalBorderChar?: VerticalBorderChar | undefined;
  horizontalBorderChar?: HorizontalBorderChar | undefined;
};

export type WriteOptions = {
  color?: Color | undefined;
  inline?: boolean | undefined;
};

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

export const inline: WriteOptions = { inline: true };

let userInterface: UserInterface | null = null;
export function getUI(): UserInterface {
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

  writeIf = (condition: boolean, data: string | object, options: WriteOptions = {}): UserInterface => {
    if (!condition) return this;
    return this.write(data, options);
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
        .write(`${index + 1}`, { color: "cyan", inline: true })
        .write(" -> ", { color: "grey", inline: true })
        .write(choice);
    });
    this.write(`${normalizedMessage}: `, inline);
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
  };

  bannerOld = (message: string, config: BannerConfig = {}): void => {
    const color = config.color;
    const borderColor = config.borderColor || color;
    const hChar = config.horizontalBorderChar || "-";
    const vChar = config.verticalBorderChar || "";
    const hBorder = hChar.repeat(message.length + 2 + (vChar.length * 2));
    this.lineFeed()
      .write(hBorder, { color: borderColor })
      .write(vChar, { color: borderColor, inline: true })
      .write(` ${message} `, { color: color, inline: true })
      .write(vChar, { color: borderColor })
      .write(hBorder, { color: borderColor });
  };

  banner = (stack: string[], config: BannerConfig = {}): void => {
    const color = config.color;
    const borderColor = config.borderColor || color;
    const hChar = config.horizontalBorderChar || "-";
    const vChar = config.verticalBorderChar || "";
    const message = stack.length > 0 ? stack.join(" > ") : "";
    const hBorder = hChar.repeat(message.length + 2 + (vChar.length * 2));
    this.lineFeed()
      .write(hBorder, { color: borderColor })
      .write(vChar, { color: borderColor, inline: true })
      .write(" ", inline);
    stack.forEach((part, index) => {
      const color = index === stack.length - 1 ? config.color : "grey";
      const inline = true;
      this.write(part, { color, inline })
        .writeIf(index < stack.length - 1, " > ", { color: "cyan", inline });
    });
    this.write(" ", inline)
      .write(vChar, { color: borderColor })
      .write(hBorder, { color: borderColor });
  };

  menu = async (stack: string[], options: MenuOptions, config?: BannerConfig): Promise<void> => {
    this._ensureNotDisposed();
    let exit = false;
    while (!exit) {
      const { action, type } = await this._menu(stack, options, config);
      await action();
      exit = type === ActionType.GoBack || type === ActionType.Exit;
    }
  };

  private async _menu(stack: string[], options: MenuOptions, config?: BannerConfig): Promise<MenuOption> {
    this._ensureNotDisposed();
    this.banner(stack, config);
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
          resolve(this._menu(stack, options, config));
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
