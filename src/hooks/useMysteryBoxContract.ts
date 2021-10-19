import { MysteryBoxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getContractAddressConfig } from '@/lib';
import { Contract } from 'ethers';
import { useMemo } from 'react';

export function useMysteryBoxContract(requireSigner?: boolean) {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId).MysteryBox : ''),
    [providerChainId],
  );
  const contract = useMemo(() => {
    if (!contractAddress || !ethersProvider) return null;
    return new Contract(
      contractAddress,
      MysteryBoxABI,
      requireSigner ? ethersProvider.getSigner() : ethersProvider,
    );
  }, [contractAddress, ethersProvider, requireSigner]);

  return contract;
}
