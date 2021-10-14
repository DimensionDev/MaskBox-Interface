import {
  BaseButton as Button,
  Icon,
  Input,
  PickerDialog,
  PickerDialogProps,
  Token,
  TokenList,
} from '@/components';
import { useWeb3Context } from '@/contexts';
import { useTokenList } from '@/hooks';
import { TokenType } from '@/lib';
import { getStorage, isSameAddress, setStorage } from '@/utils';
import classnames from 'classnames';
import { Contract, utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  onPick?: (token: TokenType) => void;
}

const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

function storeNewTokens(newToken: TokenType) {
  const tokens = getStorage<TokenType[]>('tokens');
  setStorage('tokens', tokens ? [...tokens, newToken] : [newToken]);
}

export const TokenPickerDialog: FC<Props> = ({ onPick, ...rest }) => {
  const { tokens, updateTokens } = useTokenList();
  const [keyword, setKeyword] = useState('');
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

  const { ethersProvider, providerChainId } = useWeb3Context();
  useEffect(() => {
    if (!ethersProvider || !providerChainId || !isNewAddress) return;
    const contract = new Contract(keyword, abi, ethersProvider);
    Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(
      ([name, symbol, decimals]) => {
        setNewToken({
          address: keyword,
          chainId: providerChainId as number,
          name: `${name as string} • Added by user`,
          symbol: symbol as string,
          decimals: decimals as number,
          logoURI: '',
        });
      },
    );
  }, [isNewAddress, keyword, ethersProvider, providerChainId]);

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
