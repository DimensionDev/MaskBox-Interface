import { useWeb3Context } from '@/contexts';
import { getNFTContracts, ERC721Token } from '@/lib';
import { getStorage, StorageKeys } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export function useERC721TokenList() {
  const [erc721Tokens, setTokens] = useState<ERC721Token[]>([]);
  const { providerChainId: chainId } = useWeb3Context();
  const updateERC721Tokens = useCallback(() => {
    if (!chainId) {
      return;
    }
    const contracts = getNFTContracts(chainId);
    const storedContracts = (getStorage<ERC721Token[]>(StorageKeys.ERC721Tokens) ?? []).filter(
      (tk) => tk.chainId === chainId,
    );
    setTokens([...contracts, ...storedContracts]);
  }, [chainId]);

  useEffect(updateERC721Tokens, [updateERC721Tokens]);

  return { erc721Tokens, updateERC721Tokens };
}
