import { avatarImage } from '@/assets';
import { RouteKeys } from '@/configs';
import { FC } from 'react';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import styles from './index.module.less';
import { MaskboxCollections } from './MaskboxCollections';
import { useLocales } from './useLocales';

export const Profile: FC = () => {
  const t = useLocales();

  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <ul className={styles.tabList}>
          <li className={styles.tabItem}>
            <NavLink
              className={styles.tab}
              activeClassName={styles.selected}
              to={RouteKeys.ProfileMaskboxCollections}
            >
              {t('MaskBox Collectibles')}
            </NavLink>
          </li>
        </ul>
        <Switch>
          <Route path={RouteKeys.ProfileMaskboxCollections} component={MaskboxCollections} />
          <Redirect to={RouteKeys.ProfileMaskboxCollections} />
        </Switch>
      </main>
    </article>
  );
};
