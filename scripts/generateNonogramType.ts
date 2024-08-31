const path = require('path');
const fs = require('fs');
const glob = require('glob');

const nonogramFolder = path.join(__dirname, '../assets/nonograms');
const outputFile = path.join(__dirname, '../constants/nonograms.generated.ts');

const files = glob.sync(path.join(nonogramFolder, '**/*.txt'));

const keyValuePairs = files.map((rawFile: string) => {
    const fileWithFolder = rawFile.replace(nonogramFolder, '');
    const key = fileWithFolder
        .replace('.txt', '')
        .replace('/', '')
        .replaceAll('/', '.');

    return `'${key}': '${fileWithFolder}'`;
});

const output = `export const NonogramSources = {
  ${keyValuePairs.join(',\n  ')}
}

export type NonogramKey = keyof typeof NonogramSources;`;

fs.writeFileSync(outputFile, output);