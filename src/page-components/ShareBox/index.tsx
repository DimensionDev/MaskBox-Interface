import { Button, NFTItem, PickerDialog, PickerDialogProps } from '@/components';
import { useNFTContract, useNFTName, useWeb3Context } from '@/contexts';
import { createShareUrl } from '@/lib';
import { ERC721Token } from '@/types';
import { FC, useCallback, useEffect, useState } from 'react';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  boxId: string;
  nftAddress: string;
  nftIds: string[];
}

export const ShareBox: FC<Props> = ({ boxId, nftAddress, nftIds, ...rest }) => {
  const { getByIdList } = useNFTContract();
  const { providerChainId: chainId } = useWeb3Context();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);
  const nftName = useNFTName(nftAddress);
  const handleShare = useCallback(() => {
    const link = `${window.location.origin}.io/#/details?chain=${chainId}&box=${boxId}`;
    const text = `I just draw an NFT on Maskbox platform, subscribe @realMaskNetwork for more updates - ${link}`;
    const shareLink = createShareUrl(text);
    window.open(shareLink, 'noopener noreferrer');
  }, [boxId, chainId]);

  useEffect(() => {
    getByIdList(nftAddress, nftIds).then(setTokens);
  }, [nftAddress, nftIds]);

  return (
    <PickerDialog {...rest} className={styles.shareBox} title="Successful">
      <ul className={styles.nftList}>
        {tokens.map((token) => (
          <li key={token.tokenId}>
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
          onClick={handleShare}
        >
          Share
        </Button>
      </div>
    </PickerDialog>
  );
};
