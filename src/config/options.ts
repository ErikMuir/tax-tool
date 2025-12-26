import commandLineArgs, { type CommandLineOptions } from "command-line-args";
import type { OptionDefinition } from "command-line-usage";

export const optionDefinitions: OptionDefinition[] = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide.",
    defaultValue: false,
  },
  {
    name: "debug",
    alias: "d",
    type: Boolean,
    description: "Enable debug output.",
    defaultValue: false,
  },
];

let options: CommandLineOptions | undefined;

export function getOptions(): CommandLineOptions {
  if (!options) {
    try {
      options = commandLineArgs(optionDefinitions);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  }
  return options;
}
