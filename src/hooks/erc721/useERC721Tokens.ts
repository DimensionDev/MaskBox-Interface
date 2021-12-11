import { useWeb3Context } from '@/contexts';
import { ERC721Token } from '@/types';
import { notEmpty } from '@/utils';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useERC721InteractContract } from './useERC721InteractContract';

export function useGetERC721Tokens(address: string) {
  const contract = useERC721InteractContract(address);
  const { account } = useWeb3Context();
  const getERC721Tokens = useCallback(
    async (offset: number, size: number) => {
      if (!contract || !account) return;
      const getTokens = new Array(size).fill(0).map(async (_, index) => {
        const tokenIdBn: BigNumber = await contract.tokenOfOwnerByIndex(
          account,
          BigNumber.from(offset + index),
        );
        const tokenId = tokenIdBn.toString();
        const tokenURI: string = await contract.tokenURI(tokenId);
        return {
          tokenId,
          tokenURI,
        };
      });
      const tokens = (await Promise.all(getTokens)).filter(notEmpty);
      return tokens;
    },
    [contract, address],
  );

  return getERC721Tokens;
}

export function useERC721Tokens(address: string, offset: number, size: number) {
  const getERC721Tokens = useGetERC721Tokens(address);
  const [tokens, setTokens] = useState<ERC721Token[]>([]);

  useEffect(() => {
    getERC721Tokens(offset, size).then((list) => {
      if (list) setTokens(list);
    });
  }, [getERC721Tokens, offset, size]);
  return tokens;
}
