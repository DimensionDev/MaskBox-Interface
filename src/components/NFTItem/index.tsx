import { ERC721Token } from '@/types';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

export interface NFTItemProps extends HTMLProps<HTMLDivElement> {
  token: ERC721Token;
}

const imagePlaceholder = 'https://picsum.photos/400/300';

export const NFTItem: FC<NFTItemProps> = ({ className, token, ...rest }) => {
  return (
    <div className={classnames(styles.nft, className)} {...rest}>
      <div className={styles.image}>
        <img src={token.image ?? imagePlaceholder} alt={token.name} height="100%" />
      </div>
      <div className={styles.info}>
        {token.name && <h3 className={styles.name}>{token.name}</h3>}
      </div>
    </div>
  );
};

interface CollectionProps extends HTMLProps<HTMLUListElement> {
  tokens: ERC721Token[];
}

export const Collection: FC<CollectionProps> = ({ tokens, className, ...rest }) => {
  return (
    <ul className={classnames(styles.nftList, className)} {...rest}>
      {tokens.map((token) => (
        <li key={token.tokenId.toString()} className={styles.nftItem}>
          <NFTItem token={token} />
        </li>
      ))}
    </ul>
  );
};