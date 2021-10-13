import { logoImage } from '@/assets';
import { NewsletterBox } from '@/components';
import { useGdpr } from '@/hooks';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageFooter: FC<Props> = ({ className, ...rest }) => {
  const { accepted, accept } = useGdpr();
  return (
    <footer className={classnames(styles.footer, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <div className={styles.left}>
            <div className={styles.brand}>
              <img src={logoImage} width="171" height="51" alt="NFTBOX" />
              <p className={styles.slogan}>The New Creative Economy.</p>
            </div>
            <NewsletterBox className={styles.newsletter} />
          </div>
          <div className={classnames(styles.linkGroups, styles.right)}>
            <dl className={styles.linkGroup}>
              <dt className={styles.groupTitle}>Social</dt>
              <dd className={styles.groupList}>
                <ul className={styles.links}>
                  <li className={styles.link}>
                    <a href="https://twitter.com/realMaskNetwork">Twitter</a>
                  </li>
                  <li className={styles.link}>
                    <a href="https://t.me/maskbook_group">Telegram</a>
                  </li>
                </ul>
              </dd>
            </dl>

            <dl className={styles.linkGroup}>
              <dt className={styles.groupTitle}>Docs</dt>
              <dd className={styles.groupList}>
                <ul className={styles.links}>
                  <li className={styles.link}>
                    <a href="https://masknetwork.medium.com/">Medium</a>
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
          {!accepted && (
            <div className={styles.gdpr}>
              We use cookies for better service.
              <a className={styles.acceptButton} onClick={accept}>
                Accept
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
