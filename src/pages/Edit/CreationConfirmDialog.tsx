import { Button, Icon, NFTItem, PickerDialog, PickerDialogProps } from '@/components';
import { useNFTContract, useNFTName, useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { ERC721Token } from '@/types';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './dialog.module.less';

interface Props extends PickerDialogProps {
  sellAll?: boolean;
  nftIdList?: string[];
  nftAddress: string;
  onConfirm?: () => void;
  creating?: boolean;
}

export const CreationConfirmDialog: FC<Props> = ({
  sellAll,
  nftIdList = [],
  nftAddress,
  className,
  onConfirm,
  creating,
  ...rest
}) => {
  const { account, providerChainId: chainId } = useWeb3Context();
  const [erc721Tokens, setErc721Tokens] = useState<ERC721Token[]>([]);
  const accountExplorerUrl = useMemo(
    () => (chainId ? `${getNetworkExplorer(chainId)}/address/${account}` : ''),
    [account, chainId],
  );
  const { getByIdList, getMyTokens } = useNFTContract();
  const contractName = useNFTName(nftAddress);
  const loadNfts = useCallback(async () => {
    const tokens = sellAll
      ? await getMyTokens(nftAddress)
      : await getByIdList(nftAddress, nftIdList);
    setErc721Tokens(tokens);
  }, [sellAll, nftIdList, nftAddress, getByIdList, getMyTokens]);

  useEffect(() => {
    loadNfts();
  }, [loadNfts]);

  return (
    <PickerDialog
      title="Create maskbox"
      className={classnames(styles.confirmDialog, className)}
      {...rest}
    >
      {account ? (
        <div className={styles.meta}>
          <div className={styles.name}>Wallet account</div>
          <div className={styles.value}>
            {formatAddres(account)}
            <a href={accountExplorerUrl} target="_blank" rel="noopener noreferrer">
              <Icon size={20} type="external" />
            </a>
          </div>
        </div>
      ) : null}
      <div className={styles.meta}>
        <div className={styles.name}>Collections</div>
        <div className={styles.value}>{contractName}</div>
      </div>
      <ul className={classnames(styles.meta, styles.nftList)}>
        {erc721Tokens.map((token) => (
          <li key={token.tokenId}>
            <NFTItem className={styles.nft} token={token}></NFTItem>
          </li>
        ))}
      </ul>
      <div className={styles.meta}>
        <div className={styles.name}>Total Amount</div>
        <div className={styles.value}>{erc721Tokens.length}</div>
      </div>
      <Button onClick={onConfirm} disabled={creating} fullWidth colorScheme="primary" size="large">
        {creating ? 'Creating...' : 'Confirm'}
      </Button>
    </PickerDialog>
  );
};