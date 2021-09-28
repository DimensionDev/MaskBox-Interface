import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageFooter: FC<Props> = ({ className, ...rest }) => {
  return (
    <footer className={classnames(styles.footer, className)} {...rest}>
      <ul className={styles.links}>
        <li className={styles.link}>
          <a href="#">Twitter</a>
        </li>
        <li className={styles.link}>
          <a href="#">Medium</a>
        </li>
        <li className={styles.link}>
          <a href="#">Telegram</a>
        </li>
        <li className={styles.link}>
          <NavLink to="/faqs">FAQs</NavLink>
        </li>
        <li className={styles.link}>
          <a href="#">GitHub</a>
        </li>
      </ul>
      <div className={styles.copyright}>Copyright &copy; 2018-2021 NFTBOX</div>
    </footer>
  );
};
