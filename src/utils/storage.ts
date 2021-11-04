import { useCallback, useState } from 'react';

const STORE_PREFIX = 'mbox';
const getKey = (key: string) => `${STORE_PREFIX}/${key}`;

const cacheMap = new Map();

export enum StorageKeys {
  ERC20Tokens = 'erc20-tokens',
  ERC721Tokens = 'erc721-tokens',
  Language = 'language',
  Theme = 'theme',
  WalletId = 'wallet-id',
  ChainId = 'chain-id',
  WalletType = 'wallet-type',
}

export const setStorage = (key: string, value: any) => {
  cacheMap.set(key, value);
  return localStorage.setItem(getKey(key), JSON.stringify(value));
};

export const getStorage = <T extends any = any>(key: string): T | null => {
  let result;
  if (cacheMap.has(key)) {
    return cacheMap.get(key);
  }
  const raw = localStorage.getItem(getKey(key));
  try {
    result = JSON.parse(raw ?? '');
  } catch {
    result = null;
  }

  if (result !== null) {
    cacheMap.set(key, result);
  }
  return result;
};

export const removeStorage = (key: string) => {
  localStorage.removeItem(getKey(key));
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

  const remove = useCallback(() => removeStorage(key), [key]);

  return [value, update, remove];
}
