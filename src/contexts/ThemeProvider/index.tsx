import { getStorage, setStorage, StorageKeys } from '@/utils';
import { noop } from 'lodash-es';
import {
  createContext,
  FC,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from 'react';
import '../../theme.module.less';

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

const darkModeClass = 'darkMode';

const THEME_STORAGE_KEY = StorageKeys.Theme;

interface ThemeContextOptions {
  theme: ThemeType;
  setTheme: Dispatch<SetStateAction<ThemeType>>;
  toggleTheme: () => void;
}

const initialStoredTheme = getStorage(THEME_STORAGE_KEY);
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const initialDark = initialStoredTheme ? initialStoredTheme === ThemeType.Dark : mediaQuery.matches;
const initialTheme = initialDark ? ThemeType.Dark : ThemeType.Light;

export const ThemeContext = createContext<ThemeContextOptions>({
  theme: initialTheme,
  setTheme: noop,
  toggleTheme: noop,
});
if (initialDark) {
  document.body.classList.toggle(darkModeClass, initialDark);
}

export const ThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  useEffect(() => {
    const storedTheme = getStorage(THEME_STORAGE_KEY);
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const handler = (evt: MediaQueryListEvent) => {
        if (!getStorage(THEME_STORAGE_KEY)) {
          setTheme(evt.matches ? ThemeType.Dark : ThemeType.Light);
        }
      };
      mediaQuery.addEventListener('change', handler);
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle(darkModeClass, theme === ThemeType.Dark);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((th) => {
      const newTheme = th === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
      setStorage(THEME_STORAGE_KEY, newTheme);
      return newTheme;
    });
  };

  const contextValue = useMemo(() => {
    return {
      theme,
      setTheme,
      toggleTheme,
    };
  }, [theme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  return useContext(ThemeContext);
}
