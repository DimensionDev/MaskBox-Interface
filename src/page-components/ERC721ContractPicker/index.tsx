import {
  Button,
  Dialog,
  DialogProps,
  ERC721Contract,
  ERC721ContractList,
  Icon,
  Input,
  LoadingIcon,
} from '@/components';
import { useERC721ContractList, useGetERC721Contract } from '@/hooks';
import { ERC721Contract as ERC721ContractType } from '@/lib';
import { getStorage, isSameAddress, setStorage, StorageKeys, useBoolean } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

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

  const [checking, startChecking, finishChecking] = useBoolean();
  useEffect(() => {
    if (isNewAddress) {
      startChecking();
      getERC721Contract(keyword).then(setNewContract).finally(finishChecking);
    }
  }, [isNewAddress, keyword, getERC721Contract]);

  let content: JSX.Element;
  if (isNewAddress) {
    if (checking) content = <LoadingIcon size={18} />;
    if (newContract) {
      content = (
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
      );
    } else {
      content = (
        <div className={styles.noResult}>
          {t('The contract address is incorrect or does not exist')}
        </div>
      );
    }
  } else if (keyword && filteredContracts.length === 0) {
    content = (
      <div className={styles.noResult}>
        {t('No results for')} <strong className={styles.keyword}>{keyword}</strong>
      </div>
    );
  } else {
    content = (
      <ERC721ContractList
        className={styles.tokenList}
        contracts={filteredContracts}
        onPick={onPick}
      />
    );
  }

  return (
    <Dialog className={styles.dialog} title={t('Seletct a Collection') as string} {...rest}>
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
