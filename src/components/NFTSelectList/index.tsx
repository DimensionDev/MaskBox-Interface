import { ERC721Token } from '@/types';
import { FC, HTMLProps, useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { NFTItem } from '../NFTItem';
import styles from './index.module.less';

export interface NFTSelectListProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  tokens: ERC721Token[];
  selectedTokenIds?: string[];
  pickable?: boolean;
  onPick?: () => void;
  onChange?: (ids: string[]) => void;
}

export const NFTSelectList: FC<NFTSelectListProps> = ({
  pickable,
  onPick,
  tokens,
  selectedTokenIds = [],
  onChange,
  className,
  ...rest
}) => {
  const allIds = useMemo(() => tokens.map((token) => token.tokenId), [tokens]);
  const toggleItem = useCallback(
    (currentId: string, checked: boolean) => {
      if (!onChange) return;
      const newIds = allIds.filter((id) => {
        if (id === currentId) return checked;
        return selectedTokenIds.includes(id);
      });
      onChange(newIds);
    },
    [allIds, selectedTokenIds],
  );

  return (
    <div className={className} {...rest}>
      <ul className={styles.list}>
        {tokens.map((token) => (
          <li className={styles.item} key={token.tokenId}>
            <NFTItem
              token={token}
              className={styles.nft}
              onClick={() => {
                toggleItem(token.tokenId, !selectedTokenIds.includes(token.tokenId));
              }}
            />
            {pickable && (
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedTokenIds.includes(token.tokenId)}
                onChange={(evt) => toggleItem(token.tokenId, evt.currentTarget.checked)}
              />
            )}
          </li>
        ))}
        {!pickable && (
          <li className={styles.item}>
            <div className={styles.addItem} onClick={onPick}>
              <Icon type="add" size={24} />
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
