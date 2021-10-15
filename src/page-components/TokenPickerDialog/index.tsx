import {
  Button,
  Icon,
  Input,
  PickerDialog,
  PickerDialogProps,
  Token,
  TokenList,
} from '@/components';
import { useTokenList } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { TokenType } from '@/lib';
import { getStorage, isSameAddress, setStorage } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  onPick?: (token: TokenType) => void;
}

function storeNewTokens(newToken: TokenType) {
  const tokens = getStorage<TokenType[]>('tokens');
  setStorage('tokens', tokens ? [...tokens, newToken] : [newToken]);
}

export const TokenPickerDialog: FC<Props> = ({ onPick, ...rest }) => {
  const { tokens, updateTokens } = useTokenList();
  const [keyword, setKeyword] = useState('');
  const getERC20Token = useGetERC20TokenInfo();
  const [newToken, setNewToken] = useState<TokenType | null>(null);

  const filteredTokens = useMemo(() => {
    const kw = keyword.toLowerCase();
    return tokens.filter((token) => {
      const { symbol, name, address } = token;
      return (
        symbol.toLowerCase().includes(kw) ||
        name.toLowerCase().includes(kw) ||
        address.toLowerCase().startsWith(kw)
      );
    });
  }, [keyword, tokens]);

  const isNewAddress = useMemo(() => {
    return (
      utils.isAddress(keyword) &&
      tokens.findIndex((token) => isSameAddress(token.address, keyword)) === -1
    );
  }, [keyword, tokens]);

  useEffect(() => {
    if (isNewAddress) {
      getERC20Token(keyword).then((token) => token && setNewToken(token));
    }
  }, [isNewAddress, keyword]);

  return (
    <PickerDialog className={styles.dialog} title="Seletct a Token" {...rest}>
      <div className={styles.searchGroup}>
        <Input
          fullWidth
          className={styles.input}
          value={keyword}
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          placeholder="Search name or paste address"
          leftAddon={<Icon type="search" size={24} />}
        />
        <Button round={false}>Search</Button>
      </div>
      {isNewAddress ? (
        newToken && (
          <div className={classnames(styles.tokenList, styles.newList)}>
            <div className={styles.row}>
              <Token className={styles.token} token={newToken} hideBalance />
              <Button
                size="small"
                onClick={() => {
                  storeNewTokens(newToken);
                  setKeyword('');
                  updateTokens();
                }}
              >
                Import
              </Button>
            </div>
          </div>
        )
      ) : (
        <TokenList className={styles.tokenList} tokens={filteredTokens} onPick={onPick} />
      )}
    </PickerDialog>
  );
};
