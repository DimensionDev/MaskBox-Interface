import {
  BaseButton as Button,
  PickerDialogProps,
  Icon,
  Input,
  PickerDialog,
  NFTSelectList,
  NFTSelectListProps,
} from '@/components';
import { FC, useState } from 'react';
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
  const [keyword, setKeyword] = useState('');
  const [ids, setIds] = useState(selectedTokenIds);
  return (
    <PickerDialog {...rest} title="Seletct a Token">
      <div className={styles.searchGroup}>
        <Input
          fullWidth
          value={keyword}
          className={styles.input}
          placeholder="Token ID"
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          leftAddon={<Icon type="search" size={24} />}
        />
        <Button>Search</Button>
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
          Confirm
        </Button>
      </div>
    </PickerDialog>
  );
};
