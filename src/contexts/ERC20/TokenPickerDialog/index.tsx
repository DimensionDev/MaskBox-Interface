import {
  Button,
  Icon,
  Input,
  Dialog,
  DialogProps,
  Token,
  TokenList,
  LoadingIcon,
} from '@/components';
import { useTokenList } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/erc20/useGetERC20TokenInfo';
import { TokenType } from '@/lib';
import { getStorage, isSameAddress, setStorage, StorageKeys, useBoolean } from '@/utils';
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

  const [checking, startChecking, finishChecking] = useBoolean();
  useEffect(() => {
    if (isNewAddress) {
      startChecking();
      getERC20Token(keyword).then(setNewToken).finally(finishChecking);
    }
  }, [isNewAddress, keyword]);

  let content: JSX.Element;
  if (isNewAddress) {
    if (checking) content = <LoadingIcon size={18} />;
    if (newToken) {
      content = (
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
      );
    } else {
      content = (
        <div className={styles.noResult}>
          {t('The contract address is incorrect or does not exist')}
        </div>
      );
    }
  } else {
    content = <TokenList className={styles.tokenList} tokens={filteredTokens} onPick={onPick} />;
  }

  return (
    <Dialog className={styles.dialog} title={t('Seletct a Token') as string} {...rest}>
      <div className={styles.searchGroup}>
        <Input
          fullWidth
          round
          className={styles.input}
          value={keyword}
          spellCheck={false}
          onChange={(evt) => setKeyword(evt.currentTarget.value)}
          placeholder={t('Search name or paste address') as string}
          leftAddon={<Icon type="search" size={24} />}
        />
      </div>
      {content}
    </Dialog>
  );
};
