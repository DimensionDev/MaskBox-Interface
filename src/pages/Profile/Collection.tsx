import {
  ArticleSection,
  ArticleSectionProps,
  Icon,
  InfiniteLoading,
  LoadingIcon,
  NFTItem,
} from '@/components';
import { ThemeType, useTheme } from '@/contexts';
import { useERC721Contract, useLazyLoadERC721Tokens } from '@/hooks';
import classnames from 'classnames';
import { FC, useCallback } from 'react';
import styles from './index.module.less';
import { useLocales } from './useLocales';

interface Props extends Omit<ArticleSectionProps, 'title'> {
  contractAddress: string;
}

export const Collection: FC<Props> = ({ className, contractAddress, ...rest }) => {
  const { theme } = useTheme();
  const t = useLocales();

  const { tokens, balance, loadMore, loading, finished } = useLazyLoadERC721Tokens(
    contractAddress,
    false,
    5,
  );

  const collection = useERC721Contract(contractAddress);
  const handleReachBottom = useCallback(async () => {
    if (finished) return true;
    await loadMore();
  }, [finished, loadMore]);
  const name = collection ? collection.name || collection.symbol : '';
  return (
    <ArticleSection
      className={classnames(className, styles.collection)}
      title={`${name} ${balance.gt(0) ? `( ${balance.toString()} )` : ''}`}
      {...rest}
    >
      {(() => {
        if (tokens.length === 0) {
          if (loading) {
            return (
              <div className={styles.status}>
                <LoadingIcon size={36} />
              </div>
            );
          }
          return (
            <div className={styles.status}>
              <p className={styles.text}>{t('No items to display.')}</p>
              <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
            </div>
          );
        }
        return (
          <InfiniteLoading className={styles.listContainer} onReachBottom={handleReachBottom}>
            <ul className={styles.nftList}>
              {tokens.map((token) => (
                <li key={token.tokenId}>
                  <NFTItem token={token} />
                </li>
              ))}
            </ul>
            <div className={styles.bottom}>
              {loading ? <LoadingIcon size={16} /> : null}
              {loading
                ? t('Loading more')
                : t(finished ? `All {count} NFTs loaded` : `Loaded {count} NFTs`, {
                    count: tokens.length,
                  })}
            </div>
          </InfiniteLoading>
        );
      })()}
    </ArticleSection>
  );
};
