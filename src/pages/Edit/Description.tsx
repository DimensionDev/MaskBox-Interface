import { Button, Field, Input, Textarea, UploadBox } from '@/components';
import { Activity } from '@/types';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  descriptionFullfilledAtom,
  formDataAtom,
  newActivity,
  useBindFormField,
  useUpdateFormField,
} from './atoms';
import styles from './index.module.less';

export const Description: FC = () => {
  const fullfilled = useAtomValue(descriptionFullfilledAtom);
  const history = useHistory();
  const [formData, setFormData] = useAtom(formDataAtom);
  const bindField = useBindFormField();
  const updateField = useUpdateFormField();

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

  const handleUploaded = useCallback((url) => {
    setFormData((fd) => ({ ...fd, cover: url }));
  }, []);

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
        <UploadBox previewUrl={formData.cover} tabIndex={0} onUploaded={handleUploaded} />
        {formData.cover ? (
          <Button
            colorScheme="danger"
            size="small"
            className={styles.coverRestButton}
            onClick={() => updateField('cover', '')}
          >
            Reset
          </Button>
        ) : null}
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
            history.replace('/edit/meta');
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
};
