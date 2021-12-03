import { useWeb3Context } from '@/contexts';
import { getNFTContracts, ERC721Contract } from '@/lib';
import { getStorage, StorageKeys } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

export function useERC721ContractList() {
  const [erc721Contracts, setContracts] = useState<ERC721Contract[]>([]);
  const { providerChainId: chainId } = useWeb3Context();
  const updateERC721Contracts = useCallback(() => {
    if (!chainId) return;
    const contracts = getNFTContracts(chainId);
    const storedContracts = (
      getStorage<ERC721Contract[]>(StorageKeys.ERC721Contracts) ?? []
    ).filter((tk) => tk.chainId === chainId);
    setContracts(uniqBy([...contracts, ...storedContracts], 'address'));
  }, [chainId]);

  useEffect(updateERC721Contracts, [updateERC721Contracts]);

  return { erc721Contracts, updateERC721Contracts };
}
