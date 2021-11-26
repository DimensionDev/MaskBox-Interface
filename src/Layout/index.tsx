import { PageFooter, PageHeader, WalletDocker } from '@/page-components';
import { FC, memo } from 'react';
import styles from './index.module.less';

export const Layout: FC = memo(({ children }) => {
  return (
    <div className={styles.container}>
      <PageHeader className={styles.header} />
      <div className={styles.body}>{children}</div>
      <PageFooter className={styles.footer} />
      <WalletDocker className={styles.walletDocker} />
    </div>
  );
});
