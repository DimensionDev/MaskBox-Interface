import { MaskboxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ERC721Token } from '@/lib';
import { Contract } from 'ethers';
import { useCallback } from 'react';

// TODO refactor to `const token = useERC20Token(address)`
export function useGetERC721Token() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const getToken = useCallback(
    async (addr: string) => {
      if (!ethersProvider || !chainId) return;
      const contract = new Contract(addr, MaskboxNFTABI, ethersProvider);
      const token = Promise.all([contract.name(), contract.symbol()]).then(([name, symbol]) => {
        return {
          name: name as string,
          chainId,
          address: addr,
          symbol: symbol as string,
        } as ERC721Token;
      });
      return token;
    },
    [ethersProvider, chainId],
  );
  return getToken;
}
