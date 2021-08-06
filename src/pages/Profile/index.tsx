import React, { FC, useMemo } from 'react';
import { avatarImage } from '@/assets';
import styles from './index.module.less';
import { ArticleSection, Empty, NeonButton, NFTList } from '@/components';
import { myNfts } from '@/data';

export const Profile: FC = () => {
  const randomEmpty = useMemo(() => Math.random() > 0.8, []);
  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ArticleSection title="My Collectibles">
          {randomEmpty ? (
            <div className={styles.emptyContainer}>
              <Empty description="Opps, There’s Nothing left here" />
            </div>
          ) : (
            <NFTList className={styles.nftList} nfts={myNfts}></NFTList>
          )}
        </ArticleSection>
        {!randomEmpty && (
          <div className={styles.buttonGroup}>
            <NeonButton>Load More</NeonButton>
          </div>
        )}
      </main>
    </article>
  );
};
