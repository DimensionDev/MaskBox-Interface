import { useWeb3Context } from '@/contexts';
import { getNativeToken, getTokenListUrl, TokenListConfig, TokenType } from '@/lib';
import { getStorage } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export function useTokenList() {
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const { providerChainId } = useWeb3Context();
  const updateTokens = useCallback(() => {
    if (!providerChainId) {
      return;
    }
    const nativeToken = getNativeToken(providerChainId);
    if (!nativeToken) return;
    const listUrl = getTokenListUrl(providerChainId);
    fetch(listUrl).then(async (response) => {
      const data: TokenListConfig = await response.json();
      const storedTokens = (getStorage<TokenType[]>('tokens') ?? []).filter(
        (tk) => tk.chainId === providerChainId,
      );
      setTokens([nativeToken, ...storedTokens, ...data.tokens]);
    });
  }, [providerChainId]);
  useEffect(updateTokens, [updateTokens]);

  return { tokens, updateTokens };
}
