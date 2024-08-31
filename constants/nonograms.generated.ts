export const NonogramSources = {
  "intro.simple": {
    "content": "x-x\nxxx\nx--",
    "colors": {}
  },
  "intro.house": {
    "content": "ZZZaZZZ\nZZaaaZZ\nZaaaaaZ\naaaaaaa\nZcYcXcZ\nZcYcccZ\nbbbbbbb",
    "colors": {"a":"#422006","b":"#052e16","c":"#713f12","X":"#ccfbf1","Y":"#450a0a","Z":"#7dd3fc"}
  }
} as const;

export type NonogramKey = keyof typeof NonogramSources;

export const getNonogramTileMap = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey].content;
  return rawTileMap
    .split("\n")
    .map((line) => line.split("").map((tile) => tile.toUpperCase() !== tile));
};

export const getNonogramColorMap = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey].content;
  const colors = NonogramSources[srcKey].colors;
  return rawTileMap
    .split("\n")
    .map((line) => line.split("").map((tile) => colors[tile as keyof typeof colors] ?? '#fff'));
};
