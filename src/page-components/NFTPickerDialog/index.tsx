import {
  Button,
  DialogProps,
  Icon,
  Input,
  Dialog,
  NFTSelectList,
  NFTSelectListProps,
} from '@/components';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends DialogProps, Pick<NFTSelectListProps, 'tokens' | 'selectedTokenIds'> {
  onConfirm?: (ids: string[]) => void;
}
export const NFTPickerDialog: FC<Props> = ({
  tokens,
  selectedTokenIds = [],
  onConfirm,
  onClose,
  ...rest
}) => {
  const t = useLocales();
  const [keyword, setKeyword] = useState('');
  const [pickedIds, setPickedIds] = useState(selectedTokenIds);
  const filteredList = useMemo(() => {
    if (keyword) {
      return tokens.filter((token) => token.tokenId.toString().includes(keyword));
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
          placeholder={t('Token ID') as string}
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          leftAddon={<Icon type="search" size={24} />}
        />
        <Button round={false}>{t('Search')}</Button>
      </div>
      {filteredList.length ? (
        <NFTSelectList
          tokens={filteredList}
          selectedTokenIds={pickedIds}
          onChange={setPickedIds}
          className={styles.selectList}
          pickable
        />
      ) : (
        <div className={styles.empty}>{t('No result for')}</div>
      )}
      <div className={styles.buttonGroup}>
        <Button fullWidth onClick={() => onConfirm?.(pickedIds)}>
          {t('Confirm')}
        </Button>
      </div>
    </Dialog>
  );
};
