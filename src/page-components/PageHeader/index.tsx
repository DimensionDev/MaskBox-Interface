import React, { FC, HTMLProps } from 'react';
import { logoImage } from '@/assets';
import { NeonButton } from '@/components';
import classnames from 'classnames';

import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.brand}>
        <a className={styles.logo} href="/" title="NFTBOX">
          <img src={logoImage} height="36" width="36" alt="NFTBOX" />
        </a>
      </div>
      <nav className={styles.nav}>
        <a className={styles.navItem} href="/#Market">
          Market
        </a>
        <a className={styles.navItem} href="/#faqs">
          FAQS
        </a>
      </nav>
      <div className={styles.operations}>
        <NeonButton>Connect Wallet</NeonButton>
      </div>
    </div>
  );
};
