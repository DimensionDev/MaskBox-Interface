import { Dialog } from '@/components';
import { FC } from 'react';
import styles from './index.module.less';

export const WipDialog: FC = () => {
  return (
    <Dialog open title="Under construction">
      <p className={styles.wip}>This page is under construction.</p>
    </Dialog>
  );
};
