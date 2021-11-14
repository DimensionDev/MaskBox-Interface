import { useMBoxContract } from '@/contexts';
import { BoxOnChain } from '@/types';
import { useCallback, useEffect, useState } from 'react';

/**
 * Get box info from chain
 *
 * @param {string | undefined | null} boxId
 */
export function useBoxInfo(boxId: string | undefined | null) {
  const { getBoxInfo } = useMBoxContract();
  const [boxOnChain, setBoxOnChain] = useState<BoxOnChain | null>(null);

  const fetchBoxInfo = useCallback(() => {
    if (boxId) {
      getBoxInfo(boxId).then(setBoxOnChain);
    }
  }, [getBoxInfo, boxId]);

  useEffect(fetchBoxInfo, [fetchBoxInfo]);

  return { box: boxOnChain, fetch: fetchBoxInfo };
}
