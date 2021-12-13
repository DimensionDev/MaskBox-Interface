import { ERC20_ABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getNativeToken, TokenType, ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export function useGetERC20TokenInfo() {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const getTokenInfo = useCallback(
    async (addr: string): Promise<TokenType | null> => {
      if (!ethersProvider || !providerChainId) return null;
      if (isSameAddress(addr, ZERO_ADDRESS)) {
        return getNativeToken(providerChainId);
      }
      const contract = new Contract(addr, ERC20_ABI, ethersProvider);
      const namePromise = contract.name().catch(() => null);
      const symbolPromise = contract.symbol().catch(() => null);
      const decimalsPromise = contract.decimals().catch(() => null);
      const token = await Promise.all([namePromise, symbolPromise, decimalsPromise]).then(
        ([name, symbol, decimals]) => {
          if (!name && !symbol && !decimals) return null;
          return {
            address: addr,
            chainId: providerChainId as number,
            name: name as string,
            symbol: symbol as string,
            decimals: decimals as number,
            logoURI: '',
          } as TokenType;
        },
      );
      return token;
    },
    [ethersProvider, providerChainId],
  );
  return getTokenInfo;
}

export function useERC20Token(address: string | null | undefined) {
  const [token, setToken] = useState<TokenType | null>();

  const getTokenInfo = useGetERC20TokenInfo();
  useEffect(() => {
    if (!address) {
      setToken(null);
      return;
    }
    getTokenInfo(address).then(setToken);
  }, [address]);

  return token;
}
