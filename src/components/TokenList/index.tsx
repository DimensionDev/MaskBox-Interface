import { useWeb3Context } from '@/contexts';
import { useOnceShowup } from '@/hooks';
import { TokenType, ZERO } from '@/lib';
import classnames from 'classnames';
import { BigNumber, Contract, utils } from 'ethers';
import { FC, HTMLProps, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { LoadingIcon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import styles from './index.module.less';

interface TokenListProps extends HTMLProps<HTMLUListElement> {
  tokens: TokenType[];
  onPick?: (token: TokenType) => void;
}

// TODO refactor with vitual list
export const TokenList: FC<TokenListProps> = ({ tokens, className, onPick, ...rest }) => {
  return (
    <ul className={classnames(styles.list, className)} {...rest}>
      {tokens.map((token) => (
        <li className={styles.item} key={token.address} onClick={() => onPick?.(token)}>
          <Token token={token} />
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
    const contract = new Contract(token.address, erc20Abi, ethersProvider);
    const balanceResult: BigNumber = await contract.balanceOf(account);
    setBalance(balanceResult);
  }, [account, token.address]);

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
          {loading ? (
            <LoadingIcon type="loadingDark" size={24} />
          ) : (
            utils.formatUnits(balance, token.decimals)
          )}
        </div>
      )}
    </div>
  );
};
