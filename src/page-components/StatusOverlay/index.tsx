import { Countdown, Overlay } from '@/components';
import classnames from 'classnames';
import React, { FC, HTMLProps, memo, useState } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  name: string;
  start: number;
  end: number;
}

export const StatusOverlay: FC<Props> = memo(({ name, start, end, ...props }) => {
  const [started, setStarted] = useState(false);

  const showEnded = end && end < Date.now();

  const isOnSale = started && !showEnded;

  if (!start || !end || isOnSale) return null;

  return (
    <Overlay {...props} className={classnames(styles.container, props.className)}>
      {showEnded ? (
        <div className={styles.box}>
          <h2 className={styles.title}>Ended</h2>
        </div>
      ) : (
        <div className={styles.box}>
          <h2 className={styles.title}>{name}</h2>
          <p className={styles.subtitle}>start sale in</p>
          <Countdown className={styles.countdown} end={start} onEnded={() => setStarted(true)} />
        </div>
      )}
    </Overlay>
  );
});
