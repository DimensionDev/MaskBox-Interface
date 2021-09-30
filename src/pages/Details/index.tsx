import { ArticleSection, Collection, Empty, NewsletterBox } from '@/components';
import { useMBoxContract } from '@/contexts';
import { BuyBox, MysteryBox, ShareBox, StatusOverlay } from '@/page-components';
import { FC, memo, useEffect, useState } from 'react';
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
      <MysteryBox price={price} onOpen={() => setBuyBoxOpen(true)} />
      <div className={styles.main}>
        <ArticleSection title="Series Content">
          {info?._nft_list.length ? (
            <Collection collection={info} />
          ) : (
            <Empty description="No NFTs yet" />
          )}
        </ArticleSection>
        <ArticleSection title="Rule Introduction">
          {`Life is full of surprises in all forms of vibrant and luscious splendours. This year My
            Neighbour Alice brings an NFT festival referencing the real-world Midsummer celebrations
          during the summer solstice in Scandinavia. This Special Mystery Basket is hand-picked by
          Alice for you and your loved ones to celebrate the hottest season of the year - Midsummer.
          The Midsummer with Alice is a time of merriment and festivities. Festival bonfires are lit
          around all of Alice's farms and villages to celebrate this special occasion.`}
        </ArticleSection>
        <ArticleSection title="Product Description">
          {`In the Midsummer with Alice NFT festival, there will be 40.000 Mystery Baskets on sale,
            including 2.000 boxes reserved for the community. Each Mystery Basket contains 1 random
          NFT from 16 varieties. Every user can only buy a maximum of 40 boxes. Alice Mystery Basket
          rewards:`}
          <br />
          {`1) There's a mix of exclusive to Binance Marketplace beautifully crafted and
            Midsummer-themed My Neighbor Alice wearables and items spread across these baskets.`}
          <br />
          {`2) A mystery basket including redeemable in-game cosmetics, which will be redeemed in the
  My Neighbor Alice game and Alice's Mysterious Seed mini-game.`}
          <br />
          {`3) You will have a unique opportunity to acquire and enhance your plot with some of the
  most fun, cute and rare animals and characters from Alice's backyard. The lucky ones among
          the NFT holders who get the SSR Animal NFT (Barn Animals) will enjoy the privilege to get
          new animals when they appear on the farm.`}
          <br />
          {`4) Alice's Mystery Basket NFT series will be compatible with Alice's NFTs on Binance Smart
            Chain (Once the withdrawal function feature is available). Binance reserves the right to
          disqualify trades that are deemed to be wash trades or illegally bulk registered accounts,
          as well as trades that display attributes of self-dealing or market manipulation.`}
        </ArticleSection>
        <ArticleSection title="About Artist">
          {`The ALICE Midsummer NFT sale was carefully crafted for you by My Neighbor Alice's team. My
            Neighbor Alice is a multiplayer builder game where players build and create virtual lands,
          interact with neighbors, perform exciting daily activities and earn rewards. Anyone can
          join the world by owning or renting a virtual island and participating in various
          activities such as farming, fishing, bug catching, and beekeeping.`}
        </ArticleSection>
        <NewsletterBox />
      </div>
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