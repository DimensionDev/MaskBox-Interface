import { PickerDialogProps, Icon, Input, PickerDialog, TokenType } from '@/components';
import { TokenList } from '@/components';
import { FC } from 'react';

interface Props extends PickerDialogProps {}
const tokens = [] as TokenType[];
export const TokenPickerDialog: FC<Props> = (props) => {
  return (
    <PickerDialog {...props} title="Seletct a Token">
      <Input
        round
        placeholder="Search name or paste address"
        leftAddon={<Icon type="search" size={24} />}
      />
      <TokenList tokens={tokens} />
    </PickerDialog>
  );
};
