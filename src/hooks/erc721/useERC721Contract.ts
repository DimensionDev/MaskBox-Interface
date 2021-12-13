import { MaskboxNFTABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { ERC721Contract } from '@/lib';
import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export function useGetERC721Contract() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const getContract = useCallback(
    async (addr: string) => {
      if (!ethersProvider || !chainId) return null;
      const contract = new Contract(addr, MaskboxNFTABI, ethersProvider);
      const namePromise = contract.name().catch(() => null);
      const symbolPromise = contract.symbol().catch(() => null);
      const token = await Promise.all([namePromise, symbolPromise]).then(([name, symbol]) => {
        if (!name && !symbol) return null;
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

export function useERC721Contract(address: string | undefined) {
  const [contract, setContract] = useState<ERC721Contract | null>();

  const getContract = useGetERC721Contract();
  useEffect(() => {
    if (!address) {
      setContract(null);
      return;
    }
    getContract(address).then(setContract);
  }, [address]);

  return contract;
}
