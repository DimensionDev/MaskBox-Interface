const STORE_PREFIX = 'mbox';
const getKey = (key: string) => `${STORE_PREFIX}/${key}`;

const cacheMap = new Map();

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
