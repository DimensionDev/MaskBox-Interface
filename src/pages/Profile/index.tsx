import { avatarImage } from '@/assets';
import { ArticleSection, NFTItem } from '@/components';
import { useNFTContract, useWeb3Context } from '@/contexts';
import { getContractAddressConfig } from '@/lib';
import { RequestConnection } from '@/page-components';
import { FC, useEffect, useMemo } from 'react';
import styles from './index.module.less';

export const Profile: FC = () => {
  const { providerChainId } = useWeb3Context();
  const { tokens, getMyTokens } = useNFTContract();
  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId)?.MysteryBoxNFT : ''),
    [providerChainId],
  );
  useEffect(() => {
    getMyTokens(contractAddress);
  }, [getMyTokens, contractAddress]);

  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ArticleSection title="My Collectibles">
          {providerChainId ? (
            <ul className={styles.nftList}>
              {tokens.map((token) => (
                <li key={token.tokenId}>
                  <NFTItem token={token} />
                </li>
              ))}
            </ul>
          ) : (
            <RequestConnection />
          )}
        </ArticleSection>
      </main>
    </article>
  );
};
