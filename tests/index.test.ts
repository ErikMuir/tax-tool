import { describe, it } from "node:test";
import assert from "node:assert";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = join(__dirname, "../dist/index.js");

/**
 * Helper function to run the CLI and capture output
 */
function runCLI(args: string[] = []): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  return new Promise((resolve) => {
    const child = spawn("node", [indexPath, ...args]);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode || 0 });
    });
  });
}

describe("CLI", () => {
  describe("help flag", () => {
    it("should display usage when --help flag is provided", async () => {
      const { stdout, exitCode } = await runCLI(["--help"]);

      assert.strictEqual(exitCode, 0);
      assert.ok(stdout.includes("Tool-99"));
      assert.ok(
        stdout.includes(
          "For tracking 1099 income/expenses to simplify tax filing."
        )
      );
      assert.ok(stdout.includes("Options"));
      assert.ok(stdout.includes("Display this usage guide."));
    });

    it("should display usage when -h flag is provided", async () => {
      const { stdout, exitCode } = await runCLI(["-h"]);

      assert.strictEqual(exitCode, 0);
      assert.ok(stdout.includes("Tool-99"));
      assert.ok(stdout.includes("Options"));
    });

    it("should exit with code 0 after displaying help", async () => {
      const { exitCode } = await runCLI(["--help"]);

      assert.strictEqual(exitCode, 0);
    });
  });

  describe("default behavior", () => {
    it("should parse and display options when no help flag is provided", async () => {
      const { stdout, exitCode } = await runCLI([]);

      assert.strictEqual(exitCode, 0);
      // Should output the options object
      assert.ok(stdout.includes("{"));
    });
  });

  describe("error handling", () => {
    it("should handle unknown flags", async () => {
      const { stderr, exitCode } = await runCLI(["--unknown-flag"]);

      // Should exit with error code
      assert.strictEqual(exitCode, 1);
      // Should output an error message
      assert.ok(stderr.length > 0);
    });
  });
});
