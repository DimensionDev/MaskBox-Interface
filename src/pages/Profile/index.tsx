import { avatarImage } from '@/assets';
import { ArticleSection, NFTItem } from '@/components';
import { useNFTContract, useWeb3Context } from '@/contexts';
import { getContractAddressConfig } from '@/lib';
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

  console.log('my tokens', tokens);
  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ArticleSection title="My Collectibles">
          <ul className={styles.nftList}>
            {tokens.map((token) => (
              <li key={token.tokenId}>
                <NFTItem token={token} />
              </li>
            ))}
          </ul>
        </ArticleSection>
      </main>
    </article>
  );
};
