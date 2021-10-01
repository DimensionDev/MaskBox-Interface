import { FC, HTMLProps } from 'react';
import { BaseButton as Button, Icon } from '@/components';
import styles from './index.module.less';
import classnames from 'classnames';

interface Props extends HTMLProps<HTMLDivElement> {}

export const NewsletterBox: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={classnames(styles.newsletter, className)} {...rest}>
      <div className={styles.newsletterTitle}>Join Newsletter</div>
      <form className={styles.form}>
        <input className={styles.input} type="email" placeholder="Enter your email" />
        <Button className={styles.button} size="small" colorScheme="primary" circle>
          <Icon type="arrowRight" size={24} />
        </Button>
      </form>
    </div>
  );
};
