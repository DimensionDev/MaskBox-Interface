import { Button, LoadingIcon, SelectableNFTList, SelectableNFTListProps } from '@/components';
import { ERC721Token } from '@/types';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { FC, HTMLProps, useCallback, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props
  extends HTMLProps<HTMLDivElement>,
    Pick<SelectableNFTListProps, 'selectedTokenIds'> {
  tokens: ERC721Token[];
  notOwnedIds: string[];
  loading?: boolean;
  limit: number;
  onConfirm?: (ids: string[]) => void;
}

export const Search: FC<Props> = ({
  className,
  limit,
  tokens,
  notOwnedIds,
  loading,
  selectedTokenIds = [],
  onConfirm = noop,
  ...rest
}) => {
  const t = useLocales();
  const [pickedIds, setPickedIds] = useState(selectedTokenIds);
  const handleConfirm = useCallback(() => {
    onConfirm(pickedIds);
  }, [onConfirm]);
  return (
    <div className={classnames(className, styles.searchView)} {...rest}>
      {(() => {
        if (loading)
          return <div className={styles.status}>{loading ? <LoadingIcon size={48} /> : null}</div>;
        if (tokens.length)
          return (
            <SelectableNFTList
              tokens={tokens}
              loading={loading}
              limit={limit}
              selectedTokenIds={pickedIds}
              onChange={setPickedIds}
            />
          );
        return null;
      })()}
      {notOwnedIds.length && !loading ? (
        <div className={classnames(styles.notfound, tokens.length ? undefined : styles.expand)}>
          {t('Token ID <span>{ids}</span> does not exist or belong to you.', {
            ids: notOwnedIds.map((id) => `#${id}`).join(','),
          })}
        </div>
      ) : null}
      <div className={styles.buttonGroup}>
        <Button
          fullWidth
          onClick={handleConfirm}
          colorScheme="primary"
          disabled={pickedIds.length === 0 || tokens.length === 0}
        >
          {t('Add')}
        </Button>
      </div>
    </div>
  );
};
