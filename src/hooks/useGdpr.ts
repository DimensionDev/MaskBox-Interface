import { getStorage, setStorage } from '@/utils';
import { useCallback, useState } from 'react';

const key = 'gdpr';
const storedAccepted = getStorage(key);

export function useGdpr() {
  const [accepted, setAccepted] = useState(storedAccepted);

  const accept = useCallback(() => {
    setAccepted(true);
    setStorage(key, true);
  }, []);

  return {
    accepted,
    accept,
  };
}
