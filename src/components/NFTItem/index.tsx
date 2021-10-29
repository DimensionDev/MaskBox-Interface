import { ERC721Token } from '@/types';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

export interface NFTItemProps extends HTMLProps<HTMLDivElement> {
  contractName?: string;
  token: ERC721Token;
}

const imagePlaceholder = 'https://picsum.photos/400/300';

export const NFTItem: FC<NFTItemProps> = ({ className, contractName, token, ...rest }) => {
  return (
    <div className={classnames(styles.nft, className)} {...rest}>
      <div className={styles.image}>
        <img src={token.image ?? imagePlaceholder} alt={token.name} height="100%" />
      </div>
      <div className={styles.info}>
        {contractName && <h3 className={styles.contractName}>{contractName}</h3>}
        {token.name && <h3 className={styles.name}>{token.name}</h3>}
      </div>
    </div>
  );
};

interface CollectionProps extends HTMLProps<HTMLUListElement> {
  contractName?: string;
  tokens: ERC721Token[];
}

export const Collection: FC<CollectionProps> = ({ tokens, contractName, className, ...rest }) => {
  return (
    <ul className={classnames(styles.nftList, className)} {...rest}>
      {tokens.map((token) => (
        <li key={token.tokenId} className={styles.nftItem}>
          <NFTItem contractName={contractName} token={token} />
        </li>
      ))}
    </ul>
  );
};
