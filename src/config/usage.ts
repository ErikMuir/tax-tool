import commandLineUsage, { type Section } from "command-line-usage";
import { optionDefinitions } from "./options.js";

const usageSections: Section[] = [
  {
    header: "Tool-99",
    content: "For tracking 1099 income/expenses to simplify tax filing.",
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
];

let usage: string | undefined;

export function getUsage(): string {
  if (!usage) {
    try {
      usage = commandLineUsage(usageSections);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  }
  return usage;
}
