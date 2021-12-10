import { MaskboxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { Contract, utils } from 'ethers';
import { useMemo } from 'react';

export function useERC721InteractContract(address: string | undefined) {
  const { ethersProvider } = useWeb3Context();

  return useMemo(() => {
    if (!ethersProvider || !address || !utils.isAddress(address)) return null;
    return new Contract(address, MaskboxNFTABI, ethersProvider);
  }, [ethersProvider, address]);
}
