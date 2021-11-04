import { MysterBoxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { useOnceShowup } from '@/hooks';
import { ERC721Token as ERC721TokenType, ZERO } from '@/lib';
import { getStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { BigNumber, Contract } from 'ethers';
import { FC, HTMLProps, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { LoadingIcon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import styles from './index.module.less';

interface TokenListProps extends HTMLProps<HTMLUListElement> {
  tokens: ERC721TokenType[];
  onPick?: (token: ERC721TokenType) => void;
}

export const ERC721TokenList: FC<TokenListProps> = ({ tokens, className, onPick, ...rest }) => {
  const storedTokens = getStorage<ERC721TokenType[]>(StorageKeys.ERC721Tokens) ?? [];
  const addresses = storedTokens.map((t) => t.address);
  return (
    <ul className={classnames(styles.list, className)} {...rest}>
      {tokens.map((token) => (
        <li className={styles.item} key={token.address} onClick={() => onPick?.(token)}>
          <ERC721Token isCustomized={addresses.includes(token.address)} token={token} />
        </li>
      ))}
    </ul>
  );
};

interface ERC721TokenProps extends HTMLProps<HTMLDivElement> {
  token: ERC721TokenType;
  isCustomized?: boolean;
  hideBalance?: boolean;
}
export const ERC721Token: FC<ERC721TokenProps> = ({
  token,
  isCustomized,
  onClick,
  hideBalance,
  className,
  ...rest
}) => {
  const { account, ethersProvider } = useWeb3Context();
  const containerRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState<BigNumber>(ZERO);

  const [{ loading }, fetchBalance] = useAsyncFn(async () => {
    if (!ethersProvider || !account) return;
    const contract = new Contract(token.address, MysterBoxNFTABI, ethersProvider);
    const balanceResult: BigNumber = await contract.balanceOf(account);
    setBalance(balanceResult);
  }, [account, token.address, ethersProvider]);

  useOnceShowup(containerRef, fetchBalance);

  return (
    <div
      className={classnames(styles.token, className)}
      onClick={onClick}
      ref={containerRef}
      {...rest}
    >
      <div className={styles.icon}>
        <TokenIcon height="24" width="24" token={token} />
      </div>
      <div className={styles.info}>
        <div className={styles.symbol}>{token.symbol}</div>
        <div className={styles.name}>
          {token.name}
          {isCustomized && ' • Added by user'}
        </div>
      </div>
      {!hideBalance && (
        <div className={styles.balance}>
          {loading ? <LoadingIcon size={24} /> : balance.toString()}
        </div>
      )}
    </div>
  );
};
