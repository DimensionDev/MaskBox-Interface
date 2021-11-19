import { ERC20_ABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ZERO, ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';

export function useBalance(addr?: string) {
  const { account, ethersProvider } = useWeb3Context();
  const [balance, setBalance] = useState<BigNumber>(ZERO);

  useEffect(() => {
    if (!ethersProvider || !account || !addr) {
      return;
    }
    if (isSameAddress(addr, ZERO_ADDRESS)) {
      ethersProvider.getBalance(account).then(setBalance);
    } else {
      const tokenContract = new Contract(addr, ERC20_ABI, ethersProvider);
      tokenContract.balanceOf(account).then(setBalance);
    }
  }, [ethersProvider, account, addr]);

  return balance;
}
