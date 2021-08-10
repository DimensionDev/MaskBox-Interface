import { logoImage } from '@/assets';
import { Icon, NeonButton } from '@/components';
import { useWeb3Context } from '@/contexts';
import { getNetworkName } from '@/lib';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import React, { FC, HTMLProps } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const { account, providerChainId, connectWeb3 } = useWeb3Context();
  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo} title="NFTBOX">
          <img src={logoImage} height="36" width="36" alt="NFTBOX" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <NavLink className={styles.navItem} activeClassName={styles.activeNav} to="/market">
          Market
        </NavLink>
        <NavLink className={styles.navItem} activeClassName={styles.activeNav} to="/faqs">
          FAQS
        </NavLink>
      </nav>
      {account ? (
        <div className={styles.operations}>
          <NeonButton className={styles.button}>{getNetworkName(providerChainId!)}</NeonButton>
          <NeonButton className={styles.button} title={account}>
            {formatAddres(account)}
          </NeonButton>
          <Link className={styles.button} to="/profile">
            <Icon type="lisa" size={36} />
          </Link>
        </div>
      ) : (
        <div className={styles.operations}>
          <NeonButton className={styles.button} onClick={connectWeb3}>
            Connect Wallet
          </NeonButton>
        </div>
      )}
    </div>
  );
};
