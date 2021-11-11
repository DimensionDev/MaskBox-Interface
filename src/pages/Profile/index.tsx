import { avatarImage } from '@/assets';
import { ArticleSection, Icon, LoadingIcon, NFTItem } from '@/components';
import { ThemeType, useNFTContract, useTheme, useWeb3Context } from '@/contexts';
import { getContractAddressConfig } from '@/lib';
import { RequestConnection } from '@/page-components';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import { useLocales } from './useLocales';

export const Profile: FC = () => {
  const t = useLocales();
  const { providerChainId } = useWeb3Context();
  const [loading, setLoading] = useState(false);
  const { tokens, getMyTokens } = useNFTContract();
  const { theme } = useTheme();
  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId)?.MaskboxNFT : ''),
    [providerChainId],
  );
  useEffect(() => {
    setLoading(true);
    getMyTokens(contractAddress).finally(() => setLoading(false));
  }, [getMyTokens, contractAddress]);

  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ArticleSection title={t('My Collectibles')}>
          {(() => {
            if (!providerChainId) return <RequestConnection />;
            if (loading)
              return (
                <div className={styles.status}>
                  <LoadingIcon size={36} />
                </div>
              );

            if (tokens.length === 0) {
              return (
                <div className={styles.status}>
                  <p className={styles.text}>{t('No items to display.')}</p>
                  <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
                </div>
              );
            }
            return (
              <ul className={styles.nftList}>
                {tokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem token={token} />
                  </li>
                ))}
              </ul>
            );
          })()}
        </ArticleSection>
      </main>
    </article>
  );
};
