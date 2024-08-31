export const NonogramSources = {
  "intro.simple": "x-x\nxxx\nx--",
  "intro.house": "---x---\n--xxx--\n-xxxxx-\nxxxx-xx\n-x-xxx-\n-x-xxx-"
} as const;

export type NonogramKey = keyof typeof NonogramSources;