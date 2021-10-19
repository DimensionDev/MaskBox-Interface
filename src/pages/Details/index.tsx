import { ArticleSection } from '@/components';
import { MysteryBox, ShareBox } from '@/page-components';
import { ExtendedBoxInfo } from '@/types';
import { FC, memo, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.less';

export const Details: FC = memo(() => {
  const [shareBoxOpen, setShareBoxOpen] = useState(false);
  const location = useLocation();

  const { chainId, boxId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chainId = params.get('chain');
    const boxId = params.get('box');
    return {
      chainId: chainId ? parseInt(chainId, 10) : null,
      boxId,
    };
  }, [location.search]);

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
      <ShareBox open={shareBoxOpen} onClose={() => setShareBoxOpen(false)} />
    </>
  );
});
