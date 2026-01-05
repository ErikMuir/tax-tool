import { getUI } from "./utils/ui.js";
const ui = getUI();

// Set up cleanup handlers
process.on("exit", () => ui.dispose());
process.on("SIGINT", () => {
  ui.log("\nProcess interrupted. Disposing, then exiting...");
  ui.dispose();
  process.exit(130);
});

// Parse command line options
import { getOptions } from "./config/options.js";
const options = getOptions();

// Handle help option
import { getUsage } from "./config/usage.js";
if (options.help) {
  const usage = getUsage();
  ui.write(usage);
  ui.dispose();
  process.exit(0);
}

// Display parsed options for visual confirmation
ui.write(`options: ${JSON.stringify(options)}`);

// Run the interactive app
import { run } from "./app/run.js";
try {
  await run();
} catch (err) {
  ui.error(`An unexpected error occurred: ${(err as Error).message}`);
} finally {
  ui.dispose();
}
