const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const BASE_DIR = path.resolve(__dirname, '../src/components/Icon');
const EXTNAMES = ['.svg', '.png'];

const generateCode = (fileNames) => {
  const nameMap = {};
  const lines = [];
  const names = fileNames.map((fileName) => {
    const name = path.parse(fileName).name;
    nameMap[name] = fileName;
    lines.push(`export const ${name}Icon = new URL("./icons/${fileName}", import.meta.url).href`);
    return name;
  });

  const declareType = `export type IconType = ${names.map((n) => JSON.stringify(n)).join(' | ')}`;
  const map = `export const iconNameMap = ${JSON.stringify(nameMap)}`;
  const defaultExport = `const icons = {
    ${names.map((name) => `${name}:${name}Icon`).join(',')}
  }
  export default icons`;

  return `
  ${declareType}
  ${map}
  ${lines.join('\n')}
  ${defaultExport}`;
};

const codeFile = path.resolve(BASE_DIR, 'icon-data.ts');

async function generate() {
  const fileNames = fs
    .readdirSync(path.resolve(BASE_DIR, './icons'))
    .filter((file) => EXTNAMES.includes(path.extname(file)));

  const prettierOptions = await prettier.resolveConfig(__filename);
  const code = prettier.format(generateCode(fileNames), {
    ...prettierOptions,
    filename: codeFile,
  });

  console.log(code);
  fs.writeFileSync(codeFile, code);
}

generate();
