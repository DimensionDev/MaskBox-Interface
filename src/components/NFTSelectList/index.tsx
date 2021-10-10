import { ERC721Token } from '@/types';
import { FC, HTMLProps, useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { NFTItem } from '../NFTItem';
import styles from './index.module.less';

export interface NFTSelectListProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  tokens: ERC721Token[];
  selectedTokenIds?: string[];
  pickable?: boolean;
  keyword?: string;
  onPick?: () => void;
  onChange?: (ids: string[]) => void;
}

export const NFTSelectList: FC<NFTSelectListProps> = ({
  pickable,
  keyword,
  onPick,
  tokens,
  selectedTokenIds = [],
  onChange,
  className,
  ...rest
}) => {
  const filteredList = useMemo(() => {
    if (!pickable) {
      return tokens.filter((token) => selectedTokenIds.includes(token.tokenId));
    }
    if (keyword) {
      return tokens.filter((token) => token.tokenId.toString().includes(keyword));
    }
    return tokens;
  }, [tokens, selectedTokenIds, keyword]);
  console.log({ filteredList });
  const allIds = useMemo(() => tokens.map((token) => token.tokenId), [tokens]);

  const [selectedIds, setSelectedIds] = useState(selectedTokenIds);
  const toggleItem = useCallback(
    (currentId: string, checked: boolean) => {
      const newIds = allIds.filter((id) => {
        if (id === currentId) return checked;
        return selectedIds.includes(id);
      });
      console.log({ newIds, currentId, checked });
      setSelectedIds(newIds);
    },
    [allIds, selectedIds],
  );

  useEffect(() => {
    onChange?.(selectedIds);
  }, [selectedIds]);

  return (
    <div className={className} {...rest}>
      <ul className={styles.list}>
        {filteredList.map((token) => (
          <li className={styles.item} key={token.tokenId}>
            <NFTItem
              token={token}
              className={styles.nft}
              onClick={() => {
                toggleItem(token.tokenId, !selectedIds.includes(token.tokenId));
              }}
            />
            {pickable && (
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.includes(token.tokenId)}
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
