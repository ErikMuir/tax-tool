import { getOptions } from "./config/options.js";
import { getUsage } from "./config/usage.js";
import { mainMenu } from "./menus/main.js";
import { UserInterface } from "./utils/user-interface.js";

const ui = new UserInterface();
const options = getOptions();

// Set up cleanup handlers
process.on("exit", () => ui.dispose());
process.on("SIGINT", () => {
  ui.dispose();
  process.exit(130);
});

// Handle help option
if (options.help) {
  const usage = getUsage();
  ui.write(usage);
  ui.dispose();
  process.exit(0);
}

// Display parsed options for confirmation
ui.write(`options: ${JSON.stringify(options)}`);

try {
  await mainMenu(ui);
} catch (err) {
  ui.error(`An unexpected error occurred: ${(err as Error).message}`);
} finally {
  ui.dispose();
}
