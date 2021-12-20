import { RouteKeys } from '@/configs';
import { useMBoxContract, useNFTName } from '@/contexts';
import { useSoldNftListQuery } from '@/graphql-hooks';
import { useBox, useERC721TokensByIds, useGetERC721TokensByIds } from '@/hooks';
import { createShareUrl, ZERO } from '@/lib';
import { BuyBox, BuyBoxProps, Maskbox, ShareBox } from '@/page-components';
import { ERC721Token } from '@/types';
import { EMPTY_LIST, useBoolean } from '@/utils';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash-es';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { DescriptionTab } from './DescriptionTab';
import styles from './index.module.less';
import { TokenTab } from './TokenTab';
import { useLocales } from './useLocales';

const PAGE_SIZE = BigNumber.from(25);
export const Details: FC = memo(() => {
  const t = useLocales();
  const location = useLocation();
  const { getNftListForSale } = useMBoxContract();
  const [erc721Tokens, setErc721Tokens] = useState<ERC721Token[]>(EMPTY_LIST);
  const { search } = location;

  const { chainId, boxId } = useMemo(() => {
    const params = new URLSearchParams(search);
    const chainId = params.get('chain');
    const boxId = params.get('box');
    return {
      chainId: chainId ? parseInt(chainId, 10) : null,
      boxId,
    };
  }, [search]);

  const { boxOnSubgraph, boxOnRSS3, boxOnChain, refetch } = useBox(boxId ?? '');
  const box = useMemo(
    () => ({
      ...boxOnChain,
      ...boxOnRSS3,
      ...boxOnSubgraph,
    }),
    [boxOnChain, boxOnRSS3, boxOnSubgraph],
  );

  const [shareBoxVisible, openShareBox, closeShareBox] = useBoolean();
  const [purchasedNfts, setPurchasedNfts] = useState<string[]>(EMPTY_LIST);
  const [buyBoxVisible, openBuyBox, closeBuyBox] = useBoolean();

  const contractName = useNFTName(box.nft_address);
  const activities = box.activities ?? EMPTY_LIST;

  const cursorRef = useRef<BigNumber>(ZERO);
  const [allLoaded, setAllLoaded] = useState(false);
  const getERC721TokensByIds = useGetERC721TokensByIds(box.nft_address);
  const [isLoading, setIsLoading, setNotLoading] = useBoolean();
  const loadNfts = useCallback(async () => {
    if (!getERC721TokensByIds || !boxId) return;
    setIsLoading();
    const idList = await getNftListForSale(boxId, cursorRef.current, PAGE_SIZE);
    setAllLoaded(PAGE_SIZE.gt(idList.length));
    cursorRef.current = cursorRef.current.add(idList.length);
    const tokens = await getERC721TokensByIds(idList);
    setErc721Tokens((oldList) => uniqBy<ERC721Token>([...oldList, ...tokens], 'tokenId'));
    setNotLoading();
  }, [getERC721TokensByIds, boxId]);

  // excluded drawed by the maskbox creator
  const { data: soldNFTData } = useSoldNftListQuery({
    variables: {
      id: boxId ?? '',
    },
  });

  const { tokens: soldTokens } = useERC721TokensByIds(
    box?.nft_address,
    soldNFTData?.maskbox?.drawed_by_customer ?? EMPTY_LIST,
  );

  const handlePurchased: BuyBoxProps['onPurchased'] = useCallback(
    ({ nftIds }) => {
      closeBuyBox();
      openShareBox();
      setPurchasedNfts(nftIds);
      refetch();
      setErc721Tokens(EMPTY_LIST);
      cursorRef.current = ZERO;
      loadNfts();
    },
    [refetch, loadNfts],
  );

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
        <ul className={styles.tabList}>
          <li className={styles.tabItem}>
            <NavLink
              className={styles.tab}
              activeClassName={styles.selected}
              to={`${RouteKeys.DetailsTokenTab}${search}`}
            >
              {t('Details ({count} NFTs)', { count: box.total?.toString() || '??' })}
            </NavLink>
          </li>
          {activities.map((activity, index) => (
            <li className={styles.tab} key={index}>
              <NavLink
                className={styles.tab}
                activeClassName={styles.selected}
                to={`${RouteKeys.DetailsDescTab.replace(':index', `${index}`)}${search}`}
              >
                {activity.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.tabContents}>
          <Switch>
            <Route path={RouteKeys.DetailsTokenTab}>
              <TokenTab
                allLoaded={allLoaded}
                isLoading={isLoading}
                tokens={erc721Tokens}
                soldTokens={soldTokens}
                contractName={contractName}
                onLoadmore={loadNfts}
              />
            </Route>
            <Route path={RouteKeys.DetailsDescTab} component={DescriptionTab}>
              <DescriptionTab activities={activities} />
            </Route>
            <Redirect to={`${RouteKeys.DetailsTokenTab}${search}`} />
          </Switch>
        </div>
      </main>
      {shareBoxVisible && (
        <ShareBox
          nftIds={purchasedNfts}
          nftAddress={box.nft_address!}
          open
          onClose={closeShareBox}
          onShare={() => {
            const text = t('share-to-twitter', { link: window.location.href });
            const shareLink = createShareUrl(text);
            window.open(shareLink, 'noopener noreferrer');
          }}
        />
      )}
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
