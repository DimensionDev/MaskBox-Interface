import { logoImage } from '@/assets';
import { Button, Icon, LanguageSwitcher, useDialog } from '@/components';
import { RouteKeys } from '@/configs';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { getNetworkIcon, getNetworkName, isSupportedChain } from '@/lib';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { AccountDialog } from '../AccountDialog';
import { SelectNetwork } from '../SelectNetwork';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const { account, providerChainId, connectWeb3, isMetaMask } = useWeb3Context();
  const [selectNetworkVisible, openSelectNetwork, closeSelectNetwork] = useDialog();
  const [accountDialogVisible, openAccountDialog, closeAccountDialog] = useDialog();
  const isNotSupported = providerChainId !== undefined && !isSupportedChain(providerChainId);
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
              <Button className={styles.button} onClick={openSelectNetwork}>
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
            <Button className={styles.button} onClick={connectWeb3}>
              Connect Wallet
            </Button>
          )}
          <Button className={styles.button} circle colorScheme="light" onClick={toggleTheme}>
            <Icon type={isDark ? 'sun' : 'moon'} size={20} />
          </Button>
        </div>
      </div>
      <LanguageSwitcher className={styles.langSwitch} />
      <SelectNetwork
        open={selectNetworkVisible || isNotSupported}
        title={isNotSupported ? 'Not supported network' : 'Select a Network'}
        onClose={closeSelectNetwork}
      />
      <AccountDialog open={accountDialogVisible} onClose={closeAccountDialog} />
    </div>
  );
};
