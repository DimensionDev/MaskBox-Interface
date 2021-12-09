import { useBoxOnRSS3 } from '@/contexts/RSS3Provider';
import { useBoxInfo } from '@/hooks';
import { FC } from 'react';
import { Maskbox, MaskboxProps } from './index';

interface Props extends Omit<MaskboxProps, 'boxOnChain' | 'boxOnRSS3'> {}

export const WrapMaskbox: FC<Props> = (props) => {
  const { boxOnSubgraph: box } = props;
  const boxId = box?.box_id.toString();
  const { box: boxOnChain } = useBoxInfo(boxId);

  const boxOnRSS3 = useBoxOnRSS3(box?.creator, boxId);

  return <Maskbox {...props} boxOnChain={boxOnChain} boxOnRSS3={boxOnRSS3} />;
};
