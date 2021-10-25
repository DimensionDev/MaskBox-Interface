import { showToast } from '@/components';
import { useMBoxContract, useRSS3, useWeb3Context } from '@/contexts';
import { useMaskBoxQuery } from '@/graphql-hooks';
import { BoxInfo, BoxMetas } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { useMaskBoxCreationSuccessEvent } from './useMaskboxCreationEvent';

export function useGetExtendedBoxInfo(chainId: number | null, boxId: string | null) {
  const [boxInfo, setBoxInfo] = useState<BoxInfo | null>(null);
  const [boxMetas, setBoxMetas] = useState<Partial<BoxMetas>>({});
  const { providerChainId } = useWeb3Context();
  const { getBoxMetas } = useRSS3();
  const { getBoxInfo } = useMBoxContract();
  const { data: boxData } = useMaskBoxQuery({
    variables: {
      id: boxId ?? '',
    },
  });
  const result = useMaskBoxCreationSuccessEvent(boxInfo?.creator, boxInfo?.nft_address, boxId);

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

  console.log({ boxData, resultValue: result.value });

  return useMemo(
    () => ({
      ...boxInfo,
      ...boxMetas,
      start_time: (result.value?.start_time ?? boxData?.maskbox?.start_time) as number | undefined,
      end_time: (result.value?.end_time ?? boxData?.maskbox?.end_time) as number | undefined,
    }),
    [boxInfo, boxMetas, result.value, boxData?.maskbox],
  );
}
