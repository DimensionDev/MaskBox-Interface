import { logoImage } from '@/assets';
import { Button, Icon, LanguageSwitcher, LoadingButton, useDialog } from '@/components';
import { RouteKeys } from '@/configs';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { getNetworkIcon, getNetworkName } from '@/lib';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { AccountDialog } from '../AccountDialog';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const { account, providerChainId, openConnectionDialog, isMetaMask, isConnecting } =
    useWeb3Context();
  const [accountDialogVisible, openAccountDialog, closeAccountDialog] = useDialog();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === ThemeType.Dark;
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} title="NFTBOX">
            <img src={logoImage} width="100%" height="100%" alt="MASKBOX" />
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
            className={classnames(styles.navItem, {
              [styles.activeNav]: location.pathname === RouteKeys.Details,
            })}
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
              <Button className={styles.button} onClick={openConnectionDialog}>
                <Icon
                  className={styles.icon}
                  iconUrl={getNetworkIcon(providerChainId!)}
                  size={18}
                />
                {getNetworkName(providerChainId!)}
              </Button>
              <Button className={styles.button} title={account} onClick={openAccountDialog}>
                <Icon className={styles.icon} type={isMetaMask ? 'metamask' : 'wallet'} size={16} />
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
            <LoadingButton
              className={styles.button}
              onClick={openConnectionDialog}
              disabled={isConnecting}
              loading={isConnecting}
            >
              Connect Wallet
            </LoadingButton>
          )}
          <Button
            className={classnames(styles.button, styles.themeToggleButton)}
            circle
            colorScheme="light"
            onClick={toggleTheme}
          >
            <Icon type={isDark ? 'sun' : 'moon'} size={20} />
          </Button>
        </div>
      </div>
      <LanguageSwitcher className={styles.langSwitch} />
      <AccountDialog open={accountDialogVisible} onClose={closeAccountDialog} />
    </div>
  );
};
