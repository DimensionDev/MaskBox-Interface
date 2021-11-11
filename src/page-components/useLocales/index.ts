import { createLocales, Language } from '@/contexts';
import En from './en-US.json';
import Zh from './zh-CN.json';

console.log({ En, Zh });
export const useLocales = createLocales({
  [Language.En]: En,
  [Language.Zh]: Zh,
});
