import { Countdown, Overlay } from '@/components';
import classnames from 'classnames';
import React, { FC, HTMLProps, useMemo } from 'react';
import styles from './index.module.less';

const end = new Date(2021, 8, 3).getTime();

interface Props extends HTMLProps<HTMLDivElement> {}

export const StatusOverlay: FC<Props> = (props) => {
  const randomEnd = useMemo(() => Math.random() > 0.5, []);
  return (
    <Overlay {...props} className={classnames(styles.container, props.className)}>
      {randomEnd ? (
        <div className={styles.box}>
          <h2 className={styles.title}>Ended</h2>
        </div>
      ) : (
        <div className={styles.box}>
          <h2 className={styles.title}>Seascape Zombie Fighter Mystery Box</h2>
          <p className={styles.subtitle}>start sale in</p>
          <Countdown className={styles.countdown} end={end} />
        </div>
      )}
    </Overlay>
  );
};
