import { ERC20_ABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ZERO, ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { BigNumber, Contract } from 'ethers';
import { useCallback } from 'react';

export function useGetERC20Allowance() {
  const { account, ethersProvider, providerChainId } = useWeb3Context();
  const getAllowance = useCallback(
    async (addr: string, spender: string) => {
      if (!ethersProvider || !providerChainId || isSameAddress(addr, ZERO_ADDRESS)) return ZERO;
      const contract = new Contract(addr, ERC20_ABI, ethersProvider);
      const allowance: BigNumber = await contract.allowance(account, spender);
      return allowance;
    },
    [ethersProvider, providerChainId],
  );
  return getAllowance;
}
