import { ERC721Token } from '@/lib';
import { useEffect, useState } from 'react';
import { useGetERC721Token } from './useGetERC721Token';

export function useERC721Token(address: string | undefined) {
  const [token, setToken] = useState<ERC721Token | undefined>();

  const getTokenInfo = useGetERC721Token();
  useEffect(() => {
    if (!address) {
      setToken(undefined);
      return;
    }
    getTokenInfo(address).then(setToken);
  }, [address]);

  return token;
}
