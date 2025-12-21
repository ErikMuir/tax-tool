import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide.",
  },
  {
    name: "src",
    type: String,
    multiple: true,
    description: "The input files to process",
    typeLabel: "<files>",
  },
  {
    name: "timeout",
    alias: "t",
    type: Number,
    description: "Timeout value in ms",
    typeLabel: "<ms>",
  },
  {
    name: "log",
    alias: "l",
    type: String,
    description: "info, warn or error",
  },
];

const options = commandLineArgs(optionDefinitions);

if (options.help) {
  const usage = commandLineUsage([
    {
      header: "Typical Example",
      content: "A simple example demonstrating typical usage.",
    },
    {
      header: "Options",
      optionList: optionDefinitions,
    },
    {
      content: "Project home: {underline https://github.com/me/example}",
    },
  ]);
  console.log(usage);
} else {
  console.log(options);
}
