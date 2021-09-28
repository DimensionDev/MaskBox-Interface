import { Dialog, DialogProps, NFTItem, RoundButton } from '@/components';
import { FC } from 'react';
import { mockNfts } from '@/data';
import styles from './index.module.less';

interface Props extends DialogProps {
  onShare?: () => void;
}

export const ShareBox: FC<Props> = ({ onShare, ...rest }) => {
  return (
    <Dialog {...rest} className={styles.shareBox} title="Successful">
      <div className={styles.nftContainer}>
        <NFTItem {...mockNfts[0]} />
      </div>

      <div className={styles.buttonGroup}>
        <RoundButton className={styles.button} fullWidth size="large" onClick={onShare}>
          Share
        </RoundButton>
      </div>
    </Dialog>
  );
};
