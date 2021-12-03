import { noop } from 'lodash-es';
import { FC, HTMLProps, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.less';

export interface InfiniteLoadingProps extends HTMLProps<HTMLDivElement> {
  finished?: boolean;
  onReachBottom?: () => Promise<void | boolean>;
}

export const InfiniteLoading: FC<InfiniteLoadingProps> = ({
  finished,
  onReachBottom,
  children,
  ...rest
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<boolean>(false);

  const executeOnReachBottom = useCallback(async () => {
    if (finished) return;
    const result = await onReachBottom?.();
    if (visibleRef.current && !result) {
      setTimeout(executeOnReachBottom, 300);
    }
  }, [onReachBottom, finished]);

  useEffect(() => {
    if (!anchorRef.current) return noop;
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.intersectionRatio === 1) {
          visibleRef.current = true;
          executeOnReachBottom();
        }
        if (entry.intersectionRatio < 0.5) {
          visibleRef.current = false;
        }
      },
      {
        threshold: 1,
      },
    );
    observer.observe(anchorRef.current);
    return () => {
      anchorRef.current && observer.unobserve(anchorRef.current);
    };
  }, [executeOnReachBottom]);

  return (
    <div {...rest}>
      {children}
      <div ref={anchorRef} className={styles.bottomAnchor} />
    </div>
  );
};
