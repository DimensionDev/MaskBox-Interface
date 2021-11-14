import { Button, Field, Input, Textarea, UploadBox } from '@/components';
import { RouteKeys } from '@/configs';
import { UploadResult } from '@/contexts';
import { Activity, MediaType } from '@/types';
import classnames from 'classnames';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  boxIdAtom,
  chainAtom,
  descriptionFullfilledAtom,
  formDataAtom,
  isEdittingAtom,
  newActivity,
  useBindFormField,
  useUpdateFormField,
} from './atoms';
import styles from './index.module.less';
import { useLocales } from './useLocales';

export const Description: FC = () => {
  const t = useLocales();
  const isEditting = useAtomValue(isEdittingAtom);
  const chain = useAtomValue(chainAtom);
  const boxId = useAtomValue(boxIdAtom);
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
  const handleUploaded = useCallback(({ url: mediaUrl, mediaType }: UploadResult) => {
    setUploadError(null);
    setFormData((fd) => ({ ...fd, mediaUrl, mediaType }));
  }, []);

  const [uploadError, setUploadError] = useState<Error | null>(null);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {t('Description')}
        <span className={styles.step}>1/2</span>
      </h2>
      <Field className={styles.field} name={t('MaskBox name') as string} required>
        <Input
          placeholder={t('eg. Punk & Mask Special Edition') as string}
          fullWidth
          size="large"
          value={formData.name}
          onChange={bindField('name')}
        />
      </Field>
      <Field
        className={classnames(styles.field, styles.mediaField)}
        name={t('Mystery thumbnail') as string}
        tip={t('Recommendation: 480*320/960*640') as string}
        required
      >
        <UploadBox
          mediaUrl={formData.mediaUrl}
          mediaType={formData.mediaType}
          tabIndex={0}
          onUploaded={handleUploaded}
          onError={setUploadError}
        />
        {uploadError ? <div className={styles.error}>{uploadError.message}</div> : null}
        {formData.mediaUrl ? (
          <Button
            colorScheme="danger"
            size="small"
            className={styles.mediaRestButton}
            onClick={() => {
              setUploadError(null);
              updateField('mediaUrl', '');
              updateField('mediaType', MediaType.Unknown);
            }}
          >
            {t('Reset')}
          </Button>
        ) : null}
      </Field>

      {formData.activities.map((activity, index, list) => (
        <Field
          className={styles.field}
          name={`${t('Activity description')} ${list.length > 1 ? index + 1 : ''}`}
          key={index}
        >
          <Input
            placeholder={t('eg.Rule Introduction') as string}
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
            placeholder={t('Write Something..') as string}
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
            {t('Add')}
          </Button>
          {formData.activities.length > 3 && (
            <Button
              className={styles.button}
              colorScheme="danger"
              size="large"
              onClick={deleteLastActivity}
            >
              {t('Delete')}
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
            const search = isEditting ? `?chain=${chain}&box=${boxId}` : '';
            history.replace(`${RouteKeys.EditMeta}${search}`);
          }}
        >
          {t('Next')}
        </Button>
      </div>
    </section>
  );
};
