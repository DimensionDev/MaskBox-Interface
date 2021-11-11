import { ArticleSection, Button, NFTItem, useDialog } from '@/components';
import { useMBoxContract, useNFTContract, useNFTName, useWeb3Context } from '@/contexts';
import { useSoldNftListQuery } from '@/graphql-hooks';
import { ChainId, createShareUrl, ZERO } from '@/lib';
import {
  BuyBox,
  BuyBoxProps,
  Maskbox,
  RequestConnection,
  RequestSwitchChain,
  ShareBox,
} from '@/page-components';
import { ERC721Token } from '@/types';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash-es';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useBox } from './useBox';
import { useGetTokensByIds } from './useGetTokensByIds';
import { useLocales } from './useLocales';

const PAGE_SIZE = BigNumber.from(50);
export const Details: FC = memo(() => {
  const t = useLocales();
  const { ethersProvider, isNotSupportedChain } = useWeb3Context();
  const location = useLocation();
  const { getNftListForSale } = useMBoxContract();
  const { getByIdList } = useNFTContract();
  const [erc721Tokens, setErc721Tokens] = useState<ERC721Token[]>([]);

  const { chainId, boxId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chainId = params.get('chain');
    const boxId = params.get('box');
    return {
      chainId: chainId ? parseInt(chainId, 10) : null,
      boxId,
    };
  }, [location.search]);

  const { boxOnSubgraph, boxOnRSS3, boxOnChain, refetch } = useBox(boxId ?? '');
  const box = useMemo(
    () => ({
      ...boxOnChain,
      ...boxOnRSS3,
      ...boxOnSubgraph,
    }),
    [boxOnChain, boxOnRSS3, boxOnSubgraph],
  );

  const [shareBoxVisible, openShareBox, closeShareBox] = useDialog();
  const [purchasedNfts, setPurchasedNfts] = useState<string[]>([]);
  const [buyBoxVisible, openBuyBox, closeBuyBox] = useDialog();

  const contractName = useNFTName(box.nft_address);
  const activities = box.activities ?? [];

  const cursorRef = useRef<BigNumber>(ZERO);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadNfts = useCallback(async () => {
    if (!box?.nft_address || !boxId) return;
    const idList = await getNftListForSale(boxId, cursorRef.current, PAGE_SIZE);
    setAllLoaded(PAGE_SIZE.gt(idList.length));
    cursorRef.current = cursorRef.current.add(idList.length);
    const tokens = await getByIdList(box.nft_address, idList);
    setErc721Tokens((oldList) => uniqBy<ERC721Token>([...oldList, ...tokens], 'tokenId'));
  }, [box?.nft_address, boxId]);

  const { data: soldNFTData } = useSoldNftListQuery({
    variables: {
      id: boxId ?? '',
    },
  });

  const soldTokens = useGetTokensByIds(box?.nft_address, soldNFTData?.maskbox?.sold_nft_list);

  const handlePurchased: BuyBoxProps['onPurchased'] = useCallback(
    ({ nftIds }) => {
      closeBuyBox();
      openShareBox();
      setPurchasedNfts(nftIds);
      refetch();
      setErc721Tokens([]);
      cursorRef.current = ZERO;
      loadNfts();
    },
    [refetch, loadNfts],
  );

  useEffect(() => {
    loadNfts();
  }, [loadNfts]);

  if (!ethersProvider) {
    return (
      <main className={styles.main}>
        <RequestConnection />
      </main>
    );
  }
  if (isNotSupportedChain) {
    return (
      <main className={styles.main}>
        <RequestSwitchChain chainId={chainId as ChainId} />
      </main>
    );
  }

  if (!chainId || !boxId) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Box is not found</h1>
      </main>
    );
  }
  const payment = box.payment?.[0];

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Mystery box</h1>
        <Maskbox
          className={styles.maskbox}
          boxOnSubgraph={boxOnSubgraph}
          boxOnChain={boxOnChain}
          boxOnRSS3={boxOnRSS3}
          onPurchase={openBuyBox}
        />
        {erc721Tokens.length + soldTokens.length > 0 && (
          <ArticleSection title={t('Details')}>
            <div className={styles.detailsContent}>
              <ul className={styles.nftList}>
                {soldTokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem contractName={contractName} token={token} sold />
                  </li>
                ))}
                {erc721Tokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem contractName={contractName} token={token} sold={false} />
                  </li>
                ))}
              </ul>
              {PAGE_SIZE.lte(erc721Tokens.length) ? (
                <Button
                  className={styles.loadmore}
                  fullWidth
                  disabled={allLoaded}
                  size="small"
                  onClick={loadNfts}
                >
                  {allLoaded ? ' All NFTs have been loaded :)' : 'Load more'}
                </Button>
              ) : null}
            </div>
          </ArticleSection>
        )}
        {activities.map((activity, index) => (
          <ArticleSection title={activity.title} key={index}>
            {activity.body}
          </ArticleSection>
        ))}
      </main>
      <ShareBox
        nftIds={purchasedNfts}
        nftAddress={box.nft_address!}
        open={shareBoxVisible}
        onClose={closeShareBox}
        onShare={() => {
          const text = `I just draw an NFT on Maskbox platform, subscribe @realMaskNetwork for more updates - ${window.location.href}`;
          const shareLink = createShareUrl(text);
          window.open(shareLink, 'noopener noreferrer');
        }}
      />
      {payment && (
        <BuyBox
          open={buyBoxVisible}
          boxId={boxId}
          box={box}
          payment={payment}
          onPurchased={handlePurchased}
          onClose={closeBuyBox}
        />
      )}
    </>
  );
});
