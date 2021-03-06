import { logoImage } from '@/assets';
import { Button, Icon, LanguageSwitcher, LoadingButton, LoadingIcon } from '@/components';
import { RouteKeys } from '@/configs';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { useCreatedSomeBoxes, usePermissionGranted } from '@/hooks';
import { DEV_MODE_ENABLED, getNetworkColor, getNetworkName } from '@/lib';
import { formatAddres, useBoolean } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useEffect, useRef } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useClickAway } from 'react-use';
import styles from './index.module.less';
import { useLocales } from './useLocales';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const t = useLocales();
  const {
    account,
    providerChainId,
    openAccountDialog,
    openConnectionDialog,
    isNotSupportedChain,
    isMetaMask,
    isConnecting,
  } = useWeb3Context();
  const [popupNavVisible, openPopupNav, closePopupNav] = useBoolean();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === ThemeType.Dark;
  const history = useHistory();
  const location = useLocation();

  const popupNavRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLDivElement>(null);
  useClickAway(popupNavRef, (event) => {
    const target = event.target as HTMLDivElement;
    if (target && menuBtnRef.current?.contains(target)) return;
    closePopupNav();
  });
  useEffect(closePopupNav, [location.pathname]);

  const permissionGranted = usePermissionGranted();
  const hasCreatedSomeBoxes = useCreatedSomeBoxes();
  const myMaskboxesVisible = permissionGranted || hasCreatedSomeBoxes;

  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} title="NFTBOX">
            <img src={logoImage} width="100%" height="100%" alt="MASKBOX" />
            {DEV_MODE_ENABLED && <strong className={styles.dev}>dev</strong>}
          </Link>
        </div>
        <nav className={styles.nav}>
          <NavLink
            exact
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Home}
          >
            {t('Home')}
          </NavLink>
          <NavLink
            className={classnames(styles.navItem, {
              [styles.activeNav]: location.pathname === RouteKeys.Details,
            })}
            activeClassName={styles.activeNav}
            to={RouteKeys.BoxList}
          >
            {t('Mystery')}
          </NavLink>
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Profile}
          >
            {t('My Items')}
          </NavLink>
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.Faqs}
          >
            {t('FAQs')}
          </NavLink>
        </nav>
        <div className={styles.operations}>
          {account ? (
            <>
              {isConnecting ? (
                <Button circle>
                  <LoadingIcon size={18} />
                </Button>
              ) : (
                <Button
                  className={styles.button}
                  onClick={openConnectionDialog}
                  colorScheme={isNotSupportedChain ? 'danger' : 'default'}
                >
                  <Icon
                    className={styles.icon}
                    type="dot"
                    color={getNetworkColor(providerChainId!)}
                    size={20}
                  />
                  {isNotSupportedChain ? t('Network error') : getNetworkName(providerChainId!)}
                </Button>
              )}
              <Button className={styles.button} title={account} onClick={openAccountDialog}>
                <Icon className={styles.icon} type={isMetaMask ? 'metamask' : 'wallet'} size={16} />
                {formatAddres(account)}
              </Button>
              {myMaskboxesVisible && (
                <Button
                  className={styles.button}
                  colorScheme="primary"
                  onClick={() => {
                    history.push(RouteKeys.MyMaskboxes);
                  }}
                >
                  {t('My MaskBoxes')}
                </Button>
              )}
            </>
          ) : (
            <LoadingButton
              className={styles.button}
              onClick={openConnectionDialog}
              disabled={isConnecting}
              loading={isConnecting}
            >
              {t('Connect Wallet')}
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
          <div
            className={styles.menuButton}
            role="button"
            ref={menuBtnRef}
            onClick={() => (popupNavVisible ? closePopupNav() : openPopupNav())}
          >
            <Icon type="menu" />
          </div>
          <LanguageSwitcher className={styles.langSwitch} />
        </div>
      </div>
      <nav
        className={classnames(styles.popupNav, { [styles.open]: popupNavVisible })}
        ref={popupNavRef}
      >
        <NavLink
          exact
          className={styles.navItem}
          activeClassName={styles.activeNav}
          to={RouteKeys.Home}
        >
          {t('Home')}
        </NavLink>
        <NavLink
          className={classnames(styles.navItem, {
            [styles.activeNav]: location.pathname === RouteKeys.Details,
          })}
          activeClassName={styles.activeNav}
          to={RouteKeys.BoxList}
        >
          {t('Mystery')}
        </NavLink>
        <NavLink
          className={styles.navItem}
          activeClassName={styles.activeNav}
          to={RouteKeys.Profile}
        >
          {t('My Items')}
        </NavLink>
        {myMaskboxesVisible && (
          <NavLink
            className={styles.navItem}
            activeClassName={styles.activeNav}
            to={RouteKeys.MyMaskboxes}
          >
            {t('My MaskBoxes')}
          </NavLink>
        )}
        <NavLink className={styles.navItem} activeClassName={styles.activeNav} to={RouteKeys.Faqs}>
          {t('FAQs')}
        </NavLink>
        <LanguageSwitcher className={styles.langSwitchItem} />
      </nav>
    </div>
  );
};
