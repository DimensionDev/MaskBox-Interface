import { useWeb3Context } from '@/contexts';
import { getIgnoreIds, getSkips } from '@/lib';
import { EMPTY_LIST } from '@/utils';
import { useMemo } from 'react';

export function useIgnoreBoxes() {
  const { providerChainId: chainId } = useWeb3Context();
  const skips = useMemo(() => (chainId ? getSkips(chainId) : 0), [chainId]);
  const ignoreIds = useMemo(() => (chainId ? getIgnoreIds(chainId) : EMPTY_LIST), [chainId]);
  const total = skips + ignoreIds.length;
  return {
    skips,
    ignoreIds,
    total,
  };
}
