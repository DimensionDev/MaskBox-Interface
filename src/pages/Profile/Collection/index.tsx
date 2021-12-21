import {
  ArticleSectionProps,
  Button,
  CollectionLogo,
  Icon,
  LoadingCircle,
  NFTItem,
} from '@/components';
import { ThemeType, useTheme } from '@/contexts';
import { useERC721Contract, useLazyLoadERC721Tokens } from '@/hooks';
import classnames from 'classnames';
import { FC, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends Omit<ArticleSectionProps, 'title'> {
  contractAddress: string;
  defaultExpanded?: boolean;
}

export const Collection: FC<Props> = ({ className, contractAddress, defaultExpanded, ...rest }) => {
  const { theme } = useTheme();
  const t = useLocales();
  const { tokens, balance, loadMore, loading, finished } = useLazyLoadERC721Tokens(
    contractAddress,
    false,
    10,
  );
  const [isExpanded, setExpanded] = useState(defaultExpanded);
  const toggleExpanded = () => setExpanded((v) => !v);

  const collection = useERC721Contract(contractAddress);
  const name = collection ? collection.name || collection.symbol : '';
  return (
    <div
      className={classnames(className, styles.collection)}
      title={`${name} ${balance.gt(0) ? `( ${balance.toString()} )` : ''}`}
      {...rest}
    >
      <div className={styles.header} role="button" onClick={toggleExpanded}>
        <CollectionLogo className={styles.logo} sizes="24px" />
        <span className={styles.name}>
          {`${name} ${balance.gt(0) ? `( ${balance.toString()} )` : ''}`}
        </span>
        <Icon className={styles.arrow} type={isExpanded ? 'arrowUp' : 'arrowDown'} size={20} />
      </div>
      <div className={classnames(styles.content, isExpanded ? styles.expanded : undefined)}>
        {(() => {
          if (tokens.length === 0) {
            return loading ? (
              <div className={styles.status}>
                <LoadingCircle size={48} />
              </div>
            ) : (
              <div className={styles.status}>
                <p className={styles.text}>{t('No items to display.')}</p>
                <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
              </div>
            );
          }
          return (
            <div>
              <ul className={styles.nftList}>
                {tokens.map((token) => (
                  <li key={token.tokenId}>
                    <NFTItem token={token} />
                  </li>
                ))}
              </ul>
              <div className={styles.bottom}>
                {!finished && (
                  <Button onClick={loadMore} disabled={loading} size="small" colorScheme="light">
                    {t(loading ? 'Loading more' : 'Load more')}
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
