import { avatarImage } from '@/assets';
import { ArticleSection, Collection, Empty, NeonButton } from '@/components';
import { useNFTContract } from '@/contexts';
import { BigNumber } from 'ethers';
import { FC, useEffect, useMemo } from 'react';
import styles from './index.module.less';

const wip = true;

export const Profile: FC = () => {
  const { tokens, getMyTokens } = useNFTContract();
  useEffect(() => {
    getMyTokens();
  }, [getMyTokens]);
  const isEmpty = tokens.length === 0;

  const myNfts = useMemo(() => {
    return tokens.map((uri, index) => ({
      latest_nft_id: BigNumber.from(index),
      // imageUrl: uri,
    }));
  }, [tokens]);

  if (wip) {
    // eslint-disable-next-line react/jsx-no-undef
    return <WipDialog />;
  }
  console.log('my tokens', tokens);
  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ArticleSection title="My Collectibles">
          {isEmpty ? (
            <div className={styles.emptyContainer}>
              <Empty description="Opps, There’s Nothing left here" />
            </div>
          ) : (
            <Collection
              className={styles.nftList}
              /* eslint-disable-next-line */
              // @ts-ignore
              collection={{
                _name: 'Mirror Editions',
                _nft_list: myNfts,
              }}
            />
          )}
        </ArticleSection>
        {!isEmpty && (
          <div className={styles.buttonGroup}>
            <NeonButton>Load More</NeonButton>
          </div>
        )}
      </main>
    </article>
  );
};
