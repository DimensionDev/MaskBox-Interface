import { ERC721Token } from '@/types';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import { NFTItem } from '../NFTItem';
import styles from './index.module.less';

export interface NFTListProps extends HTMLProps<HTMLDivElement> {
  tokens: ERC721Token[];
  pickable?: boolean;
  onPick?: () => void;
}

export const NFTList: FC<NFTListProps> = ({ onPick, tokens, className, pickable, ...rest }) => {
  return (
    <div className={classnames(className, styles.selectList)} {...rest}>
      <ul className={styles.list}>
        {tokens.map((token) => (
          <li className={styles.item} key={token.tokenId}>
            <NFTItem token={token} className={styles.nft} />
          </li>
        ))}
        {pickable && (
          <li className={styles.item}>
            <div className={styles.addItem} onClick={onPick} role="button">
              <Icon type="add" size={24} />
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
