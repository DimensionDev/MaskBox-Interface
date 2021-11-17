import { FC, HTMLProps } from 'react';
import { Button, Icon } from '@/components';
import styles from './index.module.less';
import classnames from 'classnames';
import { useLocales } from '../useLocales';

interface Props extends HTMLProps<HTMLDivElement> {}

export const NewsletterBox: FC<Props> = ({ className, ...rest }) => {
  const t = useLocales();
  return (
    <div className={classnames(styles.newsletter, className)} {...rest}>
      <div className={styles.newsletterTitle}>{t('Join Newsletter')}</div>
      <form className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder={t('Enter your email') as string}
        />
        <Button className={styles.button} size="small" colorScheme="primary" circle>
          <Icon type="arrowRight" size={24} />
        </Button>
      </form>
    </div>
  );
};
