import { useEffect, useState } from 'react';

const ETH_PRICE_POLLING_DELAY = 1 * 1000;
function createTrackHook<T = number>(initialize: T, updater: (...args: any[]) => Promise<T>) {
  return function useTrack(tokenId: string | null, currency?: string) {
    const [value, setValue] = useState(initialize);

    useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;
      const tick = async () => {
        clearTimeout(timer);
        const result = await updater(tokenId, currency);
        setValue(result);
        timer = setTimeout(tick, ETH_PRICE_POLLING_DELAY);
      };
      tick();
      return () => clearTimeout(timer);
    }, [tokenId, currency]);

    return value;
  };
}

interface PriceRecord {
  [currency: string]: number;
}

interface TokenRecord {
  [token: string]: PriceRecord;
}

const cacheMap = new Map<string, number>();

export const useTrackTokenPrice = createTrackHook(
  0,
  async (tokenId: string | null, currency: string = 'usd') => {
    if (!tokenId) return 0;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currency}`;
    const cached = cacheMap.get(url);
    if (cached) {
      return cached;
    }
    const response = await fetch(url);
    const data = (await response.json()) as TokenRecord | null;
    if (data?.[tokenId]?.[currency]) {
      cacheMap.set(url, data?.[tokenId]?.[currency]);
    }
    return cacheMap.get(url) ?? 0;
  },
);
