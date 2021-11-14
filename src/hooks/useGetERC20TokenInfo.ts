import { ERC20_ABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getNativeToken, TokenType, ZERO_ADDRESS } from '@/lib';
import { isSameAddress } from '@/utils';
import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export function useGetERC20TokenInfo() {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const getTokenInfo = useCallback(
    async (addr: string): Promise<TokenType | undefined> => {
      if (!ethersProvider || !providerChainId) return;
      if (isSameAddress(addr, ZERO_ADDRESS)) {
        return getNativeToken(providerChainId);
      }
      const contract = new Contract(addr, ERC20_ABI, ethersProvider);
      const token = Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(
        ([name, symbol, decimals]) => {
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

export function useERC20Token(address: string | undefined) {
  const [token, setToken] = useState<TokenType | undefined>();

  const getTokenInfo = useGetERC20TokenInfo();
  useEffect(() => {
    if (!address) {
      setToken(undefined);
      return;
    }
    getTokenInfo(address).then(setToken);
  }, [address]);

  return token;
}
