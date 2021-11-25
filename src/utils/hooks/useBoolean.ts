import { useCallback, useState } from 'react';

export function useBoolean(): [state: boolean, setTrue: () => void, setFalse: () => void] {
  const [state, setState] = useState(false);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, setTrue, setFalse];
}
