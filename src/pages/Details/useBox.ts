import { useMBoxContract } from '@/contexts';
import { useRSS3 } from '@/contexts/RSS3Provider';
import { useMaskBoxQuery } from '@/graphql-hooks';
import { BoxMetas, BoxOnChain, MediaType } from '@/types';
import { getAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';

export function useBox(boxId: string) {
  const { getBoxInfo } = useMBoxContract();
  const [boxOnChain, setBoxOnChain] = useState<BoxOnChain | null>(null);
  const [boxOnRSS3, setBoxOnRSS3] = useState<Partial<BoxMetas>>({});
  const { getBoxMetas } = useRSS3();

  const fetchBoxInfo = useCallback(() => {
    if (boxId) {
      getBoxInfo(boxId).then(setBoxOnChain);
    }
  }, [getBoxInfo, boxId]);

  useEffect(fetchBoxInfo, [fetchBoxInfo]);

  const { data: boxData } = useMaskBoxQuery({
    variables: {
      id: boxId,
    },
  });

  const box = boxData?.maskbox;
  useEffect(() => {
    if (box?.creator) {
      getBoxMetas(getAddress(box.creator), box?.box_id ?? '')
        .then((data) => {
          if (data) {
            setBoxOnRSS3({
              mediaType: data.mediaType as MediaType,
              mediaUrl: data.mediaUrl,
              activities: data.activities,
            });
          } else {
            throw new Error(`Meta info was not found`);
          }
        })
        .catch((err) => {
          console.log('Fails at getting box info', err);
        });
    }
  }, [box?.creator, box?.box_id]);

  return {
    boxOnSubgraph: boxData?.maskbox,
    boxOnRSS3,
    boxOnChain,
    refetch: fetchBoxInfo,
  };
}
