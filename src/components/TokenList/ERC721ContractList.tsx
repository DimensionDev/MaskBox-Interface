import { MaskboxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { useOnceShowup } from '@/hooks';
import { ERC721Contract as ERC721ContractType, ZERO } from '@/lib';
import { getStorage, StorageKeys } from '@/utils';
import classnames from 'classnames';
import { BigNumber, Contract } from 'ethers';
import { FC, HTMLProps, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { LoadingIcon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface ContractListProps extends HTMLProps<HTMLUListElement> {
  contracts: ERC721ContractType[];
  onPick?: (token: ERC721ContractType) => void;
}

export const ERC721ContractList: FC<ContractListProps> = ({
  contracts,
  className,
  onPick,
  ...rest
}) => {
  const storedTokens = getStorage<ERC721ContractType[]>(StorageKeys.ERC721Contracts) ?? [];
  const addresses = storedTokens.map((t) => t.address);
  return (
    <ul className={classnames(styles.list, className)} {...rest}>
      {contracts.map((contract) => (
        <li className={styles.item} key={contract.address}>
          <ERC721Contract
            isCustomized={addresses.includes(contract.address)}
            token={contract}
            role="button"
            onClick={() => onPick?.(contract)}
          />
        </li>
      ))}
    </ul>
  );
};

interface ERC721TokenProps extends HTMLProps<HTMLDivElement> {
  token: ERC721ContractType;
  isCustomized?: boolean;
  hideBalance?: boolean;
}
export const ERC721Contract: FC<ERC721TokenProps> = ({
  token,
  isCustomized,
  onClick,
  hideBalance,
  className,
  ...rest
}) => {
  const t = useLocales();
  const { account, ethersProvider } = useWeb3Context();
  const containerRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState<BigNumber>(ZERO);

  const [{ loading }, fetchBalance] = useAsyncFn(async () => {
    if (!ethersProvider || !account) return;
    const contract = new Contract(token.address, MaskboxNFTABI, ethersProvider);
    const balanceResult: BigNumber = await contract.balanceOf(account);
    setBalance(balanceResult);
  }, [account, token.address, ethersProvider]);

  useOnceShowup(containerRef, fetchBalance);
  const hasNoToken = balance.eq(0);

  return (
    <div
      className={classnames(className, styles.token, { [styles.disabled]: hasNoToken })}
      onClick={onClick}
      title={hasNoToken && !loading ? t('You have no NFT of this kind for sale') : undefined}
      ref={containerRef}
      {...rest}
    >
      <div className={styles.icon}>
        <TokenIcon height="24" width="24" token={token} />
      </div>
      <div className={styles.info}>
        <div className={styles.symbol}>{token.symbol || '<no symbol>'}</div>
        <div className={styles.name}>
          {token.name || '<no name>'}
          {isCustomized && ` • ${t('Added by uesr')}`}
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
