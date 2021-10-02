import { BaseButton as Button, Input, UploadBox } from '@/components';
import { useUpload } from '@/contexts';
import classnames from 'classnames';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';

export const Description: FC = () => {
  const { upload, uploading } = useUpload();
  const [valid, setValid] = useState(true);
  const history = useHistory();
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Description</h2>
      <div className={styles.field}>
        <label className={styles.fieldName}>Mystery box name</label>
        <Input className={styles.cell} placeholder="eg. Punk & Mask Special Edition" fullWidth />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldName}>Mystery thumbnail</label>
        <UploadBox
          className={classnames(styles.uploadBox, styles.cell)}
          uploading={uploading}
          onClick={async () => {
            const file = await upload();
            console.log(file);
          }}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>Activity description 1 </label>
        <Input className={styles.cell} placeholder="eg.Rule Introduction" fullWidth />
        <textarea className={`${styles.cell} ${styles.textarea}`} placeholder="Write Something.." />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>Activity description 1 </label>
        <Input className={styles.cell} placeholder="eg.Rule Introduction" fullWidth />
        <textarea
          className={classnames(styles.cell, styles.textarea)}
          placeholder="Write Something.."
        />
      </div>

      <div className={styles.field}>
        <div className={styles.buttonGroup}>
          <Button className={styles.button} colorScheme="primary" size="large">
            Add
          </Button>
          <Button className={styles.button} colorScheme="danger" size="large">
            Delete
          </Button>
        </div>
      </div>
      <div className={styles.field}>
        <Button
          fullWidth
          disabled={!valid}
          colorScheme="primary"
          onClick={() => {
            history.push('/edit/meta');
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
};
