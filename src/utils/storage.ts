import { useCallback, useState } from 'react';

const STORE_PREFIX = 'mbox';
const getKey = (key: string) => `${STORE_PREFIX}/${key}`;

export enum StorageKeys {
  ERC20Tokens = 'erc20-tokens',
  ERC721Tokens = 'erc721-tokens',
  Language = 'language',
  Theme = 'theme',
  WalletId = 'wallet-id',
  ChainId = 'chain-id',
  WalletType = 'wallet-type',
  RecentTransations = 'recent-transitions',
}

export const setStorage = <T extends any>(key: string, value: T) => {
  return localStorage.setItem(getKey(key), JSON.stringify(value));
};

export const getStorage = <T extends any = any>(key: string): T | null => {
  const storeKey = getKey(key);
  let result;
  const raw = localStorage.getItem(storeKey);
  try {
    result = JSON.parse(raw ?? '');
  } catch {
    result = null;
  }

  return result;
};

export const removeStorage = (key: string) => {
  const storeKey = getKey(key);
  localStorage.removeItem(storeKey);
};

export function useStorage<T extends any = any>(
  key: StorageKeys,
): [value: T | null, updateStorage: (val: T) => void, remove: () => void] {
  const [value, setValue] = useState<T | null>(getStorage<T>(key));

  const update = useCallback(
    (val: T) => {
      setValue(val);
      setStorage(key, val);
    },
    [key],
  );

  const remove = useCallback(() => {
    removeStorage(key);
    setValue(null);
  }, [key]);

  return [value, update, remove];
}
