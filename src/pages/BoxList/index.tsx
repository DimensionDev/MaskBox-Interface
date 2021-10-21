import { Button, LoadingIcon } from '@/components';
import { useWeb3Context } from '@/contexts';
import { useMaskBoxesLazyQuery } from '@/graphql-hooks';
import { MysteryBox } from '@/page-components';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';

const PAGE_SIZE = 10;
export const BoxList: FC = () => {
  const [page, setPage] = useState(1);
  const [fetchBoxes, { data: boxesData, loading }] = useMaskBoxesLazyQuery({});
  const { providerChainId } = useWeb3Context();

  const loadNextPage = () => {
    setPage((p) => p + 1);
  };
  const loadPrevPage = () => {
    setPage((p) => (p > 1 ? p - 1 : 1));
  };
  useEffect(() => {
    fetchBoxes({
      variables: {
        skip: (page - 1) * PAGE_SIZE,
      },
    });
  }, [fetchBoxes, page]);

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <LoadingIcon size={50} />
      </div>
    );
  }

  if (!boxesData?.maskboxes || !providerChainId) return null;

  return (
    <>
      <ul className={styles.list}>
        {boxesData.maskboxes.map((maskbox) => (
          <li key={maskbox.box_id} className={styles.item}>
            <MysteryBox chainId={providerChainId} boxId={maskbox.box_id} inList />
          </li>
        ))}
      </ul>
      <div className={styles.paginaton}>
        <Button className={styles.button} disabled={page === 1} onClick={loadPrevPage}>
          Previous
        </Button>
        <Button className={styles.button} onClick={loadNextPage}>
          Next
        </Button>
      </div>
    </>
  );
};
