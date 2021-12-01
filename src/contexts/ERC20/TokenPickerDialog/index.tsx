import { Button, Icon, Input, Dialog, DialogProps, Token, TokenList } from '@/components';
import { useTokenList } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { TokenType } from '@/lib';
import { getStorage, isSameAddress, setStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import { useLocales } from '../../useLocales';

interface TokenPickerDialogProps extends DialogProps {
  exclude?: string[];
  onPick?: (token: TokenType) => void;
}

function storeNewToken(newToken: TokenType) {
  const tokens = getStorage<TokenType[]>(StorageKeys.ERC20Tokens);
  setStorage(StorageKeys.ERC20Tokens, tokens ? [...tokens, newToken] : [newToken]);
}

export const TokenPickerDialog: FC<TokenPickerDialogProps> = ({
  onPick,
  exclude = [],
  ...rest
}) => {
  const t = useLocales();
  const { tokens, updateTokens } = useTokenList();
  const [keyword, setKeyword] = useState('');
  const getERC20Token = useGetERC20TokenInfo();
  const [newToken, setNewToken] = useState<TokenType | null>(null);

  const filteredTokens = useMemo(() => {
    const kw = keyword.toLowerCase();
    return tokens
      .filter((token) => !exclude.includes(token.address))
      .filter((token) => {
        const { symbol, name, address } = token;
        return (
          symbol.toLowerCase().includes(kw) ||
          name.toLowerCase().includes(kw) ||
          address.toLowerCase().startsWith(kw)
        );
      });
  }, [keyword, tokens, exclude.join()]);

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
    <Dialog className={styles.dialog} title={t('Seletct a Token') as string} {...rest}>
      <div className={styles.searchGroup}>
        <Input
          fullWidth
          round
          className={styles.input}
          value={keyword}
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          placeholder={t('Search name or paste address') as string}
          leftAddon={<Icon type="search" size={24} />}
        />
      </div>
      {isNewAddress ? (
        newToken && (
          <div className={classnames(styles.tokenList, styles.newList)}>
            <div className={styles.row}>
              <Token className={styles.token} token={newToken} hideBalance />
              <Button
                size="small"
                colorScheme="primary"
                onClick={() => {
                  storeNewToken(newToken);
                  setKeyword('');
                  updateTokens();
                }}
              >
                {t('Import')}
              </Button>
            </div>
          </div>
        )
      ) : (
        <TokenList className={styles.tokenList} tokens={filteredTokens} onPick={onPick} />
      )}
    </Dialog>
  );
};
