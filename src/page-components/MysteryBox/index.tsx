import React, { FC, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { ThickButton } from '@/components';

import styles from './index.module.less';

interface Props {
  value: string;
  onOpen?: () => void;
}

export const MysteryBox: FC<Props> = ({ value, onOpen }) => {
  const [open, setOpen] = useState(false);
  const paintingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paintingRef.current) {
      return;
    }
    const animationendFn = () => {
      setTimeout(() => {
        onOpen?.();
      }, 150);
    };
    paintingRef.current?.addEventListener('animationend', animationendFn);
    return () => {
      paintingRef.current?.removeEventListener('animationend', animationendFn);
    };
  }, [paintingRef.current, onOpen]);
  return (
    <div className={styles.container}>
      <div className={styles.boxGroup}>
        <div className={classnames(styles.comp, styles.lisa)} />
        <div className={classnames(styles.comp, styles.sunflower)} />
        <div className={classnames(styles.comp, styles.box)} />
        <div
          ref={paintingRef}
          className={classnames(styles.comp, styles.painting, open ? styles.open : null)}
        />
      </div>
      <div className={styles.buttonGroup}>
        <p className={styles.value}>{value}</p>
        <ThickButton className={styles.button} onClick={() => setOpen(true)}>
          Open Red Packet
        </ThickButton>
      </div>
    </div>
  );
};
