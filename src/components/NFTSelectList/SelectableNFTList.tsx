import { ERC721Token } from '@/types';
import { arrayRemove } from '@/utils';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { ChangeEvent, FC, HTMLProps, useCallback, useMemo, useState } from 'react';
import { LoadingIcon } from '../Icon';
import { NFTItem } from '../NFTItem';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export interface SelectableNFTListProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  tokens: ERC721Token[];
  limit: number;
  loading: boolean;
  selectedTokenIds?: string[];
  onChange?: (ids: string[]) => void;
  onLoadMore?: () => void;
}

export const SelectableNFTList: FC<SelectableNFTListProps> = ({
  tokens,
  loading,
  limit,
  selectedTokenIds = [],
  onChange,
  className,
  ...rest
}) => {
  const t = useLocales();
  const allIds = useMemo(() => tokens.map((token) => token.tokenId), [tokens]);
  const isSelectedAll = allIds.length === selectedTokenIds.length;
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const reachedLimit = selectedTokenIds.length >= limit;

  const toggleItem = useCallback(
    (currentId: string) => {
      if (!onChange) return;
      let newIds = [...selectedTokenIds];
      if (selectedTokenIds.includes(currentId)) {
        arrayRemove(newIds, currentId);
      } else if (!reachedLimit) {
        newIds = [...selectedTokenIds, currentId];
      }
      onChange(newIds);
    },
    [selectedTokenIds, reachedLimit],
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
    const remainingAmount = limit - selectedTokenIds.length;
    const changingIds = previouslyChecked
      ? rangeIds
      : rangeIds.slice(0, Math.min(remainingAmount, limit) + 1);
    const newIds = allIds.filter((id) => {
      if (changingIds.includes(id)) return !previouslyChecked;
      return selectedTokenIds.includes(id);
    });
    onChange(newIds);
  };

  const handleItemClick = (
    evt: React.MouseEvent<HTMLElement, MouseEvent>,
    token: ERC721Token,
    index: number,
  ) => {
    const disabled = !selectedTokenIds.includes(token.tokenId) && reachedLimit;
    if (disabled) return;
    setLastIndex(index);
    if (evt.shiftKey && lastIndex !== null) {
      toggleRange(lastIndex, index);
    } else {
      toggleItem(token.tokenId);
    }
  };

  return (
    <div className={classnames(className, styles.selectList)} {...rest}>
      <div className={styles.operations}>
        <label className={classnames(styles.toggleAll, loading ? styles.locked : null)}>
          <input
            type="checkbox"
            disabled={loading}
            checked={isSelectedAll}
            onChange={toggleSelectAll}
          />
          {t('Select all')}
          {loading && <LoadingIcon size={14} />}
        </label>
        <div className={styles.tip}>
          You can also use <kbd>Shift</kbd> to select multiple NFTs.
        </div>
      </div>
      <ul className={classnames(styles.list, styles.scrolling)}>
        {tokens.map((token, index) => (
          <li className={styles.item} key={token.tokenId}>
            <NFTItem
              token={token}
              className={styles.nft}
              disabled={!selectedTokenIds.includes(token.tokenId) && reachedLimit}
              onClick={(evt) => {
                handleItemClick(evt, token, index);
              }}
            />
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedTokenIds.includes(token.tokenId)}
              onChange={noop}
              onClick={(evt) => {
                handleItemClick(evt, token, index);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
