import {
  Button,
  Dialog,
  DialogProps,
  Icon,
  Input,
  LoadingIcon,
  SelectableNFTList,
  SelectableNFTListProps,
} from '@/components';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends DialogProps, Pick<SelectableNFTListProps, 'tokens' | 'selectedTokenIds'> {
  onConfirm?: (ids: string[]) => void;
  loading: boolean;
}
export const NFTPickerDialog: FC<Props> = ({
  tokens,
  selectedTokenIds = [],
  onConfirm,
  loading,
  onClose,
  ...rest
}) => {
  const t = useLocales();
  const [keyword, setKeyword] = useState('');
  const [pickedIds, setPickedIds] = useState(selectedTokenIds);
  const filteredList = useMemo(() => {
    if (keyword) {
      const searchingIds = keyword
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      return tokens.filter((token) => searchingIds.includes(token.tokenId));
    }
    return tokens;
  }, [keyword, tokens]);

  useEffect(() => {
    setPickedIds(selectedTokenIds);
  }, [selectedTokenIds]);

  return (
    <Dialog
      {...rest}
      title={t('Select your collection')}
      onClose={() => {
        onClose?.();
        setPickedIds(selectedTokenIds);
      }}
    >
      <div className={styles.searchGroup}>
        <Input
          fullWidth
          value={keyword}
          className={styles.input}
          placeholder={t('Token ID separated by comma, e.g. 23453, 2565') as string}
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          leftAddon={<Icon type="search" size={24} />}
        />
        <Button round={false}>{t('Search')}</Button>
      </div>
      {filteredList.length ? (
        <>
          <SelectableNFTList
            tokens={tokens}
            loading={loading}
            limit={10}
            selectedTokenIds={pickedIds}
            onChange={setPickedIds}
            className={styles.selectList}
          />
          <div className={styles.summary}>
            <span className={styles.picked}>{pickedIds.length}</span> / <span>{tokens.length}</span>
            {loading && <LoadingIcon size={14} />}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          {t('No result for <strong>{keyword}</strong>', { keyword })}
        </div>
      )}
      <div className={styles.buttonGroup}>
        <Button fullWidth onClick={() => onConfirm?.(pickedIds)}>
          {t('Confirm')}
        </Button>
      </div>
    </Dialog>
  );
};
