import {
  Button,
  Dialog,
  DialogProps,
  ERC721Contract,
  ERC721ContractList,
  Icon,
  Input,
} from '@/components';
import { useGetERC721Contract } from '@/hooks';
import { ERC721Contract as ERC721ContractType } from '@/lib';
import { getStorage, isSameAddress, setStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';
import { useERC721ContractList } from './useERC721ContractList';

interface Props extends DialogProps {
  onPick?: (token: ERC721ContractType) => void;
}

function storeNewToken(newToken: ERC721ContractType) {
  const contracts = getStorage<ERC721ContractType[]>(StorageKeys.ERC721Contracts);
  setStorage(StorageKeys.ERC721Contracts, contracts ? [...contracts, newToken] : [newToken]);
}

export const ERC721ContractPicker: FC<Props> = ({ onPick, ...rest }) => {
  const t = useLocales();
  const { erc721Contracts, updateERC721Contracts } = useERC721ContractList();
  const [keyword, setKeyword] = useState('');
  const getERC721Contract = useGetERC721Contract();
  const [newContract, setNewContract] = useState<ERC721ContractType | null>(null);

  const filteredContracts = useMemo(() => {
    const kw = keyword.toLowerCase();
    return erc721Contracts.filter((token) => {
      const { symbol, name, address } = token;
      return (
        symbol.toLowerCase().includes(kw) ||
        name.toLowerCase().includes(kw) ||
        address.toLowerCase().startsWith(kw)
      );
    });
  }, [keyword, erc721Contracts]);

  const isNewAddress = useMemo(() => {
    return (
      utils.isAddress(keyword) &&
      erc721Contracts.findIndex((token) => isSameAddress(token.address, keyword)) === -1
    );
  }, [keyword, erc721Contracts]);

  useEffect(() => {
    if (isNewAddress) {
      getERC721Contract(keyword).then((contract) => contract && setNewContract(contract));
    }
  }, [isNewAddress, keyword, getERC721Contract]);

  return (
    <Dialog className={styles.dialog} title={t('Select an NFT') as string} {...rest}>
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
        newContract && (
          <div className={classnames(styles.tokenList, styles.newList)}>
            <div className={styles.row}>
              <ERC721Contract className={styles.token} token={newContract} hideBalance />
              <Button
                size="small"
                colorScheme="primary"
                onClick={() => {
                  storeNewToken(newContract);
                  setKeyword('');
                  updateERC721Contracts();
                }}
              >
                {t('Import')}
              </Button>
            </div>
          </div>
        )
      ) : keyword && filteredContracts.length === 0 ? (
        <div className={styles.noResult}>
          {t('No results for')} <strong className={styles.keyword}>{keyword}</strong>
        </div>
      ) : (
        <ERC721ContractList
          className={styles.tokenList}
          contracts={filteredContracts}
          onPick={onPick}
        />
      )}
    </Dialog>
  );
};
