import { MaskboxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ERC721Contract } from '@/lib';
import { Contract } from 'ethers';
import { useCallback } from 'react';

export function useGetERC721Contract() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const getContract = useCallback(
    async (addr: string) => {
      if (!ethersProvider || !chainId) return;
      const contract = new Contract(addr, MaskboxNFTABI, ethersProvider);
      const token = Promise.all([contract.name(), contract.symbol()]).then(([name, symbol]) => {
        return {
          name: name as string,
          chainId,
          address: addr,
          symbol: symbol as string,
        } as ERC721Contract;
      });
      return token;
    },
    [ethersProvider, chainId],
  );
  return getContract;
}
