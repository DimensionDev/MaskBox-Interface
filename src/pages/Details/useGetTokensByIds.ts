import { useNFTContract } from '@/contexts';
import { ERC721Token } from '@/types';
import { useEffect, useState } from 'react';

export function useGetTokensByIds(contractAddress?: string, tokenIds?: string[]) {
  const [erc721Tokens, setErc721Tokens] = useState<ERC721Token[]>([]);
  const { getByIdList } = useNFTContract();

  useEffect(() => {
    if (!contractAddress || !tokenIds) return;
    getByIdList(contractAddress, tokenIds).then((tokens) => {
      setErc721Tokens(tokens);
    });
  }, [getByIdList, contractAddress, tokenIds]);

  return erc721Tokens;
}
