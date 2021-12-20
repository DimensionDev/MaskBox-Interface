import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Button, LoadingIcon, NFTItem } from '@/components';
import { ERC721Token } from '@/types';
import { BigNumber } from 'ethers';
import { useLocales } from './useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  allLoaded: boolean;
  isLoading: boolean;
  tokens: ERC721Token[];
  soldTokens: ERC721Token[];
  contractName: string;
  onLoadmore: () => void | Promise<void>;
}

const PAGE_SIZE = BigNumber.from(25);
export const TokenTab: FC<Props> = ({
  tokens,
  soldTokens,
  allLoaded,
  isLoading,
  contractName,
  className,
  onLoadmore,
  ...rest
}) => {
  const t = useLocales();
  if (tokens.length + soldTokens.length === 0) return null;
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
      </ul>
      {PAGE_SIZE.lte(tokens.length) ? (
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
