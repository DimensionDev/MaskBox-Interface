import { MaskboxABI } from '@/abi';
import { useMaskboxAddress, useWeb3Context } from '@/contexts';
import { Contract } from 'ethers';
import { useMemo } from 'react';

export function useMaskboxContract(requireSigner?: boolean) {
  const { ethersProvider } = useWeb3Context();
  const contractAddress = useMaskboxAddress();
  const contract = useMemo(() => {
    if (!contractAddress || !ethersProvider) return null;
    return new Contract(
      contractAddress,
      MaskboxABI,
      requireSigner ? ethersProvider.getSigner() : ethersProvider,
    );
  }, [contractAddress, ethersProvider, requireSigner]);

  return contract;
}
