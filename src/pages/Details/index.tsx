import { ArticleSection, Button, NFTItem } from '@/components';
import { useMBoxContract, useNFTContract, useNFTName, useWeb3Context } from '@/contexts';
import { ChainId, createShareUrl, ZERO } from '@/lib';
import {
  BuyBox,
  BuyBoxProps,
  MysteryBox,
  RequestConnection,
  RequestSwitchChain,
  ShareBox,
} from '@/page-components';
import { ERC721Token, ExtendedBoxInfo } from '@/types';
import { BigNumber } from 'ethers';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';

const PAGE_SIZE = BigNumber.from(50);
export const Details: FC = memo(() => {
  const { ethersProvider, isNotSupportedChain } = useWeb3Context();
  const history = useHistory();
  const { location } = history;
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

  const [shareBoxVisible, setShareBoxVisible] = useState(false);
  const [purchasedNfts, setPurchasedNfts] = useState<string[]>([]);
  const [buyBoxOpen, setBuyBoxVisible] = useState(false);

  const [box, setBox] = useState<Partial<ExtendedBoxInfo>>({});
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
    setErc721Tokens((oldList) => [...oldList, ...tokens]);
  }, [box?.nft_address, boxId]);

  const handlePurchased: BuyBoxProps['onPurchased'] = useCallback(({ nftIds }) => {
    setBuyBoxVisible(false);
    setShareBoxVisible(true);
    setPurchasedNfts(nftIds);
  }, []);

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
        <MysteryBox
          className={styles.mysteryBox}
          chainId={chainId}
          boxId={boxId}
          onLoad={setBox}
          onPurchase={() => setBuyBoxVisible(true)}
        />
        {erc721Tokens.length > 0 && (
          <ArticleSection title="Details">
            <div className={styles.detailsContent}>
              <ul className={styles.nftList}>
                {erc721Tokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem contractName={contractName} token={token} />
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
        onClose={() => setShareBoxVisible(false)}
        onShare={() => {
          const text = `I just draw an NFT on Maskbox platform, subscribe @realMaskNetwork for more updates - ${window.location.href}`;
          const shareLink = createShareUrl(text);
          window.open(shareLink, 'noopener noreferrer');
        }}
      />
      {payment && (
        <BuyBox
          open={buyBoxOpen}
          boxId={boxId}
          box={box}
          payment={payment}
          onPurchased={handlePurchased}
          onClose={() => setBuyBoxVisible(false)}
        />
      )}
    </>
  );
});
