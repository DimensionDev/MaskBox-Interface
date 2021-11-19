import { useWeb3Context } from '@/contexts';
import { atom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';

export const chainAtom = atom<number | undefined>(undefined);

export function useWatchChain() {
  const { providerChainId } = useWeb3Context();
  const updateChain = useUpdateAtom(chainAtom);
  useEffect(() => {
    updateChain(providerChainId);
  }, [providerChainId, updateChain]);
}
