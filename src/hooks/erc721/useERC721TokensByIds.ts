import { ERC721Token } from '@/types';
import { EMPTY_LIST, notEmpty, useBoolean } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLiveRef } from '../common';
import { useERC721InteractContract } from './useERC721InteractContract';

const SIZE = 50;
export function useGetERC721TokensByIds(address: string | undefined) {
  const contract = useERC721InteractContract(address);
  const getERC721TokensByIds = useCallback(
    async (tokenIds: string[]): Promise<ERC721Token[]> => {
      if (!contract) return EMPTY_LIST;
      const getTokens = tokenIds.map(async (tokenId) => {
        try {
          const tokenURI: string = await contract.tokenURI(tokenId);
          return {
            tokenId,
            tokenURI,
          };
        } catch (err) {
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
export function useERC721TokensByIds(address: string | undefined, tokenIds: string[]) {
  const getTokensByIds = useGetERC721TokensByIds(address);
  const total = tokenIds.length;
  const offsetRef = useRef(0);
  const liveRef = useLiveRef();
  const [loading, setIsLoading, setNotLoading] = useBoolean();
  const [tokens, setTokens] = useState<ERC721Token[]>(EMPTY_LIST);

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
