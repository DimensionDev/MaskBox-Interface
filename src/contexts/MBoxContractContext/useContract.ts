import { MaskboxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { Contract } from 'ethers';
import { useMemo } from 'react';
import { useMaskboxAddress } from './useAddress';

export function useMaskboxContract() {
  const { ethersProvider } = useWeb3Context();
  const contractAddress = useMaskboxAddress();
  const contract = useMemo(() => {
    if (!contractAddress || !ethersProvider) return null;
    return new Contract(contractAddress, MaskboxABI, ethersProvider);
  }, [contractAddress, ethersProvider]);

  return contract;
}
