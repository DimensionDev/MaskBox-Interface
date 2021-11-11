import {
  Button,
  PickerDialogProps,
  Icon,
  Input,
  PickerDialog,
  NFTSelectList,
  NFTSelectListProps,
} from '@/components';
import { FC, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends PickerDialogProps, Pick<NFTSelectListProps, 'tokens' | 'selectedTokenIds'> {
  onConfirm?: (ids: string[]) => void;
}
export const NFTPickerDialog: FC<Props> = ({
  tokens,
  selectedTokenIds = [],
  onConfirm,
  ...rest
}) => {
  const t = useLocales();
  const [keyword, setKeyword] = useState('');
  const [ids, setIds] = useState(selectedTokenIds);
  return (
    <PickerDialog {...rest} title={t('Select your collection') as string}>
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
      <NFTSelectList
        tokens={tokens}
        keyword={keyword}
        selectedTokenIds={ids}
        onChange={setIds}
        className={styles.selectList}
        pickable
      />
      <div className={styles.buttonGroup}>
        <Button fullWidth onClick={() => onConfirm?.(ids)}>
          {t('Confirm')}
        </Button>
      </div>
    </PickerDialog>
  );
};
