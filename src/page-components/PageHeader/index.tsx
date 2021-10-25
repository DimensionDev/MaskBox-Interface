import { logoImage } from '@/assets';
import { Button, Icon } from '@/components';
import { RouteKeys } from '@/configs';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { getNetworkIcon, getNetworkName, isSupportedChain } from '@/lib';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { SelectNetwork } from '../SelectNetwork';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const { account, providerChainId, connectWeb3 } = useWeb3Context();
  const [selectNetworkVisible, setSelectNetworkVisible] = useState(false);
  const isSupported = isSupportedChain(providerChainId ?? 0);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === ThemeType.Dark;
  const history = useHistory();

  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} title="NFTBOX">
            <img src={logoImage} width="171" height="51" alt="NFTBOX" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <NavLink
            exact
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Home}
          >
            Home
          </NavLink>
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.BoxList}
          >
            Mystery
          </NavLink>
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Profile}
          >
            My Items
          </NavLink>
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Faqs}
          >
            FAQs
          </NavLink>
        </nav>
        <div className={styles.operations}>
          {account ? (
            <>
              <Button className={styles.button} onClick={() => setSelectNetworkVisible(true)}>
                <Icon
                  className={styles.icon}
                  iconUrl={getNetworkIcon(providerChainId!)}
                  size={18}
                />
                {getNetworkName(providerChainId!)}
              </Button>
              <Button className={styles.button} title={account}>
                <Icon className={styles.icon} type="wallet" size={16} />
                {formatAddres(account)}
              </Button>
              <Button
                className={styles.button}
                colorScheme="primary"
                title={account}
                onClick={() => {
                  history.push('/edit');
                }}
              >
                Create
              </Button>
            </>
          ) : (
            <Button className={styles.button} onClick={connectWeb3}>
              Connect Wallet
            </Button>
          )}
          <Button className={styles.button} circle colorScheme="light" onClick={toggleTheme}>
            <Icon type={isDark ? 'sun' : 'moon'} size={20} />
          </Button>
        </div>
      </div>
      <SelectNetwork
        open={selectNetworkVisible || !isSupported}
        title={isSupported ? 'Select a Network' : 'Current is not supported'}
        onClose={() => setSelectNetworkVisible(false)}
      />
    </div>
  );
};
