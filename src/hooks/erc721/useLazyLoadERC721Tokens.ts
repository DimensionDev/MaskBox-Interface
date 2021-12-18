import { ZERO } from '@/lib';
import { ERC721Token } from '@/types';
import { EMPTY_LIST, useBoolean } from '@/utils';
import { uniqBy } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useERC721Balance } from './useERC721Balance';
import { useGetERC721Tokens } from './useERC721Tokens';

// https://rpc-mainnet.maticvigil.com/ used by MetaMask, limit 40 per second
const SIZE = 10;
export function useLazyLoadERC721Tokens(
  address: string,
  autoLoadNext: boolean = true,
  loadSize: number = SIZE,
) {
  const balance = useERC721Balance(address);
  const liveRef = useRef(true);
  const [loading, setIsLoading, setNotLoading] = useBoolean();
  const tokensMapRef = useRef<Record<string, ERC721Token[]>>({});
  const [tokens, setTokens] = useState<ERC721Token[]>([]);
  const getERC721Tokens = useGetERC721Tokens(address);

  useEffect(() => {
    return () => {
      liveRef.current = false;
    };
  }, []);

  const loadMore = async () => {
    const tokens = tokensMapRef.current[address] ?? EMPTY_LIST;
    if (balance.lte(tokens.length) || !address || !liveRef.current || loading) return;
    const remaining = balance.sub(tokens.length);
    if (remaining.lte(ZERO)) return;

    setIsLoading();
    const size = remaining.gt(loadSize) ? loadSize : remaining.toNumber();
    const currentAddress = address;
    const result = await getERC721Tokens(tokens.length, size);
    setNotLoading();
    if (result.length && liveRef.current) {
      const list = tokensMapRef.current[currentAddress] ?? [];
      const newList = uniqBy([...list, ...result], 'tokenId');
      tokensMapRef.current = {
        ...tokensMapRef.current,
        [currentAddress]: newList,
      };
      setTokens(newList);
    }
    // continue loading more
    if (remaining.gt(0) && result.length && autoLoadNext) {
      await loadMore();
    }
  };

  useEffect(() => {
    loadMore();
  }, [balance, getERC721Tokens]);

  const finished = balance.lte(tokens.length);

  return {
    balance,
    loading,
    finished,
    tokens,
    loadMore,
  };
}
