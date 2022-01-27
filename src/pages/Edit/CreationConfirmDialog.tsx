import { Button, Dialog, DialogProps, Icon, NFTItem } from '@/components';
import { useNFTName, useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { ERC721Token } from '@/types';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, useMemo } from 'react';
import styles from './dialog.module.less';
import { useLocales } from './useLocales';

interface Props extends DialogProps {
  tokens: ERC721Token[];
  nftAddress: string;
  onConfirm?: () => void;
  creating?: boolean;
}

export const CreationConfirmDialog: FC<Props> = ({
  open,
  tokens,
  nftAddress,
  className,
  onConfirm,
  creating,
  ...rest
}) => {
  const t = useLocales();
  const { account, providerChainId: chainId } = useWeb3Context();
  const accountExplorerUrl = useMemo(
    () => (chainId ? `${getNetworkExplorer(chainId)}/address/${account}` : ''),
    [account, chainId],
  );
  const contractName = useNFTName(nftAddress);

  return (
    <Dialog
      title={t('Create MaskBox') as string}
      className={classnames(styles.confirmDialog, className)}
      open={open}
      {...rest}
    >
      {account ? (
        <div className={styles.meta}>
          <div className={styles.name}>{t('Wallet account')}</div>
          <div className={styles.value}>
            {formatAddres(account)}
            <a href={accountExplorerUrl} target="_blank" rel="noopener noreferrer">
              <Icon size={20} type="external" />
            </a>
          </div>
        </div>
      ) : null}
      <div className={styles.meta}>
        <div className={styles.name}>{t('Collections')}</div>
        <div className={styles.value}>{contractName}</div>
      </div>
      <ul className={classnames(styles.meta, styles.nftList)}>
        {tokens.map((token) => (
          <li key={token.tokenId}>
            <NFTItem className={styles.nft} token={token} hoverEffect={false} />
          </li>
        ))}
      </ul>
      <div className={styles.meta}>
        <div className={styles.name}>{t('Total Amount')}</div>
        <div className={styles.value}>{tokens.length}</div>
      </div>
      <Button onClick={onConfirm} disabled={creating} fullWidth colorScheme="primary" size="large">
        {creating ? t('Creating...') : t('Confirm')}
      </Button>
    </Dialog>
  );
};
