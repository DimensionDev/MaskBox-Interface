import { useOnceShowup } from '@/hooks';
import { ERC721Token, ERC721TokenMeta } from '@/types';
import { fetchNFTTokenDetail, useBoolean } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useCallback, useRef, useState } from 'react';
import { LoadingIcon } from '../Icon';
import { MediaViewer } from '../MediaViewer';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export interface NFTItemProps extends Omit<HTMLProps<HTMLDivElement>, 'disabled'> {
  contractName?: string;
  token: ERC721Token;
  sold?: boolean;
  disabled?: boolean;
}

export const NFTItem: FC<NFTItemProps> = ({
  className,
  contractName,
  token,
  sold,
  disabled,
  ...rest
}) => {
  const t = useLocales();
  const ref = useRef<HTMLDivElement>(null);
  const [tokenMeta, setVerboseToken] = useState<ERC721TokenMeta>({
    name: token.name,
    image: token.image ?? '',
  });
  const [fetching, setIsFetching, setNotFetching] = useBoolean(true);
  const fetchDetail = useCallback(async () => {
    if (!token.tokenURI) {
      setNotFetching();
      return;
    }
    setIsFetching();
    const meta = await fetchNFTTokenDetail(token.tokenURI);
    setVerboseToken(meta);
    setNotFetching();
  }, [token.tokenId, token.tokenURI]);
  useOnceShowup(ref, fetchDetail);
  return (
    <div
      className={classnames(styles.nft, className, disabled ? styles.disabled : null)}
      title={`${tokenMeta.name} #${token.tokenId}`}
      {...rest}
      ref={ref}
    >
      <MediaViewer
        className={styles.media}
        name={tokenMeta.name}
        image={tokenMeta.image}
        animationUrl={tokenMeta.animation_url}
      />
      <div className={styles.info}>
        {contractName && <h3 className={styles.contractName}>{contractName}</h3>}
        <h3 className={styles.name}>{fetching ? <LoadingIcon size={14} /> : tokenMeta.name}</h3>
        {sold !== undefined && (
          <h3 className={styles.saleStatus}>{sold ? t('Sold') : t('For Sale')}</h3>
        )}
      </div>
      {sold && <div className={styles.mask} />}
    </div>
  );
};

interface CollectionProps
  extends HTMLProps<HTMLUListElement>,
    Pick<NFTItemProps, 'contractName' | 'sold'> {
  tokens: ERC721Token[];
}

export const Collection: FC<CollectionProps> = ({
  tokens,
  contractName,
  sold,
  className,
  ...rest
}) => {
  return (
    <ul className={classnames(styles.nftList, className)} {...rest}>
      {tokens.map((token) => (
        <li key={token.tokenId} className={styles.nftItem}>
          <NFTItem contractName={contractName} token={token} sold={sold} />
        </li>
      ))}
    </ul>
  );
};
