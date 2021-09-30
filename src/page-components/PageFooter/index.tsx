import { logoImage } from '@/assets';
import { BaseButton as Button, Icon } from '@/components';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageFooter: FC<Props> = ({ className, ...rest }) => {
  return (
    <footer className={classnames(styles.footer, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <div className={styles.left}>
            <div className={styles.brand}>
              <img src={logoImage} width="171" height="51" alt="NFTBOX" />
              <p className={styles.slogan}>The New Creative Economy.</p>
            </div>
            <div className={styles.newsletter}>
              <div className={styles.newsletterTitle}>Join Newsletter</div>
              <form className={styles.form}>
                <input className={styles.input} type="email" placeholder="Enter your email" />
                <Button className={styles.button} size="small" colorScheme="primary" circle>
                  <Icon type="arrowRight" size={24} />
                </Button>
              </form>
            </div>
          </div>
          <div className={classnames(styles.linkGroups, styles.right)}>
            <dl className={styles.linkGroup}>
              <dt className={styles.groupTitle}>Social</dt>
              <dd className={styles.groupList}>
                <ul className={styles.links}>
                  <li className={styles.link}>
                    <a href="#">Twitter</a>
                  </li>
                  <li className={styles.link}>
                    <a href="#">Telegram</a>
                  </li>
                </ul>
              </dd>
            </dl>

            <dl className={styles.linkGroup}>
              <dt className={styles.groupTitle}>Docs</dt>
              <dd className={styles.groupList}>
                <ul className={styles.links}>
                  <li className={styles.link}>
                    <a href="#">Medium</a>
                  </li>
                  <li className={styles.link}>
                    <NavLink to="/faqs">FAQs</NavLink>
                  </li>
                </ul>
              </dd>
            </dl>
            <dl className={styles.linkGroup}>
              <dt className={styles.groupTitle}>MarketPlace</dt>
              <dd className={styles.groupList}>
                <ul className={styles.links}>
                  <li className={styles.link}>
                    <a href="#">Mystery</a>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
        <div className={styles.floor}>
          <div className={styles.copyright}>Copyright &copy; 2021 MASKBOX. All rights reserved</div>
          <div className={styles.gdpr}>
            We use cookies for better service.
            <a href="#" className={styles.acceptButton}>
              Accept
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};