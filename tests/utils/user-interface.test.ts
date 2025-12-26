import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { UserInterface } from "../../dist/utils/user-interface.js";

describe("UserInterface", () => {
  let originalStdoutWrite: typeof process.stdout.write;
  let writtenOutput: string[];
  let ui: UserInterface;

  beforeEach(() => {
    writtenOutput = [];
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = (str: string): boolean => {
      writtenOutput.push(str);
      return true;
    };

    // Create a fresh instance for each test
    ui = new UserInterface();
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
    // Clean up
    ui.dispose();
  });

  describe("constructor", () => {
    it("should create a UserInterface instance", () => {
      assert.ok(ui);
      assert.strictEqual(typeof ui.write, "function");
      assert.strictEqual(typeof ui.info, "function");
      assert.strictEqual(typeof ui.success, "function");
      assert.strictEqual(typeof ui.warn, "function");
      assert.strictEqual(typeof ui.error, "function");
    });

    it("should create independent instances", () => {
      const ui1 = new UserInterface();
      const ui2 = new UserInterface();
      assert.notStrictEqual(ui1, ui2);
      ui1.dispose();
      ui2.dispose();
    });
  });

  describe("write", () => {
    it("should write string data to stdout with newline", () => {
      ui.write("test message");

      assert.strictEqual(writtenOutput.length, 1);
      assert.strictEqual(writtenOutput[0], "test message\n");
    });

    it("should write object data as JSON to stdout", () => {
      const testObj = { key: "value", num: 42 };
      ui.write(testObj);

      assert.strictEqual(writtenOutput.length, 1);
      assert.strictEqual(writtenOutput[0], JSON.stringify(testObj) + "\n");
    });

    it("should not add newline when preventNewline is true", () => {
      ui.write("test", true);

      assert.strictEqual(writtenOutput.length, 1);
      assert.strictEqual(writtenOutput[0], "test");
    });

    it("should return UserInterface instance for chaining", () => {
      const result = ui.write("test");
      assert.strictEqual(result, ui);
    });
  });

  describe("info", () => {
    it("should write cyan colored output", () => {
      ui.info("info message");

      assert.strictEqual(writtenOutput.length, 1);
      assert.ok(writtenOutput[0]?.includes("\x1b[36m")); // cyan color code
      assert.ok(writtenOutput[0]?.includes("info message"));
      assert.ok(writtenOutput[0]?.includes("\x1b[0m")); // reset color code
    });

    it("should handle preventNewline parameter", () => {
      ui.info("info", true);

      assert.ok(!writtenOutput[0]?.includes("\n"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.info("test");
      assert.strictEqual(result, ui);
    });
  });

  describe("success", () => {
    it("should write green colored output", () => {
      ui.success("success message");

      assert.strictEqual(writtenOutput.length, 1);
      assert.ok(writtenOutput[0]?.includes("\x1b[32m")); // green color code
      assert.ok(writtenOutput[0]?.includes("success message"));
      assert.ok(writtenOutput[0]?.includes("\x1b[0m"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.success("test");
      assert.strictEqual(result, ui);
    });
  });

  describe("warn", () => {
    it("should write yellow colored output", () => {
      ui.warn("warning message");

      assert.strictEqual(writtenOutput.length, 1);
      assert.ok(writtenOutput[0]?.includes("\x1b[33m")); // yellow color code
      assert.ok(writtenOutput[0]?.includes("warning message"));
      assert.ok(writtenOutput[0]?.includes("\x1b[0m"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.warn("test");
      assert.strictEqual(result, ui);
    });
  });

  describe("error", () => {
    it("should write red colored output", () => {
      ui.error("error message");

      assert.strictEqual(writtenOutput.length, 1);
      assert.ok(writtenOutput[0]?.includes("\x1b[31m")); // red color code
      assert.ok(writtenOutput[0]?.includes("error message"));
      assert.ok(writtenOutput[0]?.includes("\x1b[0m"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.error("test");
      assert.strictEqual(result, ui);
    });
  });

  describe("setColor", () => {
    it("should apply color to subsequent log calls", () => {
      ui.setColor("magenta").write("colored message");

      assert.ok(writtenOutput[0]?.includes("\x1b[35m")); // magenta color code
      assert.ok(writtenOutput[0]?.includes("colored message"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.setColor("blue");
      assert.strictEqual(result, ui);
    });
  });

  describe("resetColor", () => {
    it("should remove color from subsequent log calls", () => {
      ui.setColor("red").resetColor().write("no color");

      assert.ok(!writtenOutput[0]?.includes("\x1b[31m")); // should not have red
      assert.strictEqual(writtenOutput[0], "no color\n");
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.resetColor();
      assert.strictEqual(result, ui);
    });
  });

  describe("separator", () => {
    it("should write colored separator with multiple colors", () => {
      ui.separator();

      // Should have 4 writes (cyan, green, yellow, red)
      assert.strictEqual(writtenOutput.length, 4);
      assert.ok(writtenOutput[0]?.includes("\x1b[36m")); // cyan
      assert.ok(writtenOutput[1]?.includes("\x1b[32m")); // green
      assert.ok(writtenOutput[2]?.includes("\x1b[33m")); // yellow
      assert.ok(writtenOutput[3]?.includes("\x1b[31m")); // red
    });

    it("should handle preventNewline parameter", () => {
      ui.separator(true);

      // Last output should not have newline
      assert.ok(!writtenOutput[3]?.includes("\n"));
    });

    it("should return user interface instance for chaining", () => {
      const result = ui.separator();
      assert.strictEqual(result, ui);
    });
  });

  describe("lineFeed", () => {
    it("should write a blank line", () => {
      ui.lineFeed();

      assert.strictEqual(writtenOutput.length, 1);
      assert.strictEqual(writtenOutput[0], "\n");
    });

    it("should write multiple blank lines when lineCount > 1", () => {
      ui.lineFeed(3);

      assert.strictEqual(writtenOutput.length, 3);
      assert.strictEqual(writtenOutput[0], "\n");
      assert.strictEqual(writtenOutput[1], "\n");
      assert.strictEqual(writtenOutput[2], "\n");
    });

    it("should return UserInterface instance for chaining", () => {
      const result = ui.lineFeed();
      assert.strictEqual(result, ui);
    });
  });

  describe("continue", () => {
    it("should prompt the user to press Enter to continue", async () => {
      const promise = ui.continue();
      // Simulate pressing Enter immediately
      setImmediate(() => {
        (ui as any).rl.emit("line", "");
      });
      await promise;

      const output = writtenOutput.join("");
      assert.ok(output.includes("Press Enter to continue..."));
    });

    it("should return UserInterface instance for chaining", async () => {
      const promise = ui.continue();
      setImmediate(() => {
        (ui as any).rl.emit("line", "");
      });
      const result = await promise;
      assert.strictEqual(result, ui);
    });
  });

  describe("method chaining", () => {
    it("should support chaining multiple log methods", () => {
      ui.info("first", true).success(" second", true).warn(" third").error("fourth");

      assert.strictEqual(writtenOutput.length, 4);
    });

    it("should support chaining color methods with log", () => {
      ui.setColor("blue").write("blue text").resetColor().write("normal text");

      assert.strictEqual(writtenOutput.length, 2);
      assert.ok(writtenOutput[0]?.includes("\x1b[34m")); // blue
      assert.ok(!writtenOutput[1]?.includes("\x1b[34m")); // no blue
    });
  });

  describe("dispose", () => {
    it("should set disposed flag to true", () => {
      assert.strictEqual((ui as any).disposed, false);

      ui.dispose();

      assert.strictEqual((ui as any).disposed, true);
    });

    it("should be idempotent (safe to call multiple times)", () => {
      // Should not throw when called multiple times
      assert.doesNotThrow(() => {
        ui.dispose();
        ui.dispose();
        ui.dispose();
      });

      assert.strictEqual((ui as any).disposed, true);
    });
  });

  describe("confirm", () => {
    it("should throw error when called after dispose", () => {
      ui.dispose();

      assert.rejects(async () => await ui.confirm("Test?", true), { message: "UserInterface has been disposed." });
    });

    it("should write prompt with [Y/n] when default is true", async () => {
      const promise = ui.confirm("Continue?", true);

      // Emit the line event to simulate user input
      setImmediate(() => {
        (ui as any).rl.emit("line", "y");
      });

      await promise;

      const output = writtenOutput.join("");
      assert.ok(output.includes("Continue? [Y/n]:"));
    });

    it("should write prompt with [y/N] when default is false", async () => {
      const promise = ui.confirm("Continue?", false);
      setImmediate(() => {
        (ui as any).rl.emit("line", "n");
      });
      await promise;

      const output = writtenOutput.join("");
      assert.ok(output.includes("Continue? [y/N]:"));
    });

    it("should return true for 'y' response", async () => {
      const promise = ui.confirm("Continue?", false);
      setImmediate(() => {
        (ui as any).rl.emit("line", "y");
      });
      const result = await promise;

      assert.strictEqual(result, true);
    });

    it("should return true for 'yes' response", async () => {
      const promise = ui.confirm("Continue?", false);
      setImmediate(() => {
        (ui as any).rl.emit("line", "yes");
      });
      const result = await promise;

      assert.strictEqual(result, true);
    });

    it("should return false for 'n' response", async () => {
      const promise = ui.confirm("Continue?", true);
      setImmediate(() => {
        (ui as any).rl.emit("line", "n");
      });
      const result = await promise;

      assert.strictEqual(result, false);
    });

    it("should use default true for empty input when default is true", async () => {
      const promise = ui.confirm("Continue?", true);
      setImmediate(() => {
        (ui as any).rl.emit("line", "");
      });
      const result = await promise;

      assert.strictEqual(result, true);
    });

    it("should use default false for empty input when default is false", async () => {
      const promise = ui.confirm("Continue?", false);
      setImmediate(() => {
        (ui as any).rl.emit("line", "");
      });
      const result = await promise;

      assert.strictEqual(result, false);
    });

    it("should be case-insensitive", async () => {
      const promise = ui.confirm("Continue?", false);
      setImmediate(() => {
        (ui as any).rl.emit("line", "YES");
      });
      const result = await promise;

      assert.strictEqual(result, true);
    });
  });

  describe("prompt", () => {
    it("should throw error when called after dispose", () => {
      ui.dispose();

      assert.rejects(async () => await ui.prompt("Test?"), { message: "UserInterface has been disposed." });
    });

    it("should write prompt message with colon", async () => {
      const promise = ui.prompt("Enter name");
      setImmediate(() => {
        (ui as any).rl.emit("line", "test");
      });
      await promise;

      const output = writtenOutput.join("");
      assert.ok(output.includes("Enter name:"));
    });

    it("should return trimmed user input", async () => {
      const promise = ui.prompt("Enter value");
      setImmediate(() => {
        (ui as any).rl.emit("line", "  test input  ");
      });
      const result = await promise;

      assert.strictEqual(result, "test input");
    });

    it("should return empty string for empty input", async () => {
      const promise = ui.prompt("Enter value");
      setImmediate(() => {
        (ui as any).rl.emit("line", "");
      });
      const result = await promise;

      assert.strictEqual(result, "");
    });
  });

  describe("menu", () => {
    it("should throw error when called after dispose", () => {
      ui.dispose();

      const options = {
        a: { name: "Option A", action: async () => {} },
        b: { name: "Option B", action: async () => {} },
      };

      assert.rejects(async () => await ui.menu("Choose:", options), { message: "UserInterface has been disposed." });
    });

    it.skip("should write menu message and all options", async () => {
      const options = {
        a: { name: "Option A", action: async () => {} },
        b: { name: "Option B", action: async () => {} },
        c: { name: "Option C", action: async () => {} },
      };

      const promise = ui.menu("Choose an option", options);
      setImmediate(() => {
        (ui as any).rl.emit("line", "a");
      });
      await promise;

      const output = writtenOutput.join("");
      assert.ok(output.includes("Choose an option"));
      assert.ok(output.includes("a: Option A"));
      assert.ok(output.includes("b: Option B"));
      assert.ok(output.includes("c: Option C"));
      assert.ok(output.includes("Select an option:"));
    });

    it("should return selected option key", async () => {
      const options = {
        a: { name: "Option A", action: async () => {} },
        b: { name: "Option B", action: async () => {} },
      };

      const promise = ui.menu("Choose", options);
      setImmediate(() => {
        (ui as any).rl.emit("line", "b");
      });
      const result = await promise;

      assert.strictEqual(result, options.b);
    });

    it("should trim whitespace from input", async () => {
      const options = {
        a: { name: "Option A", action: async () => {} },
        b: { name: "Option B", action: async () => {} },
      };

      const promise = ui.menu("Choose", options);
      setImmediate(() => {
        (ui as any).rl.emit("line", "  a  ");
      });
      const result = await promise;

      assert.strictEqual(result, options.a);
    });
  });
});
