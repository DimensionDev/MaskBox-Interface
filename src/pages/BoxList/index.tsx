import { useWeb3Context } from '@/contexts';
import { MysteryBox } from '@/page-components';
import { FC, useEffect } from 'react';
import { useGetBoxes } from './useGetBoxes';
import styles from './index.module.less';

export const BoxList: FC = () => {
  const { boxes, getBoxes } = useGetBoxes();
  const { providerChainId } = useWeb3Context();
  useEffect(() => {
    getBoxes();
  }, [getBoxes]);

  if (!providerChainId) return null;

  return (
    <ul className={styles.list}>
      {boxes.map((box) => (
        <li key={box.box_id} className={styles.item}>
          <MysteryBox chainId={providerChainId} boxId={box.box_id} inList />
        </li>
      ))}
    </ul>
  );
};
