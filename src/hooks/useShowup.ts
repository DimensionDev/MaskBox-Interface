import { useBoolean } from '@/utils';
import { noop } from 'lodash-es';
import { RefObject, useEffect } from 'react';

type Callback = () => void | Promise<void>;
export function useShowup(
  ref: RefObject<HTMLElement>,
  showcb: Callback = noop,
  hidecb: Callback = noop,
) {
  const [showup, setShowup, setHide] = useBoolean();
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setShowup();
          showcb();
        } else if (entry.intersectionRatio <= 0) {
          hidecb();
          setHide();
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
  }, [showcb, hidecb]);
  return showup;
}
