import { ERC721Token } from '@/types';
import { notEmpty, useBoolean } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useERC721InteractContract } from './useERC721InteractContract';

const SIZE = 50;
const emptyList: any[] = [];
export function useGetERC721TokensByIds(address: string) {
  const contract = useERC721InteractContract(address);
  const getERC721TokensByIds = useCallback(
    async (tokenIds: string[]): Promise<ERC721Token[]> => {
      if (!contract) return emptyList;
      const getTokens = tokenIds.map(async (tokenId) => {
        try {
          const tokenURI: string = await contract.tokenURI(tokenId);
          return {
            tokenId,
            tokenURI,
          };
        } catch (err) {
          debugger;
          return null;
        }
      });
      const tokens = (await Promise.all(getTokens)).filter(notEmpty);
      return tokens;
    },
    [contract],
  );
  return getERC721TokensByIds;
}
export function useERC721TokensByIds(address: string, tokenIds: string[]) {
  const getTokensByIds = useGetERC721TokensByIds(address);
  const total = tokenIds.length;
  const offsetRef = useRef(0);
  const liveRef = useRef(true);
  const [loading, setIsLoading, setNotLoading] = useBoolean();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);

  useEffect(() => {
    return () => {
      liveRef.current = false;
    };
  }, []);

  const loadTokens = useCallback(async () => {
    if (total <= offsetRef.current) return;
    setIsLoading();
    const remaining = total - offsetRef.current;
    if (remaining <= 0) return;
    const size = remaining > SIZE ? SIZE : remaining;
    const ids = tokenIds.slice(offsetRef.current, offsetRef.current + size);
    const result = await getTokensByIds(ids);
    offsetRef.current += size;
    if (result && liveRef.current) {
      setTokens((list) => {
        const newList = uniqBy([...list, ...result], 'tokenId');
        return newList;
      });
    }
    // continue loading more
    if (SIZE === size && remaining > 0) {
      await loadTokens();
    } else {
      setNotLoading();
    }
  }, [getTokensByIds, total, tokenIds]);

  useEffect(() => {
    loadTokens();
    return () => {
      offsetRef.current = 0;
    };
  }, [loadTokens]);

  const finished = total === offsetRef.current;

  return {
    loading,
    finished,
    tokens,
    loadTokens,
  };
}
