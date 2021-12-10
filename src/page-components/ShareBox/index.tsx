import { Button, Dialog, DialogProps, NFTItem } from '@/components';
import { useNFTName } from '@/contexts';
import { useERC721TokensByIds } from '@/hooks';
import { ERC721Token } from '@/types';
import { FC } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends DialogProps {
  tokens?: ERC721Token[];
  nftIds?: string[];
  nftAddress: string;
  onShare?: () => void;
}

export const ShareBox: FC<Props> = ({ nftAddress, nftIds = [], tokens, onShare, ...rest }) => {
  const t = useLocales();
  const nftName = useNFTName(nftAddress);
  const { tokens: tokensByIds } = useERC721TokensByIds(nftAddress, nftIds);

  return (
    <Dialog className={styles.shareBox} title={t('Successful')} {...rest}>
      <ul className={styles.nftList}>
        {(tokens ?? tokensByIds).map((token) => (
          <li key={token.tokenId} className={styles.item}>
            <NFTItem contractName={nftName} token={token} />
          </li>
        ))}
      </ul>

      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          fullWidth
          colorScheme="primary"
          size="middle"
          onClick={onShare}
        >
          {t('Share to twitter')}
        </Button>
      </div>
    </Dialog>
  );
};
