import { useBoxOnStorage } from '@/contexts/StorageProvider';
import { useBoxInfo } from '@/hooks';
import { FC } from 'react';
import { Maskbox, MaskboxProps } from './index';

interface Props extends Omit<MaskboxProps, 'boxOnChain' | 'boxOnStorage'> {}

export const WrapMaskbox: FC<Props> = (props) => {
  const { boxOnSubgraph: box } = props;
  const boxId = box?.box_id.toString();
  const { box: boxOnChain } = useBoxInfo(boxId);

  const boxOnStorage = useBoxOnStorage(box?.creator, boxId);

  return <Maskbox {...props} boxOnChain={boxOnChain} boxOnStorage={boxOnStorage} />;
};
