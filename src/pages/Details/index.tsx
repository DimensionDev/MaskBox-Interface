import { ArticleSection } from '@/components';
import { MysteryBox, ShareBox } from '@/page-components';
import { FC, memo, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as data from './data';
import styles from './index.module.less';
import { useGetExtendedBoxInfo } from './useGetExtendedBoxInfo';

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
  }, [location]);

  const extendedBoxInfo = useGetExtendedBoxInfo(chainId, boxId);
  const activities = extendedBoxInfo.activities ?? [];

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Mystery box</h1>
        <MysteryBox className={styles.mysteryBox} box={extendedBoxInfo} />
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
