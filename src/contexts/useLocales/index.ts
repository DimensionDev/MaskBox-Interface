import { createLocales, Language } from '../I18n';
import En from './en-US.json';
import Zh from './zh-CN.json';

export const useLocales = createLocales({
  [Language.En]: En,
  [Language.Zh]: Zh,
});
