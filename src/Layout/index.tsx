import React, { FC } from 'react';
import { PageHeader, PageFooter } from '@/page-components';

import styles from './index.module.less';

export const Layout: FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <PageHeader className={styles.header} />
      <main className={styles.main}>{children}</main>
      <PageFooter className={styles.footer} />
    </div>
  );
};
