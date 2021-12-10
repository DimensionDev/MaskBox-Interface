import { useOnceShowup } from '@/hooks';
import { ERC721Token } from '@/types';
import { fetchNFTTokenDetail } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useCallback, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { Image } from '../Image';
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
  const [verboseToken, setVerboseToken] = useState<ERC721Token>(token);
  const fetchDetail = useCallback(async () => {
    if (!token.tokenURI) return;
    const detail = await fetchNFTTokenDetail(token.tokenURI);
    setVerboseToken({
      ...detail,
      tokenId: token.tokenId,
    });
  }, [token.tokenId, token.tokenURI]);
  useOnceShowup(ref, fetchDetail);
  return (
    <div
      className={classnames(styles.nft, className, disabled ? styles.disabled : null)}
      {...rest}
      ref={ref}
    >
      <div className={styles.image}>
        <Image
          loading="lazy"
          src={verboseToken.image}
          alt={verboseToken.name}
          height="100%"
          alternative={<Icon type="mask" size={48}></Icon>}
        />
      </div>
      <div className={styles.info}>
        {contractName && <h3 className={styles.contractName}>{contractName}</h3>}
        {verboseToken.name && (
          <h3 className={styles.name}>
            {verboseToken.name}/{verboseToken.tokenId}
          </h3>
        )}
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
