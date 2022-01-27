import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Button, LoadingIcon, NFTItem, NFTItemSkeleton } from '@/components';
import { ERC721Token } from '@/types';
import { BigNumber } from 'ethers';
import { useLocales } from './useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  allLoaded: boolean;
  isLoading: boolean;
  tokens: ERC721Token[];
  pendingSize: number;
  soldTokens: ERC721Token[];
  contractName: string;
  onLoadmore: () => void | Promise<void>;
}

const PAGE_SIZE = BigNumber.from(25);
export const TokenTab: FC<Props> = ({
  tokens,
  pendingSize,
  soldTokens,
  allLoaded,
  isLoading,
  contractName,
  className,
  onLoadmore,
  ...rest
}) => {
  const t = useLocales();
  const loadedCount = tokens.length + soldTokens.length;
  return (
    <div className={classnames(className, styles.detailsContent)} {...rest}>
      <ul className={styles.nftList}>
        {soldTokens.map((token) => (
          <li key={token.tokenId}>
            <NFTItem contractName={contractName} token={token} sold />
          </li>
        ))}
        {tokens.map((token) => (
          <li key={token.tokenId}>
            <NFTItem contractName={contractName} token={token} sold={false} />
          </li>
        ))}
        {isLoading && !allLoaded
          ? Array.from({ length: pendingSize }, () => 0).map((_, index) => (
              <li key={`skeleton${index}`}>
                <NFTItemSkeleton sold={false} />
              </li>
            ))
          : null}
      </ul>
      {loadedCount > 0 && PAGE_SIZE.lte(tokens.length) ? (
        <Button
          className={styles.loadmore}
          disabled={allLoaded || isLoading}
          size="small"
          onClick={onLoadmore}
          leftIcon={isLoading ? <LoadingIcon size={16} /> : null}
          colorScheme="light"
        >
          {allLoaded
            ? t('All NFTs have been loaded :)')
            : t(isLoading ? 'Loading more' : 'Load more')}
        </Button>
      ) : null}
    </div>
  );
};
