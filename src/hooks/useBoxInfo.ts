import { useMBoxContract } from '@/contexts';
import { BoxInfoOnChain, BoxOnChain, BoxStatusOnChain } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Get box info from chain
 *
 * @param {string | undefined | null} boxId
 */
export function useBoxInfo(boxId: string | undefined | null) {
  const { getBoxInfo, getBoxStatus } = useMBoxContract();
  const [boxInfoOnChain, setBoxInfoOnChain] = useState<BoxInfoOnChain | null>(null);
  const [boxStatusOnChain, setBoxStatusOnChain] = useState<BoxStatusOnChain | null>(null);

  const fetchData = useCallback(() => {
    if (boxId) {
      getBoxInfo(boxId).then(setBoxInfoOnChain);
      getBoxStatus(boxId).then(setBoxStatusOnChain);
    }
  }, [boxId, getBoxInfo, getBoxStatus]);

  const boxOnChain: Partial<BoxOnChain> = useMemo(
    () => ({ ...boxInfoOnChain, ...boxStatusOnChain }),
    [boxInfoOnChain, boxStatusOnChain],
  );

  useEffect(fetchData, [fetchData]);

  return { box: boxOnChain, fetch: fetchData };
}
