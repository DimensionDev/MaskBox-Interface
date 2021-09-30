import { BaseButton as Button, Icon } from '@/components';
import classnames from 'classnames';
import { FC } from 'react';
import styles from './index.module.less';

export const Home: FC = () => {
  return (
    <main>
      <div className={classnames(styles.frame, styles.heroFrame)}>
        <div className={styles.content}>
          <h2 className={styles.title}>Time to enjoy NFT Mystery on chain !</h2>
          <p className={styles.description}>
            we are a team for professional NFT Mystery launching. Our team is organized by the top
            team in Blockchain field which have amounts of digital art works publishing experiences.
          </p>
          <Button
            colorScheme="primary"
            size="large"
            rightIcon={<Icon type="chevronRight" size={22} />}
          >
            Explore Now
          </Button>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.rightFrame)}>
        <div className={styles.content}>
          <h2 className={styles.title}>Mint your NFT Mystery with a suitbale gas fee</h2>
          <p className={styles.description}>
            Trust us and we’ll try our best to give you the excellent solution of the high gas
            condition. Please check our Github for the contract source code.
          </p>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.leftFrame)}>
        <div className={styles.content}>
          <h2 className={styles.title}>Multi-chains NFT Mystery publishing</h2>
          <p className={styles.description}>Multiple ways to play on Multi-chains.</p>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.rightFrame)}>
        <div className={styles.content}>
          <h2 className={styles.title}>Publish your own NFT Mystery</h2>
          <p className={styles.description}>
            Now publishing your onw NFT Mystery is as easy as opening a Mystery box in reality.
            Please contact us for your project.
          </p>
        </div>
      </div>
    </main>
  );
};
