import { getStorage, setStorage, StorageKeys } from '@/utils';
import { noop } from 'lodash-es';
import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';

export enum Language {
  En = 'en',
  Zh = 'zh',
}

function getInitLang(): Language {
  const storagedLang = getStorage(StorageKeys.Language);
  return (storagedLang ?? navigator.language.split('-')[0]) as Language;
}

const initLang = getInitLang();

interface IMediaQueryContext {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const I18nContext = createContext<IMediaQueryContext>({
  language: initLang,
  setLanguage: noop,
});

export function useI18n(): IMediaQueryContext {
  return useContext(I18nContext);
}

export const I18nProvider: FC = ({ children }) => {
  const [language, setLanguage] = useState<Language>(initLang);

  const contextValue = useMemo(() => {
    return {
      language,
      setLanguage: (lang: Language) => {
        setLanguage(lang);
        setStorage(StorageKeys.Language, lang);
      },
    };
  }, [language]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

interface LocaleConfig {
  [key: string]: Record<string, string>;
}

export function createLocales(configs: LocaleConfig) {
  return function useLocales() {
    const { language } = useI18n();
    const t = useCallback(
      (key: string, data?: Record<string, string | number>) => {
        const config = configs[language as string];
        let text = config?.[key] || configs.en?.[key] || key;
        if (data) {
          text = text.replace(/{(.*?)}/g, (_, key) => data[key] ?? key);
        }
        const mightBeHtml = /(<.*?>|&\w+;)/.test(text);

        return mightBeHtml
          ? ((<span dangerouslySetInnerHTML={{ __html: text }} />) as unknown as string)
          : text;
      },
      [language],
    );
    return t;
  };
}
