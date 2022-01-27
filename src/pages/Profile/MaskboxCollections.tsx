import { Icon } from '@/components';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { useNftContractsOfQuery } from '@/graphql-hooks';
import { useERC721ContractList } from '@/hooks';
import { EMPTY_LIST } from '@/utils';
import { uniqBy } from 'lodash-es';
import { FC, useMemo } from 'react';
import { Collection } from './Collection';
import styles from './index.module.less';
import { useLocales } from './useLocales';

export const MaskboxCollections: FC = () => {
  const t = useLocales();
  const { account } = useWeb3Context();
  const { theme } = useTheme();
  const { data: nftContractsData, loading } = useNftContractsOfQuery({
    variables: {
      addr: account?.toLowerCase() ?? '',
    },
  });
  const { erc721Contracts } = useERC721ContractList();
  const contractAddresses = useMemo(() => {
    if (!nftContractsData?.user) return EMPTY_LIST;
    const onSubgraph = nftContractsData.user.nft_contracts.map((x) => x.address);
    const atLocale = erc721Contracts.map((contract) => contract.address);
    return uniqBy([...onSubgraph, ...atLocale], (addr) => addr.toLowerCase());
  }, [nftContractsData, erc721Contracts]);

  if (loading || contractAddresses.length === 0) {
    return (
      <div className={styles.status}>
        <div className={styles.text}>{t(loading ? 'Loading' : 'No items to display.')}</div>
        <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
      </div>
    );
  }
  return (
    <>
      {contractAddresses.map((address, index) => (
        <Collection key={address} defaultExpanded={index === 0} contractAddress={address} />
      ))}
    </>
  );
};
