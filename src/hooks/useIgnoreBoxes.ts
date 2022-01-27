import { useWeb3Context } from '@/contexts';
import { DEV_MODE_ENABLED, getIgnoreIds, getSkips } from '@/lib';
import { EMPTY_LIST } from '@/utils';
import { useMemo } from 'react';
const NO_IGNORE = { skips: 0, ignoreIds: ['0'], total: 0 };
export function useIgnoreBoxes() {
  const { providerChainId: chainId } = useWeb3Context();
  const skips = useMemo(() => (chainId ? getSkips(chainId) : 0), [chainId]);
  const ignoreIds = useMemo(() => (chainId ? getIgnoreIds(chainId) : EMPTY_LIST), [chainId]);
  const total = skips + ignoreIds.length;
  return DEV_MODE_ENABLED
    ? NO_IGNORE
    : {
        skips,
        ignoreIds,
        total,
      };
}
