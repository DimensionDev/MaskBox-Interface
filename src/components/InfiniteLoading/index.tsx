import { FC, useState, useRef, useEffect, HTMLProps } from 'react';
import { noop } from 'lodash-es';
import styles from './index.module.less';

export interface InfiniteLoadingProps extends HTMLProps<HTMLDivElement> {
  loading?: boolean;
  onReachBottom?: () => void;
}

export const InfiniteLoading: FC<InfiniteLoadingProps> = ({
  onReachBottom,
  loading,
  children,
  ...rest
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    if (!anchorRef.current) {
      return noop;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setReachedBottom(entry.intersectionRatio === 1);
        });
      },
      {
        threshold: 1,
      },
    );
    observer.observe(anchorRef.current);
    return () => {
      anchorRef.current && observer.unobserve(anchorRef.current);
    };
  }, []);

  useEffect(() => {
    if (!loading && reachedBottom && onReachBottom) {
      onReachBottom();
    }
  }, [loading, reachedBottom, onReachBottom]);

  return (
    <div {...rest}>
      {children}
      <div ref={anchorRef} className={styles.bottomAnchor} />
    </div>
  );
};
