import React, { FC } from 'react';
import styles from './index.module.less';

interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  probability: string;
}

interface Props extends NFT {}

export const NFTItem: FC<Props> = ({ name, imageUrl, probability }) => {
  return (
    <div className={styles.nft}>
      <div className={styles.image}>
        <img src={imageUrl} alt={name} width="200" height="150" />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.meta}>
          <span className={styles.metaName}>Probability</span>
          <span className={styles.metaValue}>{probability}</span>
        </p>
      </div>
    </div>
  );
};

interface NFTListProps {
  list: NFT[];
}

export const NFTList: FC<NFTListProps> = ({ list }) => {
  return (
    <ul className={styles.nftList}>
      {list.map((nft) => (
        <li key={nft.id} className={styles.nftItem}>
          <NFTItem {...nft} />
        </li>
      ))}
    </ul>
  );
};
