import { useCallback, useState } from 'react';

export function useBoolean(
  initial: boolean = false,
): [state: boolean, setTrue: () => void, setFalse: () => void] {
  const [state, setState] = useState(initial);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, setTrue, setFalse];
}
