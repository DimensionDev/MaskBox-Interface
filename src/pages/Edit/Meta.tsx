import { BaseButton as Button, Input, NFTSelectList } from '@/components';
import classnames from 'classnames';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';

export const Meta: FC = () => {
  const history = useHistory();
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Contract</h2>
      <div className={styles.field}>
        <label className={styles.fieldName}>Price per NFT</label>
        <Input className={styles.cell} placeholder="eg. Punk & Mask Special Edition" fullWidth />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>Limit of purchase per wallet</label>
        <Input className={styles.cell} placeholder="eg. Punk & Mask Special Edition" fullWidth />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>NFT Contract </label>
        <Input
          className={styles.cell}
          placeholder="Drop down to select or enter the contract address"
          fullWidth
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>NFT Contract </label>
        <div className={styles.cell}>
          <div className={styles.selectedNft}>
            <NFTSelectList />
          </div>
        </div>
      </div>

      <div className={styles.rowFieldGroup}>
        <div className={styles.field}>
          <label className={styles.fieldName}>Start date (UTC+8)</label>
          <Input className={styles.cell} placeholder="Date" fullWidth />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldName}>Start date (UTC+8)</label>
          <Input className={styles.cell} placeholder="Date" fullWidth />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>White list contract </label>
        <Input className={styles.cell} placeholder="eg. 0x" fullWidth />
      </div>

      <div className={classnames(styles.field, styles.buttonList)}>
        <Button className={styles.button} fullWidth colorScheme="primary">
          Unlock NFT
        </Button>
        <Button className={styles.button} fullWidth colorScheme="primary">
          Create Mystery box
        </Button>
        <Button
          className={styles.button}
          fullWidth
          onClick={() => {
            if (history.length > 1) {
              history.goBack();
            } else {
              history.push('/edit/desc');
            }
          }}
        >
          Go back
        </Button>
      </div>
    </section>
  );
};
