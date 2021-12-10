import { ZERO } from '@/lib';
import { ERC721Token } from '@/types';
import { useBoolean } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useERC721Balance } from './useERC721Balance';
import { useGetERC721Tokens } from './useERC721Tokens';

const SIZE = 50;
export function useLazyLoadERC721Tokens(address: string) {
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

  const lazyLoadTokens = useCallback(async () => {
    if (balance.lte(offsetRef.current)) return;
    setIsLoading();
    const remaining = balance.sub(offsetRef.current);
    if (remaining.lte(ZERO)) return;
    const size = remaining.gt(SIZE) ? SIZE : remaining.toNumber();
    const result = await getERC721Tokens(offsetRef.current, size);
    offsetRef.current += size;
    if (result && liveRef.current) {
      setTokens((list) => {
        const newList = uniqBy([...list, ...result], 'tokenId');
        return newList;
      });
    }
    // continue loading more
    if (SIZE === size && remaining.gt(0)) {
      await lazyLoadTokens();
    } else {
      setNotLoading();
    }
  }, [getERC721Tokens, balance]);

  useEffect(() => {
    lazyLoadTokens();
    return () => {
      offsetRef.current = 0;
    };
  }, [lazyLoadTokens]);

  const finished = balance.eq(offsetRef.current);

  return {
    balance,
    loading,
    finished,
    tokens,
    lazyLoadTokens,
  };
}
