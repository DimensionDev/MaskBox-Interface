import { useBoxOnRSS3 } from '@/contexts/RSS3Provider';
import { useBoxInfo } from '@/hooks';
import { FC } from 'react';
import { Maskbox, MaskboxProps } from './index';

interface Props extends Omit<MaskboxProps, 'boxOnChain' | 'boxOnRSS3'> {}

export const WrapMaskbox: FC<Props> = (props) => {
  const { boxOnSubgraph: box } = props;
  const { box: boxOnChain } = useBoxInfo(box?.box_id);

  const boxOnRSS3 = useBoxOnRSS3(box?.creator, box?.box_id);

  return <Maskbox {...props} boxOnChain={boxOnChain} boxOnRSS3={boxOnRSS3} />;
};
