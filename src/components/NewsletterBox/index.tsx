import { FC } from 'react';
import { RoundButton } from '../RoundButton';
import styles from './index.module.less';

export const NewsletterBox: FC = () => {
  return (
    <div className={styles.newsletter}>
      <div className={styles.texts}>
        <h2 className={styles.title}>NFTBOX Newsletter</h2>
        <p className={styles.desc}>Follow us for more information about NFTBOX</p>
      </div>
      <div className={styles.form}>
        <input
          className={styles.inputBox}
          placeholder="Please input your email address"
          type="email"
        />
        <RoundButton className={styles.submitButton} size="large">
          Submit
        </RoundButton>
      </div>
    </div>
  );
};
