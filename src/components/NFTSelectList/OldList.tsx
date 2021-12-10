import { ERC721Token } from '@/types';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { ChangeEvent, FC, HTMLProps, useCallback, useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { NFTItem } from '../NFTItem';
import { useLocales } from '../useLocales';
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
  const t = useLocales();
  const allIds = useMemo(() => tokens.map((token) => token.tokenId), [tokens]);
  const isSelectedAll = allIds.length === selectedTokenIds.length;
  const [lastIndex, setLastIndex] = useState<number | null>(null);
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
  const toggleSelectAll = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    if (evt.currentTarget.checked) {
      if (isSelectedAll) {
        onChange([]);
      } else {
        onChange(allIds);
      }
    } else {
      onChange([]);
    }
  };

  const toggleRange = (from: number, to: number) => {
    if (!onChange) return;
    const [min, max] = from > to ? [to, from] : [from, to];
    const rangeIds = tokens.slice(min, max + 1).map((t) => t.tokenId);
    const previouslyChecked = selectedTokenIds.includes(tokens[to].tokenId);
    const newIds = allIds.filter((id) => {
      if (rangeIds.includes(id)) return !previouslyChecked;
      return selectedTokenIds.includes(id);
    });
    onChange(newIds);
  };

  return (
    <div className={classnames(className, styles.selectList)} {...rest}>
      {pickable && (
        <div className={styles.operations}>
          <label className={styles.togglAll}>
            <input type="checkbox" checked={isSelectedAll} onChange={toggleSelectAll} />
            {t('Select all')}
          </label>
          <div className={styles.tip}>
            You can also use <kbd>Shift</kbd> to select multiple NFTs.
          </div>
        </div>
      )}
      <ul className={styles.list}>
        {tokens.map((token, index) => (
          <li className={styles.item} key={token.tokenId}>
            <NFTItem
              token={token}
              className={styles.nft}
              onClick={(evt) => {
                setLastIndex(index);
                if (evt.shiftKey && lastIndex !== null) {
                  toggleRange(lastIndex, index);
                } else {
                  toggleItem(token.tokenId, !selectedTokenIds.includes(token.tokenId));
                }
              }}
            />
            {pickable && (
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedTokenIds.includes(token.tokenId)}
                onChange={noop}
                onClick={(evt) => {
                  setLastIndex(index);
                  if (evt.shiftKey && lastIndex !== null) {
                    toggleRange(lastIndex, index);
                  } else {
                    toggleItem(token.tokenId, !selectedTokenIds.includes(token.tokenId));
                  }
                }}
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
