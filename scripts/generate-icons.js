const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const { optimizeSvg } = require('./tools');

const BASE_DIR = path.resolve(__dirname, '../src/components/Icon');
const ICONS_ROOT = path.resolve(BASE_DIR, 'icons');
const EXTNAMES = ['.svg', '.png'];
const CODE_FILE = path.resolve(BASE_DIR, 'icon-data.ts');

const currentColorRe = /fill=('|")currentColor\1/;
/** @param {string} str */
const kebabToCamel = (str) => str.replace(/-(\w)/g, (_, m) => m.toUpperCase());
/** @param {string} fullpath */
const hasCurrentColor = (code) => currentColorRe.test(code);

/**
 * @param {string[]} fileNames
 * @param {string} iconsRoot
 */
const generateCode = (fileNames) => {
  const nameMap = {};
  const lines = [];
  const iconsWithDynamicColor = [];
  const names = fileNames.map((fileName) => {
    const parsed = path.parse(fileName);
    const name = kebabToCamel(parsed.name);
    nameMap[name] = fileName;
    const isSvg = parsed.ext.toLowerCase() === '.svg';
    const code = isSvg ? fs.readFileSync(path.resolve(ICONS_ROOT, fileName), 'utf8') : '';
    if (isSvg && hasCurrentColor(code)) {
      iconsWithDynamicColor.push(name);
      // TODO optimize svg
      lines.push(`export const ${name}Icon = ${JSON.stringify(optimizeSvg(code))}`);
    } else {
      lines.push(`export const ${name}Icon = new URL("./icons/${fileName}", import.meta.url).href`);
    }
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

  export const iconsWithDynamicColor = ${JSON.stringify(iconsWithDynamicColor)}

  ${defaultExport}`;
};

async function generate() {
  const fileNames = fs
    .readdirSync(ICONS_ROOT)
    .filter((file) => EXTNAMES.includes(path.extname(file)));

  const prettierOptions = await prettier.resolveConfig(__filename);
  const code = prettier.format(generateCode(fileNames), {
    ...prettierOptions,
    filename: CODE_FILE,
  });

  console.log(code);
  fs.writeFileSync(CODE_FILE, code);
}

generate();
