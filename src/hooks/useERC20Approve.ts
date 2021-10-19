import { ERC20_ABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { BigNumber, Contract } from 'ethers';
import { useCallback } from 'react';

export function useERC20Approve() {
  const { ethersProvider, providerChainId } = useWeb3Context();

  const approve = useCallback(async (addr: string, operator: string, amount: BigNumber) => {
    if (!ethersProvider || !providerChainId || isSameAddress(addr, ZERO_ADDRESS)) return;
    const contract = new Contract(addr, ERC20_ABI, ethersProvider.getSigner());
    return await contract.approve(operator, amount);
  }, []);

  return approve;
}
