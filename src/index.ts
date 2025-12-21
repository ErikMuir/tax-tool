import { getOptions } from "./config/options.js";
import { getUsage } from "./config/usage.js";

if (getOptions().help) {
  const usage = getUsage();
  console.log(usage);
  process.exit(0);
}

console.log(getOptions());
