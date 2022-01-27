import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';
import { NavLink } from 'react-router-dom';

export interface NavTabOptions {
  key: string;
  to: string;
  label: string;
}

interface Props extends HTMLProps<HTMLUListElement> {
  tabs: NavTabOptions[];
}

export const NavTabs: FC<Props> = ({ className, tabs, ...rest }) => {
  if (tabs.length === 0) return null;
  return (
    <ul className={classnames(className, styles.tabList)} {...rest}>
      {tabs.map((tab) => (
        <li className={styles.tabItem} key={tab.key}>
          <NavLink className={styles.tab} activeClassName={styles.selected} to={tab.to}>
            {tab.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
