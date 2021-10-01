import { ArticleSection, Collection, Empty } from '@/components';
import { useMBoxContract } from '@/contexts';
import { BuyBox, MysteryBox, ShareBox, StatusOverlay } from '@/page-components';
import { FC, memo, useEffect, useState } from 'react';
import * as data from './data';
import styles from './index.module.less';

export const Details: FC = memo(() => {
  const [shareBoxOpen, setShareBoxOpen] = useState(false);
  const {
    collectionInfo: info,
    collectionPrice: price,
    getCollectionInfo,
    checkIsReadyToClaim,
  } = useMBoxContract();

  console.log('info', info);
  const startTime = info?._start_time ? info._start_time * 1000 : 0;
  const endTime = info?._end_time ? info._end_time * 1000 : 0;

  const [buyBoxOpen, setBuyBoxOpen] = useState(() => {
    console.log('startTime', startTime, 'endTime', endTime);
    if (!startTime || !endTime) {
      return false;
    }
    const now = Date.now();
    return now > startTime && now < endTime;
  });

  useEffect(() => {
    getCollectionInfo();
  }, [getCollectionInfo]);

  useEffect(() => {
    checkIsReadyToClaim();
  }, [checkIsReadyToClaim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBuyBoxOpen(() => {
        if (!startTime || !endTime) {
          return false;
        }
        const now = Date.now();
        return now > startTime && now < endTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Mystery box</h1>
        <MysteryBox className={styles.mysteryBox} />
        <ArticleSection title="Draw Probability">
          {info?._nft_list.length ? (
            <Collection collection={info} />
          ) : (
            <Empty description="No NFTs yet" />
          )}
        </ArticleSection>
        <ArticleSection title="Rule Introduction">
          <p dangerouslySetInnerHTML={{ __html: data.introduction }}></p>
        </ArticleSection>
        <ArticleSection title="Product Description">
          <p dangerouslySetInnerHTML={{ __html: data.description }}></p>
        </ArticleSection>
        <ArticleSection title="About Artist">
          <p dangerouslySetInnerHTML={{ __html: data.artist }}></p>
        </ArticleSection>
      </main>
      <BuyBox
        open={buyBoxOpen}
        onClose={() => setBuyBoxOpen(false)}
        onShare={() => setShareBoxOpen(true)}
      />
      <ShareBox open={shareBoxOpen} onClose={() => setShareBoxOpen(false)} />
      <StatusOverlay name={info?._name ?? '-'} start={startTime} end={endTime} />
    </>
  );
});
