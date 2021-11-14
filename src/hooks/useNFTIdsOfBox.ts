import { useMBoxContract } from '@/contexts';
import { ZERO } from '@/lib';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

const PAGE_SIZE = BigNumber.from(50);
export function useNFTIdsOfBox(boxId: string | undefined | null, abort?: boolean) {
  const { getNftListForSale } = useMBoxContract();

  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (abort || !boxId) return;
    let cursor = ZERO;
    const fetchList = async () => {
      const list = await getNftListForSale(boxId, cursor, PAGE_SIZE);
      setIds((oldIds) => [...oldIds, ...list]);
      if (list.length) {
        cursor = cursor.add(PAGE_SIZE);
        await fetchList();
      }
    };
    fetchList();
    return () => {
      setIds([]);
    };
  }, [boxId, getNftListForSale]);
  return ids;
}
