import { createLocales, Language } from '@/contexts';
import En from './en-US.json';
import Zh from './zh-CN.json';

export const useLocales = createLocales({
  [Language.En]: En,
  [Language.Zh]: Zh,
});
