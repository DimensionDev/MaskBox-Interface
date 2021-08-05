import { Dialog, DialogProps, NFTItem, RoundButton } from '@/components';
import React, { FC } from 'react';
import { mockNfts } from '@/data';
import styles from './index.module.less';

interface Props extends DialogProps {}

export const ShareBox: FC<Props> = (props) => {
  return (
    <Dialog {...props} className={styles.shareBox} title="Successful">
      <div className={styles.nftContainer}>
        <NFTItem {...mockNfts[0]} />
      </div>

      <div className={styles.buttonGroup}>
        <RoundButton className={styles.button} fullWidth size="large">
          Share
        </RoundButton>
      </div>
    </Dialog>
  );
};
