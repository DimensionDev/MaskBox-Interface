import React, { FC, HTMLProps } from 'react';
import { Link } from 'react-router-dom';
import { logoImage } from '@/assets';
import { Icon, NeonButton } from '@/components';
import classnames from 'classnames';

import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo} title="NFTBOX">
          <img src={logoImage} height="36" width="36" alt="NFTBOX" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link className={styles.navItem} to="/market">
          Market
        </Link>
        <Link className={styles.navItem} to="/faqs">
          FAQS
        </Link>
      </nav>
      <div className={styles.operations}>
        <NeonButton className={styles.button}>Connect Wallet</NeonButton>
        <Link className={styles.button} to="/profile">
          <Icon type="lisa" size={36} />
        </Link>
      </div>
    </div>
  );
};
