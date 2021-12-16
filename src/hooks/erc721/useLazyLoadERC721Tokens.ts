import { ZERO } from '@/lib';
import { ERC721Token } from '@/types';
import { createDefer, DeferTuple, useBoolean } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useERC721Balance } from './useERC721Balance';
import { useGetERC721Tokens } from './useERC721Tokens';

const SIZE = 50;
export function useLazyLoadERC721Tokens(
  address: string,
  autoLoadNext: boolean = true,
  loadSize: number = SIZE,
) {
  const balance = useERC721Balance(address);
  const offsetRef = useRef(0);
  const liveRef = useRef(true);
  const [loading, setIsLoading, setNotLoading] = useBoolean();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);
  const getERC721Tokens = useGetERC721Tokens(address);

  useEffect(() => {
    return () => {
      liveRef.current = false;
    };
  }, []);

  useEffect(() => {
    offsetRef.current = 0;
  }, [address]);

  const deferRef = useRef<DeferTuple<void>>();
  const loadMore = useCallback(async () => {
    if (balance.lte(offsetRef.current) || !address || !liveRef.current) return;
    const remaining = balance.sub(offsetRef.current);
    if (remaining.lte(ZERO)) return;

    setIsLoading();
    if (deferRef.current) {
      await deferRef.current[0];
    }

    deferRef.current = createDefer<void>();
    const size = remaining.gt(loadSize) ? loadSize : remaining.toNumber();
    const result = await getERC721Tokens(offsetRef.current, size);
    if (result.length && liveRef.current) {
      setTokens((list) => {
        const newList = uniqBy([...list, ...result], 'tokenId');
        offsetRef.current = newList.length;
        return newList;
      });
    }
    deferRef.current[1]();
    // continue loading more
    if (remaining.gt(0) && result.length && autoLoadNext) {
      await loadMore();
    } else {
      setNotLoading();
    }
  }, [getERC721Tokens, balance, autoLoadNext, loadSize, address]);

  useEffect(() => {
    loadMore();
    return () => {
      offsetRef.current = 0;
    };
  }, [loadMore]);

  const finished = balance.lte(offsetRef.current);

  return {
    balance,
    loading,
    finished,
    tokens,
    loadMore,
  };
}
