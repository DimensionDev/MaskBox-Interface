import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { useCallback } from 'react';

export function useCancelBox() {
  const contract = useMaskboxContract();
  const { ethersProvider } = useWeb3Context();
  const canceleBox = useCallback(
    async (boxId: string) => {
      if (!contract || !ethersProvider) return;
      await contract.connect(ethersProvider.getSigner()).cancelBox(boxId);
    },
    [contract, ethersProvider],
  );

  return canceleBox;
}
