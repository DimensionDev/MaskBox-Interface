import { showToast } from '@/components';
import { useMBoxContract, useRSS3, useWeb3Context } from '@/contexts';
import { BoxInfo, BoxMetas } from '@/types';
import { useEffect, useMemo, useState } from 'react';

export function useGetExtendedBoxInfo(chainId: number | null, boxId: string | null) {
  const [boxInfo, setBoxInfo] = useState<BoxInfo | null>(null);
  const [boxMetas, setBoxMetas] = useState<Partial<BoxMetas>>({});
  const { providerChainId } = useWeb3Context();
  const { getBoxMetas: getBoxMetas } = useRSS3();
  const { getBoxInfo } = useMBoxContract();

  useEffect(() => {
    if (boxId && chainId && chainId === providerChainId) {
      getBoxInfo(boxId).then(setBoxInfo);
    }
  }, [chainId, boxId, providerChainId]);

  useEffect(() => {
    if (boxInfo?.creator) {
      getBoxMetas(boxInfo.creator, boxId!)
        .then((data) => {
          if (data) {
            setBoxMetas({
              cover: data.cover,
              activities: data.activities,
            });
          } else {
            throw new Error(`Meta info was not found`);
          }
        })
        .catch((err) => {
          showToast({
            title: `Fails at getting box info: ${(err as Error).message}`,
            variant: 'error',
          });
        });
    }
  }, [boxInfo?.creator, boxId]);

  return useMemo(
    () => ({
      ...boxInfo,
      ...boxMetas,
    }),
    [boxInfo, boxMetas],
  );
}
