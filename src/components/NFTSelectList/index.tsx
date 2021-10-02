import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Icon } from '../Icon';
import { NFTItem, NFTItemProps } from '../NFTItem';
import styles from './index.module.less';

interface Props {
  nftList?: any[];
}

const mockNft: NFTItemProps = {
  name: 'mock name',
  latest_nft_id: BigNumber.from(1),
  sold: 0,
  total: 10,
  percentage: 10,
};

export const NFTSelectList: FC<Props> = () => {
  return (
    <div>
      <ul className={styles.list}>
        <li className={styles.item}>
          <NFTItem {...mockNft} className={styles.nft} />
        </li>
        <li className={styles.item}>
          <NFTItem {...mockNft} className={styles.nft} />
        </li>
        <li className={styles.item}>
          <NFTItem {...mockNft} className={styles.nft} />
        </li>
        <li className={styles.item}>
          <NFTItem {...mockNft} className={styles.nft} />
        </li>
        <li className={styles.item}>
          <div className={styles.addItem}>
            <Icon type="add" size={24} />
          </div>
        </li>
      </ul>
    </div>
  );
};
