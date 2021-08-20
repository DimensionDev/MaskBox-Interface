import React, { FC, HTMLProps } from 'react';
import { useCountdown } from './useCountdown';
import { tenify } from '@/utils';
import classnames from 'classnames';

import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onEnded'> {
  end: number;
  onEnded?: () => void;
}

export const Countdown: FC<Props> = ({ end, className, onEnded, ...rest }) => {
  const { days, hours, minutes, seconds } = useCountdown(end, onEnded);

  return (
    <div className={classnames(styles.countdown, className)} {...rest}>
      <div className={styles.timefield}>
        <div className={styles.digit}>{tenify(days)}</div>
        <div className={styles.label}>days</div>
      </div>
      <div className={styles.timefield}>
        <div className={styles.digit}>{tenify(hours)}</div>
        <div className={styles.label}>hours</div>
      </div>
      <div className={styles.timefield}>
        <div className={styles.digit}>{tenify(minutes)}</div>
        <div className={styles.label}>minutes</div>
      </div>
      <div className={styles.timefield}>
        <div className={styles.digit}>{tenify(seconds)}</div>
        <div className={styles.label}>seconds</div>
      </div>
    </div>
  );
};
