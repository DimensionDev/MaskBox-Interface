import { avatarImage } from '@/assets';
import { NavTabOptions, NavTabs } from '@/components';
import { RouteKeys } from '@/configs';
import { FC, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styles from './index.module.less';
import { MaskboxCollections } from './MaskboxCollections';
import { OtherCollections } from './OtherCollections';
import { useLocales } from './useLocales';

export const Profile: FC = () => {
  const t = useLocales();

  const tabs: NavTabOptions[] = useMemo(
    () => [
      {
        key: 'maskbox',
        to: RouteKeys.ProfileMaskboxCollections,
        label: t('MaskBox Collectibles'),
      },
      {
        key: 'others',
        to: RouteKeys.ProfileOtherCollections,
        label: t('Other Collectibles'),
      },
    ],
    [t],
  );

  return (
    <article>
      <header className={styles.header}>
        <img className={styles.avatar} height={96} width={96} src={avatarImage} />
      </header>
      <main className={styles.main}>
        <NavTabs tabs={tabs} />
        <Switch>
          <Route path={RouteKeys.ProfileMaskboxCollections} component={MaskboxCollections} />
          <Route path={RouteKeys.ProfileOtherCollections} component={OtherCollections} />
          <Redirect to={RouteKeys.ProfileMaskboxCollections} />
        </Switch>
      </main>
    </article>
  );
};
