import { createLocales, Language } from '../I18n';
import En from './en-US.json';
import Zh from './zh-CN.json';
import Jp from './ja-JP.json';

export const useLocales = createLocales({
  [Language.En]: En,
  [Language.Zh]: Zh,
  [Language.Jp]: Jp,
});
