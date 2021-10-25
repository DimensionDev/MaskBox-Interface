import { ArticleSection, PickerDialog } from '@/components';
import { MysteryBox } from '@/page-components';
import { ExtendedBoxInfo } from '@/types';
import { FC, memo, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.less';

export const Details: FC = memo(() => {
  const location = useLocation();

  const { chainId, boxId, isNew } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chainId = params.get('chain');
    const boxId = params.get('box');
    return {
      chainId: chainId ? parseInt(chainId, 10) : null,
      boxId,
      isNew: !!params.get('new'),
    };
  }, [location.search]);

  const [urlBoxVisible, setUrlBoxVisible] = useState(isNew);
  const boxUrl = `${window.location.origin}/#/details?chain=${chainId}&box=${boxId}`;
  const shareLink = new URL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(boxUrl)}`)
    .href;

  const [box, setBox] = useState<Partial<ExtendedBoxInfo>>({});
  const activities = box.activities ?? [];

  if (!chainId || !boxId) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Box is not found</h1>
      </main>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Mystery box</h1>
        <MysteryBox className={styles.mysteryBox} chainId={chainId} boxId={boxId} onLoad={setBox} />
        {activities.map((activity, index) => (
          <ArticleSection title={activity.title} key={index}>
            {activity.body}
          </ArticleSection>
        ))}
      </main>
      <PickerDialog title="Share" open={urlBoxVisible} onClose={() => setUrlBoxVisible(false)}>
        <div className={styles.urlBoxContent}>
          <p>
            Copy following url, and <a href={shareLink}>share</a> on twitter
          </p>
          <div className={styles.url}>
            <a target="_blank" rel="noopener noreferrer">
              {boxUrl}
            </a>
          </div>
        </div>
      </PickerDialog>
    </>
  );
});
