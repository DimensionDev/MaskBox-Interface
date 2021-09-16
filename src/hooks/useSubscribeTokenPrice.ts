import { useEffect, useState } from 'react';

const ETH_PRICE_POLLING_DELAY = 1 * 1000;
function createTrackHook<T = number>(initialize: T, updater: (...args: any[]) => Promise<T>) {
  return function useTrack(tokenId?: string, currency?: string) {
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

export const useTrackTokenPrice = createTrackHook(
  0,
  async (tokenId: string = 'ethereum', currency: string = 'usd') => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currency}`,
    );
    const data = (await response.json()) as TokenRecord | null;
    if (!data) return 0;
    return data[tokenId]?.[currency] ?? 0;
  },
);
