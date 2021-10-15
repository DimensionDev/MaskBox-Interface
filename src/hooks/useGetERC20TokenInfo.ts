import { useWeb3Context } from '@/contexts';
import { getNativeToken, ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { Contract } from 'ethers';
import { useCallback } from 'react';

const ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

export function useGetERC20TokenInfo() {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const getTokenInfo = useCallback(
    async (addr: string) => {
      if (!ethersProvider || !providerChainId) return;
      if (isSameAddress(addr, ZERO_ADDRESS)) {
        return getNativeToken(providerChainId);
      }
      const contract = new Contract(addr, ABI, ethersProvider);
      const token = Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(
        ([name, symbol, decimals]) => {
          return {
            address: addr,
            chainId: providerChainId as number,
            name: name as string,
            symbol: symbol as string,
            decimals: decimals as number,
            logoURI: '',
          };
        },
      );
      return token;
    },
    [ethersProvider, providerChainId],
  );
  return getTokenInfo;
}
