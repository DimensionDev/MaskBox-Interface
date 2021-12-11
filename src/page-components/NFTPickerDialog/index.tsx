import {
  Button,
  Dialog,
  DialogProps,
  Hint,
  Icon,
  Input,
  LoadingIcon,
  SelectableNFTList,
  SelectableNFTListProps,
} from '@/components';
import { useCheckIsOwned, useGetERC721TokensByIds } from '@/hooks';
import { ERC721Token } from '@/types';
import { useBoolean } from '@/utils';
import classnames from 'classnames';
import { uniq } from 'lodash-es';
import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';
import { Search } from './Search';

interface Props extends DialogProps, Pick<SelectableNFTListProps, 'tokens' | 'selectedTokenIds'> {
  onConfirm?: (ids: string[]) => void;
  contractAddress: string;
  loading: boolean;
}
const limit = 1000;
export const NFTPickerDialog: FC<Props> = ({
  tokens,
  contractAddress,
  selectedTokenIds = [],
  onConfirm,
  loading,
  onClose,
  ...rest
}) => {
  const t = useLocales();
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching, setNotSearching] = useBoolean();
  const [searchVisible, openSearch, closeSearch] = useBoolean();
  const [pickedIds, setPickedIds] = useState(selectedTokenIds);
  const [notOwnedIds, setNotOwnedIds] = useState<string[]>([]);
  const getERC721TokensByIds = useGetERC721TokensByIds(contractAddress);
  const [searchedTokens, setSearchedTokens] = useState<ERC721Token[]>([]);

  useEffect(() => {
    setPickedIds(selectedTokenIds);
  }, [selectedTokenIds]);

  useEffect(() => {
    if (!keyword.trim().length) {
      closeSearch();
    }
  }, [keyword]);

  const tokenIds = useMemo(() => {
    const seps = keyword.split(',');
    return seps.map((id) => id.trim()).filter(Boolean);
  }, [keyword]);

  const checkIsOwned = useCheckIsOwned(contractAddress);
  const search = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (!keyword || tokenIds.length === 0) return;
      openSearch();
      setIsSearching();
      const [tokens, isOwnedFlags] = await Promise.all([
        getERC721TokensByIds(tokenIds),
        Promise.all(tokenIds.map((id) => checkIsOwned(id))),
      ]);
      const ids = tokens.filter((_, index) => !isOwnedFlags[index]).map((t) => t.tokenId);
      setNotOwnedIds(ids);
      setSearchedTokens(tokens.filter((_, index) => isOwnedFlags[index]));
      setNotSearching();
    },
    [tokenIds, getERC721TokensByIds],
  );

  return (
    <Dialog
      {...rest}
      title={t('Select your collection')}
      onClose={() => {
        onClose?.();
        setPickedIds(selectedTokenIds);
      }}
    >
      <form onSubmit={search}>
        <div className={styles.searchGroup}>
          <Input
            fullWidth
            value={keyword}
            className={styles.input}
            placeholder={t('Token ID separated by comma, e.g. 23453, 2565') as string}
            onChange={(evt) => setKeyword(evt.currentTarget.value)}
            leftAddon={<Icon type="search" size={24} />}
          />
          <Button round={false} disabled={!keyword} type="submit" colorScheme="primary">
            {t('Search')}
          </Button>
        </div>
      </form>
      {searchVisible ? (
        <Search
          tokens={searchedTokens}
          notOwnedIds={notOwnedIds}
          limit={limit}
          loading={isSearching}
          selectedTokenIds={pickedIds}
          onConfirm={(ids) => {
            if (ids.join() !== pickedIds.join()) {
              setPickedIds(uniq([...pickedIds, ...ids]));
            }
            closeSearch();
          }}
        />
      ) : null}
      <div style={{ display: searchVisible ? 'none' : 'block' }}>
        <SelectableNFTList
          tokens={tokens}
          loading={loading}
          limit={limit}
          selectedTokenIds={pickedIds}
          onChange={setPickedIds}
          className={styles.selectList}
        />
        <div className={styles.summary}>
          {pickedIds.length >= limit && (
            <span className={styles.warning}>
              {t('The mystery box contract supports up to {limit} NFTs for sale.', { limit })}
            </span>
          )}
          <span className={classnames(styles.picked, styles.error)}>{pickedIds.length}</span> /{' '}
          <span className={styles.total}>{tokens.length}</span>
          <Hint width={256} position="right">
            {t('The maximum number of NFTs to be sold in one mystery box contract is {limit}.', {
              limit,
            })}
          </Hint>
          {loading && <LoadingIcon size={14} />}
        </div>
        <div className={styles.buttonGroup}>
          <Button fullWidth onClick={() => onConfirm?.(pickedIds)} colorScheme="primary">
            {t('Confirm')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
