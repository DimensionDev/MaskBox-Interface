import { RefObject, useEffect } from 'react';

export function useOnceShowup(ref: RefObject<HTMLElement>, callback: () => void | Promise<void>) {
  useEffect(() => {
    if (!ref.current) return;
    let invoked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (invoked) {
          unobserve();
          return;
        }
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          invoked = true;
          callback();
        }
      },
      {
        threshold: 0,
      },
    );
    observer.observe(ref.current);
    const unobserve = () => {
      if (ref.current) observer.unobserve(ref.current);
    };

    return unobserve;
  }, [callback]);
}
