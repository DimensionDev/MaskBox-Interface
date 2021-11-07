import { useMBoxContract } from '@/contexts';
import { useBoxOnRSS3 } from '@/contexts/RSS3Provider';
import { BoxOnChain } from '@/types';
import { FC, useEffect, useState } from 'react';
import { Maskbox, MaskboxProps } from './index';

interface Props extends Omit<MaskboxProps, 'boxOnChain' | 'boxOnRSS3'> {}

export const WrapMaskbox: FC<Props> = (props) => {
  const { getBoxInfo } = useMBoxContract();
  const { boxOnSubgraph: box } = props;
  const [boxOnChain, setBoxOnChain] = useState<BoxOnChain | null>(null);
  useEffect(() => {
    if (!box) return;
    if (box.box_id) {
      getBoxInfo(box.box_id).then(setBoxOnChain);
    }
  }, []);

  const boxOnRSS3 = useBoxOnRSS3(box?.creator, box?.box_id);

  return <Maskbox {...props} boxOnChain={boxOnChain} boxOnRSS3={boxOnRSS3} />;
};
