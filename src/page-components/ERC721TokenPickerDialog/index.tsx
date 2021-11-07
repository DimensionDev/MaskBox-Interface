import {
  Button,
  ERC721Token,
  ERC721TokenList,
  Icon,
  Input,
  PickerDialog,
  PickerDialogProps,
} from '@/components';
import { useGetERC721Token } from '@/hooks';
import { ERC721Token as ERC721TokenType } from '@/lib';
import { getStorage, isSameAddress, setStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import { useERC721TokenList } from './useERC721TokenList';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  onPick?: (token: ERC721TokenType) => void;
}

function storeNewToken(newToken: ERC721TokenType) {
  const contracts = getStorage<ERC721TokenType[]>(StorageKeys.ERC721Tokens);
  setStorage(StorageKeys.ERC721Tokens, contracts ? [...contracts, newToken] : [newToken]);
}

export const ERC721TokenPickerDialog: FC<Props> = ({ onPick, ...rest }) => {
  const { erc721Tokens, updateERC721Tokens } = useERC721TokenList();
  const [keyword, setKeyword] = useState('');
  const getERC721Token = useGetERC721Token();
  const [newToken, setNewToken] = useState<ERC721TokenType | null>(null);

  const filteredContracts = useMemo(() => {
    const kw = keyword.toLowerCase();
    return erc721Tokens.filter((token) => {
      const { symbol, name, address } = token;
      return (
        symbol.toLowerCase().includes(kw) ||
        name.toLowerCase().includes(kw) ||
        address.toLowerCase().startsWith(kw)
      );
    });
  }, [keyword, erc721Tokens]);

  const isNewAddress = useMemo(() => {
    return (
      utils.isAddress(keyword) &&
      erc721Tokens.findIndex((token) => isSameAddress(token.address, keyword)) === -1
    );
  }, [keyword, erc721Tokens]);

  useEffect(() => {
    if (isNewAddress) {
      getERC721Token(keyword).then((token) => token && setNewToken(token));
    }
  }, [isNewAddress, keyword]);

  return (
    <PickerDialog className={styles.dialog} title="Seletct an NFT" {...rest}>
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
              <ERC721Token className={styles.token} token={newToken} hideBalance />
              <Button
                size="small"
                colorScheme="primary"
                onClick={() => {
                  storeNewToken(newToken);
                  setKeyword('');
                  updateERC721Tokens();
                }}
              >
                Import
              </Button>
            </div>
          </div>
        )
      ) : keyword && filteredContracts.length === 0 ? (
        <div className={styles.noResult}>
          No results for <strong className={styles.keyword}>{keyword}</strong>
        </div>
      ) : (
        <ERC721TokenList className={styles.tokenList} tokens={filteredContracts} onPick={onPick} />
      )}
    </PickerDialog>
  );
};
