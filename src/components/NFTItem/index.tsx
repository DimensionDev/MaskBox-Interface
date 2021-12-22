import { useLiveRef, useOnceShowup } from '@/hooks';
import { ERC721Token, ERC721TokenMeta } from '@/types';
import { fetchNFTTokenDetail } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, memo, useCallback, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { MediaViewer, MediaViewerSkeleton } from '../MediaViewer';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export interface NFTItemProps extends Omit<HTMLProps<HTMLDivElement>, 'disabled'> {
  contractName?: string;
  token: ERC721Token;
  sold?: boolean;
  disabled?: boolean;
  hoverEffect?: boolean;
}

export const NFTItem: FC<NFTItemProps> = ({
  className,
  contractName,
  token,
  sold,
  disabled,
  hoverEffect = true,
  ...rest
}) => {
  const t = useLocales();
  const ref = useRef<HTMLDivElement>(null);
  const [tokenMeta, setVerboseToken] = useState<ERC721TokenMeta>({
    name: token.name,
    image: token.image ?? '',
  });
  const liveRef = useLiveRef();
  const fetchDetail = useCallback(async () => {
    if (!token.tokenURI) {
      return;
    }
    const meta = await fetchNFTTokenDetail(token.tokenURI);
    if (liveRef.current) {
      setVerboseToken(meta);
    }
  }, [token.tokenId, token.tokenURI]);
  useOnceShowup(ref, fetchDetail);
  return (
    <div
      className={classnames(
        styles.nft,
        className,
        disabled ? styles.disabled : null,
        hoverEffect ? styles.hoverEffect : null,
      )}
      title={`${tokenMeta.name} #${token.tokenId}`}
      {...rest}
      ref={ref}
    >
      <MediaViewer
        className={styles.media}
        name={tokenMeta.name}
        image={tokenMeta.image}
        animationUrl={tokenMeta.animation_url}
      />
      <div className={styles.info}>
        {contractName && <h3 className={styles.contractName}>{contractName}</h3>}
        <h3 className={styles.name}>{tokenMeta.name || `#${token.tokenId}`}</h3>
        {sold !== undefined && (
          <h3 className={styles.saleStatus}>{sold ? t('Sold') : t('For Sale')}</h3>
        )}
      </div>
      {sold && <div className={styles.mask} />}
    </div>
  );
};

interface NFTItemSkeletonProps extends HTMLProps<HTMLDivElement> {
  sold?: boolean;
}

export const NFTItemSkeleton: FC<NFTItemSkeletonProps> = memo(({ className, sold, ...rest }) => {
  return (
    <div className={classnames(styles.nft, className)} {...rest}>
      <div className={styles.media}>
        <MediaViewerSkeleton className={styles.media} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.contractName}>
          <Skeleton width="50%" />
        </h3>
        <h3 className={styles.name}>
          <Skeleton width="40px" />
        </h3>
        {sold !== undefined && (
          <h3 className={styles.saleStatus}>
            <Skeleton width="20px" />
          </h3>
        )}
      </div>
    </div>
  );
});
