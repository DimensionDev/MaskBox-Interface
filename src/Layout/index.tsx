import { useWatchChain } from '@/atoms/chain';
import { PageFooter, PageHeader } from '@/page-components';
import { FC, memo } from 'react';

import styles from './index.module.less';

export const Layout: FC = memo(({ children }) => {
  useWatchChain();
  return (
    <div className={styles.container}>
      <PageHeader className={styles.header} />
      <div className={styles.body}>{children}</div>
      <PageFooter className={styles.footer} />
    </div>
  );
});
