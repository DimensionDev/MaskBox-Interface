import { Countdown, Overlay } from '@/components';
import classnames from 'classnames';
import React, { FC, HTMLProps, useState } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  start: number;
  end: number;
}

export const StatusOverlay: FC<Props> = ({ start, end, ...props }) => {
  const [isEnded, setIsEnded] = useState(end > Date.now());

  if (!start || !end) return null;

  return (
    <Overlay {...props} className={classnames(styles.container, props.className)}>
      {isEnded ? (
        <div className={styles.box}>
          <h2 className={styles.title}>Ended</h2>
        </div>
      ) : (
        <div className={styles.box}>
          <h2 className={styles.title}>Seascape Zombie Fighter Mystery Box</h2>
          <p className={styles.subtitle}>start sale in</p>
          <Countdown className={styles.countdown} end={start} onEnded={() => setIsEnded(true)} />
        </div>
      )}
    </Overlay>
  );
};
