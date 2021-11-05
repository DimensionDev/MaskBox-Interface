import { MediaType, useMBoxContract } from '@/contexts';
import { useRSS3 } from '@/contexts/RSS3Provider';
import { MaskboxProps, MysteryBox } from './index';
import { BoxMetas, BoxOnChain } from '@/types';
import { FC, useEffect, useState } from 'react';
import { getAddress } from 'ethers/lib/utils';

interface Props extends Omit<MaskboxProps, 'boxOnChain' | 'boxOnRSS3'> {}

export const WrapMaskbox: FC<Props> = (props) => {
  const { getBoxInfo } = useMBoxContract();
  const { boxOnSubgraph: box } = props;
  const [boxInfo, setBoxInfo] = useState<BoxOnChain | null>(null);
  const [boxMetas, setBoxMetas] = useState<Partial<BoxMetas>>({});
  const { getBoxMetas } = useRSS3();
  useEffect(() => {
    if (!box) return;
    if (box.box_id) {
      getBoxInfo(box.box_id).then(setBoxInfo);
    }
  }, []);

  useEffect(() => {
    if (box?.creator) {
      getBoxMetas(getAddress(box.creator), box?.box_id ?? '')
        .then((data) => {
          if (data) {
            setBoxMetas({
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

  return <MysteryBox {...props} boxOnChain={boxInfo} boxOnRSS3={boxMetas} />;
};
