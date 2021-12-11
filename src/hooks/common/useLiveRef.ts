import { useEffect, useRef } from 'react';

export function useLiveRef() {
  const liveRef = useRef(true);

  useEffect(() => {
    return () => {
      liveRef.current = false;
    };
  }, []);

  return liveRef;
}
