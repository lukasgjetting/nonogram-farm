export const NonogramSources = {
  "seeds.pineapple-slice": {
    "name": "Pineapple Slice",
    "content": "AaabAAAA\nddabAAbb\nBBddAbbc\nBBBedbcc\nBBeeedcA\nBeeefdAA\nBeefffdA\nBfffffdA",
    "colors": {"A":"#F3E3FF","B":"#FFF59A","a":"#AED293","b":"#8AAC71","c":"#5E8C3E","d":"#DAB95D","e":"#FFE382","f":"#FFDC62"}
  },
  "seeds.pina-colada": {
    "name": "Pina Colada",
    "content": "aaAAaaAbcAAA\naaaAAAAABcAA\nAAdAAeeBebAA\nfdggggeBeggg\nfdhhCCeieCCC\nClChCeiiieCC\nClCCCejjjeCC\nClCCCekjkeCC\nCCCCmmeeemmm\nCCmmDDDeDDDD\nCmmDDDeeennn\nCmDDDDDnnnnn",
    "colors": {"A":"#BCEBFF","B":"#E4E4E4","C":"#FBFFC9","D":"#C3A77D","a":"#D5F2FF","b":"#DE5D8B","c":"#EC749F","d":"#8AAC71","e":"#E7FFFE","f":"#AED293","g":"#74B6F2","h":"#5E8C3E","i":"#FFF59A","j":"#FFDC62","k":"#DAB95D","l":"#735233","m":"#A1865D","n":"#A69A88"}
  },
  "intro.tree": {
    "name": "Tree",
    "content": "ZZZZaaZZZZ\nZZZaaaaZZZ\nZZYaaaaaZZ\nZZababaaZZ\nZZZabaaZZZ\nZZZZbbZZZZ\nZaaZbbbaZZ\nZZabbbbZZZ\nZZZZXbZZbb\nWWWbbbbWWW",
    "colors": {"a":"#65a30d","b":"#854d0e","X":"#d97706","Y":"#365314","Z":"#7dd3fc","W":"#86efac"}
  },
  "intro.sun": {
    "name": "Sun",
    "content": "AaaA\naaba\nBaBa\nAbaA",
    "colors": {"a":"#f59e0b","b":"#fbbf24","A":"#06b6d4","B":"#fcd34d"}
  },
  "intro.simple": {
    "name": "Demo",
    "content": "xxx",
    "colors": {"x":"#000"}
  },
  "intro.plant": {
    "name": "Plant",
    "content": "ZZZaZaaaaaaaZZZ\neeeeZZaaaaaZZee\neeeeeeZaaaeeeee\neebbbeZZZZeeeee\nZeebbbZaZZbbeeZ\nZZZZbbZZbbZZZZZ\nZbbbZbYbYbZZZZZ\nZZZZZZbbbZZZZZZ\nZbbZZZbbZZZZZZZ\nZZbbbZbbZZZZZZZ\nZZZZcbbbccZZZZZ\nZZZZccccccddZZZ\ndddcddccdccdddd\nddddXddXdddddXX",
    "colors": {"a":"#f3e100","b":"#053408","c":"#693c0d","d":"#23a518","e":"#ffffff","Z":"#4ce6ff","Y":"#19c04b","X":"#0d6527"}
  },
  "intro.house": {
    "name": "House",
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
