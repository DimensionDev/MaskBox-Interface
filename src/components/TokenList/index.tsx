import { useWeb3Context } from '@/contexts';
import { useOnceShowup } from '@/hooks';
import { TokenType, ZERO, ZERO_ADDRESS } from '@/lib';
import { formatBalance, getStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { BigNumber, Contract, utils } from 'ethers';
import { FC, HTMLProps, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { LoadingIcon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import styles from './index.module.less';

export * from './ERC721TokenList';

interface TokenListProps extends HTMLProps<HTMLUListElement> {
  tokens: TokenType[];
  onPick?: (token: TokenType) => void;
}

// TODO refactor with vitual list
export const TokenList: FC<TokenListProps> = ({ tokens, className, onPick, ...rest }) => {
  const storedERC721Tokens = getStorage<TokenType[]>(StorageKeys.ERC20Tokens) ?? [];
  const addresses = storedERC721Tokens.map((t) => t.address);
  return (
    <ul className={classnames(styles.list, className)} {...rest}>
      {tokens.map((token) => (
        <li className={styles.item} key={token.address} onClick={() => onPick?.(token)}>
          <Token isCustomized={addresses.includes(token.address)} token={token} />
        </li>
      ))}
    </ul>
  );
};

interface TokenProps extends HTMLProps<HTMLDivElement> {
  token: TokenType;
  isCustomized?: boolean;
  hideBalance?: boolean;
}
const erc20Abi = ['function balanceOf(address) view returns (uint256)'];
export const Token: FC<TokenProps> = ({
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
    if (token.address === ZERO_ADDRESS) {
      const balanceResult = await ethersProvider.getBalance(account);
      setBalance(balanceResult);
      return;
    } else {
      const contract = new Contract(token.address, erc20Abi, ethersProvider);
      const balanceResult: BigNumber = await contract.balanceOf(account);
      setBalance(balanceResult);
    }
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
          {loading ? <LoadingIcon size={24} /> : formatBalance(balance, token.decimals || 1, 4)}
        </div>
      )}
    </div>
  );
};
