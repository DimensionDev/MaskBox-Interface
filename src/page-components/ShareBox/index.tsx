import { Button, NFTItem, PickerDialog, PickerDialogProps } from '@/components';
import { useNFTContract, useNFTName } from '@/contexts';
import { ERC721Token } from '@/types';
import { FC, useEffect, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  nftAddress: string;
  nftIds: string[];
  onShare?: () => void;
}

export const ShareBox: FC<Props> = ({ nftAddress, nftIds, onShare, ...rest }) => {
  const t = useLocales();
  const { getByIdList } = useNFTContract();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);
  const nftName = useNFTName(nftAddress);

  useEffect(() => {
    getByIdList(nftAddress, nftIds).then(setTokens);
  }, [nftAddress, nftIds]);

  return (
    <PickerDialog className={styles.shareBox} title={t('Successful') as string} {...rest}>
      <ul className={styles.nftList}>
        {tokens.map((token) => (
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
    </PickerDialog>
  );
};
