import { Button, Field, Input, Textarea, UploadBox } from '@/components';
import { useUpload } from '@/contexts';
import classnames from 'classnames';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Activity,
  descriptionFullfilledAtom,
  formDataAtom,
  newActivity,
  useBindFormField,
} from './atoms';
import styles from './index.module.less';

const wip = true;

export const Description: FC = () => {
  const { upload, uploading } = useUpload();
  const fullfilled = useAtomValue(descriptionFullfilledAtom);
  const history = useHistory();
  const [formData, setFormData] = useAtom(formDataAtom);
  const bindField = useBindFormField();

  const updateActivityAt = (index: number, updater: (activity: Activity) => Activity) => {
    setFormData((fd) => ({
      ...fd,
      activities: fd.activities.map((act, idx) => (idx === index ? updater(act) : act)),
    }));
  };

  const appendActivity = () => {
    setFormData((fd) => ({
      ...fd,
      activities: [...fd.activities, newActivity()],
    }));
  };
  const deleteLastActivity = () => {
    setFormData((fd) => {
      const copy = [...fd.activities];
      copy.pop();
      return {
        ...fd,
        activities: copy,
      };
    });
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Description
        <span className={styles.step}>1/2</span>
      </h2>
      <Field className={styles.field} name="Mystery box name" required>
        <Input
          placeholder="eg. Punk & Mask Special Edition"
          fullWidth
          size="large"
          value={formData.name}
          onChange={bindField('name')}
        />
      </Field>
      <Field className={styles.field} name="Mystery thumbnail" required>
        {/* TODO let uploadBox tab selectable */}
        {wip ? (
          <Input
            placeholder="eg. https://mask.io/assets/images/meme-1.jpg"
            fullWidth
            size="large"
            value={formData.cover}
            onChange={bindField('cover')}
          />
        ) : (
          <UploadBox
            className={styles.uploadBox}
            uploading={uploading}
            previewUrl={formData.cover}
            onClick={async () => {
              const url = await upload();
              setFormData((fd) => ({ ...fd, cover: url }));
            }}
          />
        )}
      </Field>

      {formData.activities.map((activity, index, list) => (
        <Field
          className={styles.field}
          name={`Activity description ${list.length > 1 ? index + 1 : ''}`}
          key={index}
        >
          <Input
            placeholder="eg.Rule Introduction"
            fullWidth
            size="large"
            value={activity.title}
            onChange={(evt) => {
              const newValue = evt.currentTarget.value;
              updateActivityAt(index, (act) => ({ ...act, title: newValue }));
            }}
          />
          <Textarea
            className={styles.cell}
            placeholder="Write Something.."
            value={activity.body}
            onChange={(evt) => {
              const newValue = evt.currentTarget.value;
              updateActivityAt(index, (act) => ({ ...act, body: newValue }));
            }}
          />
        </Field>
      ))}

      <div className={styles.field}>
        <div className={styles.buttonGroup}>
          <Button
            className={styles.button}
            colorScheme="primary"
            size="large"
            onClick={appendActivity}
          >
            Add
          </Button>
          {formData.activities.length > 3 && (
            <Button
              className={styles.button}
              colorScheme="danger"
              size="large"
              onClick={deleteLastActivity}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <div className={styles.field}>
        <Button
          fullWidth
          disabled={!fullfilled}
          colorScheme="primary"
          size="large"
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
