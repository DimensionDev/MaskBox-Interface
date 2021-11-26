import { ERC721Contract } from '@/lib';
import { useEffect, useState } from 'react';
import { useGetERC721Contract } from './useGetERC721Contract';

export function useERC721Contract(address: string | undefined) {
  const [contract, setContract] = useState<ERC721Contract | null>();

  const getContract = useGetERC721Contract();
  useEffect(() => {
    if (!address) {
      setContract(null);
      return;
    }
    getContract(address).then(setContract);
  }, [address]);

  return contract;
}
