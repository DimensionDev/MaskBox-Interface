import { avatarImage } from '@/assets';
import { useWeb3Context } from '@/contexts';
import { useNftContractsOfQuery } from '@/graphql-hooks';
import { useERC721ContractList } from '@/page-components/ERC721ContractPicker/useERC721ContractList';
import { EMPTY_LIST } from '@/utils';
import { uniqBy } from 'lodash-es';
import { FC, useMemo } from 'react';
import { Collection } from './Collection';
import styles from './index.module.less';

export const Profile: FC = () => {
  const { account } = useWeb3Context();
  const { data: nftContractsData } = useNftContractsOfQuery({
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

  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        {contractAddresses.map((address) => (
          <Collection key={address} contractAddress={address} />
        ))}
      </main>
    </article>
  );
};
