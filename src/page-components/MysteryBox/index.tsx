import { Button } from '@/components';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const MysteryBox: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={classnames(styles.mysteryBox, className)} {...rest}>
      <div className={styles.media}>
        <img src={new URL('./mock-cover.jpg', import.meta.url).href} alt="name" />
      </div>
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name}>Hash Monkey</dt>
          <dd className={styles.infoRow}>Lucky Draw</dd>
          <dd className={styles.infoRow}>Get your unique card (NFT) by lucky draw</dd>
          <dd className={styles.infoRow}>11/2304</dd>
          <dd className={styles.infoRow}>limit : 5</dd>
        </dl>
        <Button className={styles.drawButton} colorScheme="primary">
          Draw( 20.00 USDT/Time )
        </Button>
      </div>
    </div>
  );
};
