import { ArticleSection, Button, NFTItem, PickerDialog } from '@/components';
import { useMBoxContract, useNFTContract } from '@/contexts';
import { ZERO } from '@/lib';
import { MysteryBox } from '@/page-components';
import { ERC721Token, ExtendedBoxInfo } from '@/types';
import { BigNumber } from 'ethers';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.less';

const PAGE_SIZE = BigNumber.from(10);
export const Details: FC = memo(() => {
  const location = useLocation();
  const { getNftListForSale } = useMBoxContract();
  const { getByIdList } = useNFTContract();
  const [erc721Tokens, setErc721Tokens] = useState<ERC721Token[]>([]);

  const { chainId, boxId, isNew } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chainId = params.get('chain');
    const boxId = params.get('box');
    return {
      chainId: chainId ? parseInt(chainId, 10) : null,
      boxId,
      isNew: !!params.get('new'),
    };
  }, [location.search]);

  const [urlBoxVisible, setUrlBoxVisible] = useState(isNew);
  const boxUrl = `${window.location.origin}/#/details?chain=${chainId}&box=${boxId}`;
  const shareLink = new URL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(boxUrl)}`)
    .href;

  const [box, setBox] = useState<Partial<ExtendedBoxInfo>>({});
  const activities = box.activities ?? [];

  const cursorRef = useRef<BigNumber>(ZERO);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadNfts = useCallback(async () => {
    if (!box?.nft_address || !boxId) return;
    const idList = await getNftListForSale(boxId, cursorRef.current, PAGE_SIZE);
    console.log({ idList });
    setAllLoaded(PAGE_SIZE.gt(idList.length));
    cursorRef.current = cursorRef.current.add(idList.length);
    const tokens = await getByIdList(box.nft_address, idList);
    setErc721Tokens((oldList) => [...oldList, ...tokens]);
  }, [box?.nft_address, boxId]);

  useEffect(() => {
    loadNfts();
  }, [loadNfts]);

  if (!chainId || !boxId) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Box is not found</h1>
      </main>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Mystery box</h1>
        <MysteryBox className={styles.mysteryBox} chainId={chainId} boxId={boxId} onLoad={setBox} />
        {erc721Tokens.length > 0 && (
          <ArticleSection title="Details">
            <div className={styles.detailsContent}>
              <ul className={styles.nftList}>
                {erc721Tokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem token={token} />
                  </li>
                ))}
              </ul>
              <Button className={styles.loadmore} fullWidth disabled={allLoaded} onClick={loadNfts}>
                {allLoaded ? 'No more' : 'Load more'}
              </Button>
            </div>
          </ArticleSection>
        )}
        {activities.map((activity, index) => (
          <ArticleSection title={activity.title} key={index}>
            {activity.body}
          </ArticleSection>
        ))}
      </main>
      <PickerDialog title="Share" open={urlBoxVisible} onClose={() => setUrlBoxVisible(false)}>
        <div className={styles.urlBoxContent}>
          <p>
            Copy following url, and <a href={shareLink}>share</a> on twitter
          </p>
          <div className={styles.url}>
            <a target="_blank" rel="noopener noreferrer">
              {boxUrl}
            </a>
          </div>
        </div>
      </PickerDialog>
    </>
  );
});
