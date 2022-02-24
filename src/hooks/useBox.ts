import { useRSS3 } from '@/contexts';
import { useMaskBoxLazyQuery } from '@/graphql-hooks';
import { BoxMetas, MediaType } from '@/types';
import { getAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useBoxInfo } from './useBoxInfo';

export function useBox(boxId: string | null) {
  const [boxOnRSS3, setBoxOnRSS3] = useState<BoxMetas | null>(null);
  const { getBoxMetas } = useRSS3();

  const { box: boxOnChain, fetch: refetchBoxOnChain } = useBoxInfo(boxId);

  const [fetchBox, { data: boxData, loading: loading }] = useMaskBoxLazyQuery();

  useEffect(() => {
    if (boxId)
      fetchBox({
        variables: {
          id: boxId,
        },
      });
  }, [boxId]);

  const box = boxData?.maskbox;
  useEffect(() => {
    if (!box?.creator || !box?.box_id) {
      setBoxOnRSS3(null);
      return;
    }
    getBoxMetas(getAddress(box.creator), box.box_id)
      .then((data) => {
        if (data) {
          setBoxOnRSS3({
            id: data.id,
            name: data.name,
            mediaType: data.mediaType as MediaType,
            mediaUrl: data.mediaUrl,
            activities: data.activities,
            whitelistFileName: data?.whitelistFileName,
            whitelist: data?.whitelist,
            qualification_rss3: data?.qualification_rss3,
          });
        } else {
          throw new Error(`Meta info was not found`);
        }
      })
      .catch((err) => {
        console.log('Fails at getting box info', err);
      });
  }, [box?.creator, box?.box_id]);

  return {
    boxOnSubgraph: boxData?.maskbox,
    boxOnRSS3,
    boxOnChain,
    refetch: refetchBoxOnChain,
    loading,
  };
}
