import { Dialog, DialogProps, RoundButton } from '@/components';
import React, { FC } from 'react';
import styles from './index.module.less';

interface Props extends DialogProps {
  onShare?: () => void;
}

export const BuyBox: FC<Props> = ({ onShare, ...rest }) => {
  return (
    <Dialog {...rest} className={styles.buyBox} title="Buy">
      <dl className={styles.infos}>
        <dt className={styles.cost}>
          <div className={styles.currency}>
            <strong className={styles.value}>0.1</strong>
            <span className={styles.unit}>eth</span>
          </div>
          <div className={styles.estimate}>~$31.88</div>
        </dt>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Mystery Box:</span>
          <span className={styles.metaValue}>1</span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Current Wallet:</span>
          <span className={styles.metaValue}>0x0d09d...2008A</span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Available</span>
          <span className={styles.metaValue}>0.2222 USDT</span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Gas fee</span>
          <span className={styles.metaValue}>0.001 ETH</span>
        </dd>
      </dl>

      <div className={styles.buttonGroup}>
        <RoundButton className={styles.button} fullWidth size="large" onClick={onShare}>
          Allow NFTBOX to use your USDT
        </RoundButton>
        <RoundButton className={styles.button} fullWidth size="large" disabled>
          Buy
        </RoundButton>
      </div>
    </Dialog>
  );
};
