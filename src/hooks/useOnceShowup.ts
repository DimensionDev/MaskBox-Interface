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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            invoked = true;
            callback();
          }
        });
      },
      {
        threshold: 0,
      },
    );
    const unobserve = () => {
      if (ref.current) observer.unobserve(ref.current);
    };
    observer.observe(ref.current);

    return unobserve;
  }, [callback]);
}
