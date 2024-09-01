const path = require("path");
const fs = require("fs");
const glob = require("glob");

const nonogramFolder = path.join(__dirname, "../assets/nonograms");
const outputFile = path.join(
  __dirname,
  "../src/constants/nonograms.generated.ts",
);

const files = glob.sync(path.join(nonogramFolder, "**/*.txt")) as string[];

const nonograms = files.map((rawFile) => {
  // Remove folder and first slash
  const fileWithFolder = rawFile.replace(nonogramFolder, "").replace("/", "");
  const key = fileWithFolder.replace(".txt", "").replaceAll("/", ".");
  const content = fs.readFileSync(rawFile, "utf8") as string;

  const lines = content.split("\n");

  const colors = lines
    .map((line) => line.match(/^[a-zA-Z]=#.*$/g)?.[0])
    .filter((line) => line != null)
    .map((line) => {
      const [letter, color] = line.split("=");
      return { letter: letter!, color: color! };
    });

  const contentLines = lines.filter(
    (line) => line.match(/^[a-zA-Z]+$/) != null,
  );
  const nameLine = lines.find((line) => line.match(/^<.*>$/) != null);

  return {
    key,
    name: nameLine?.replace(/[<>]/g, ""),
    colors: colors.reduce(
      (obj, { letter, color }) => ({
        ...obj,
        [letter]: color,
      }),
      {},
    ),
    content: contentLines.join("\\n"),
  };
});

const output = `export const NonogramSources = {
  ${nonograms
    .map(
      ({ key, name, colors, content }) =>
        `"${key}": {
    "name": "${name}",
    "content": "${content}",
    "colors": ${JSON.stringify(colors)}
  }`,
    )
    .join(",\n  ")}
} as const;

export type NonogramKey = keyof typeof NonogramSources;

export const getNonogramTileMap = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey].content;
  return rawTileMap
    .split("\\n")
    .map((line) => line.split("").map((tile) => tile.toUpperCase() !== tile));
};

export const getNonogramColorMap = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey].content;
  const colors = NonogramSources[srcKey].colors;
  return rawTileMap
    .split("\\n")
    .map((line) => line.split("").map((tile) => colors[tile as keyof typeof colors] ?? '#fff'));
};
`;

fs.writeFileSync(outputFile, output);
