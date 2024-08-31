const path = require("path");
const fs = require("fs");
const glob = require("glob");

const nonogramFolder = path.join(__dirname, "../assets/nonograms");
const outputFile = path.join(__dirname, "../constants/nonograms.generated.ts");

const files = glob.sync(path.join(nonogramFolder, "**/*.txt"));

const keyValuePairs = files.map((rawFile: string) => {
  // Remove folder and first /
  const fileWithFolder = rawFile.replace(nonogramFolder, "").replace("/", "");
  const key = fileWithFolder.replace(".txt", "").replaceAll("/", ".");
  const content = fs.readFileSync(rawFile, "utf8");

  return `"${key}": "${content.replaceAll("\n", "\\n")}"`;
});

const output = `export const NonogramSources = {
  ${keyValuePairs.join(",\n  ")}
} as const;

export type NonogramKey = keyof typeof NonogramSources;`;

fs.writeFileSync(outputFile, output);
