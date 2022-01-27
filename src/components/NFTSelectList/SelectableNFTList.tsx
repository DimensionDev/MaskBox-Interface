import { ERC721Token } from '@/types';
import { arrayRemove, EMPTY_LIST } from '@/utils';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import {
  ChangeEvent,
  FC,
  HTMLProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LoadingIcon } from '../Icon';
import { NFTItem, NFTItemSkeleton } from '../NFTItem';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export interface SelectableNFTListProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  contractName: string;
  tokens: ERC721Token[];
  pendingSize?: number;
  limit: number;
  loading?: boolean;
  selectedTokenIds?: string[];
  onChange?: (ids: string[]) => void;
  onLoadMore?: () => void;
}

export const SelectableNFTList: FC<SelectableNFTListProps> = ({
  contractName,
  tokens,
  pendingSize = 0,
  loading,
  limit,
  selectedTokenIds = EMPTY_LIST,
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
        onChange(EMPTY_LIST);
      } else {
        const outOfBoundarySelectedIds = selectedTokenIds.filter((id) => {
          const index = allIds.indexOf(id);
          return index > limit - 1;
        });
        const withinBoundaryIds = allIds.slice(0, limit - outOfBoundarySelectedIds.length);
        onChange([...withinBoundaryIds, ...outOfBoundarySelectedIds]);
      }
    } else {
      onChange(EMPTY_LIST);
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

  const selectAllRef = useRef<HTMLInputElement>(null);
  const selectedSome = !isSelectedAll && selectedTokenIds.length > 0;
  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = selectedSome;
  }, [selectedSome]);

  return (
    <div className={classnames(className, styles.selectList)} {...rest}>
      <div className={styles.operations}>
        <label className={classnames(styles.toggleAll, loading ? styles.locked : null)}>
          <input
            ref={selectAllRef}
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
              contractName={contractName}
              token={token}
              className={styles.nft}
              disabled={!selectedTokenIds.includes(token.tokenId) && reachedLimit}
              hoverEffect={false}
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
        {loading &&
          Array.from({ length: pendingSize }).map((_, index) => (
            <li className={styles.item} key={`skeleton${index}`}>
              <NFTItemSkeleton className={styles.nft} />
            </li>
          ))}
      </ul>
    </div>
  );
};
