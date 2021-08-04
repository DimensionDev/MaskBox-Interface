import React, { FC } from 'react';
import classnames from 'classnames';

import styles from './index.module.less';
import { ThickButton } from '@/components';

interface Props {
  value: string;
  onOpen?: () => void;
}

export const MysteryBox: FC<Props> = ({ value, onOpen }) => {
  return (
    <div className={styles.container}>
      <div className={styles.boxGroup}>
        <div className={classnames(styles.comp, styles.lisa)} />
        <div className={classnames(styles.comp, styles.sunflower)} />
        <div className={classnames(styles.comp, styles.box)} />
      </div>
      <div className={styles.buttonGroup}>
        <p className={styles.value}>{value}</p>
        <ThickButton className={styles.button} onClick={onOpen}>
          Open Red Packet
        </ThickButton>
      </div>
    </div>
  );
};
