const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const BASE_DIR = path.resolve(__dirname, '../src/assets/images');
const EXTNAMES = ['.svg', '.png'];

const generateCode = (fileNames) => {
  const lines = fileNames.map((fileName) => {
    const key = path
      .parse(fileName)
      .name.replace(/-(\w)/g, (_, char) => char.toLowerCase())
      .toLowerCase();
    const exp = `export const ${key}Image = new URL("./${fileName}", import.meta.url).href`;
    return exp;
  });

  return lines.join('\n\n');
};

const codeFile = path.resolve(BASE_DIR, 'index.ts');

async function generate() {
  const fileNames = fs
    .readdirSync(BASE_DIR)
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
