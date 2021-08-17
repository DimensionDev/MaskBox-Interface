import { LoadingIcon, ThickButton } from '@/components';
import { useWeb3Context } from '@/contexts';
import classnames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';

interface Props {
  value: string;
  onOpen?: () => void;
}

export const MysteryBox: FC<Props> = ({ value, onOpen }) => {
  const [opened, setOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const paintingRef = useRef<HTMLDivElement>(null);
  const { account, connectWeb3 } = useWeb3Context();

  useEffect(() => {
    if (!paintingRef.current) {
      return;
    }
    const animationendFn = () => {
      setOpened(true);
      setTimeout(() => {
        onOpen?.();
      }, 200);
    };
    const paintingEle = paintingRef.current;
    paintingEle.addEventListener('animationend', animationendFn);
    return () => {
      paintingEle.removeEventListener('animationend', animationendFn);
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
        >
          {opened && (
            <div className={styles.spinner}>
              <LoadingIcon size={30} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <p className={styles.value}>{value}</p>
        {account ? (
          <ThickButton className={styles.button} onClick={() => setOpen(true)}>
            Open Mystery Boxes
          </ThickButton>
        ) : (
          <ThickButton className={styles.button} onClick={connectWeb3}>
            Connect Wallet
          </ThickButton>
        )}
      </div>
    </div>
  );
};
