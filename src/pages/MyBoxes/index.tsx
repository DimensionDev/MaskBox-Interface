import { Button, LoadingIcon } from '@/components';
import { RouteKeys } from '@/configs';
import { useWeb3Context } from '@/contexts';
import { MaskBoxesQuery, useMaskBoxesOfLazyQuery } from '@/graphql-hooks';
import { MyMaskbox, RequestConnection, RequestSwitchChain } from '@/page-components';
import { FC, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useLocales } from './useLocales';

const PAGE_SIZE = 5;
const EMPTY_LIST: MaskBoxesQuery['maskboxes'] = [];
export const MyBoxes: FC = () => {
  const t = useLocales();
  const [fetchBoxesOf, { data: boxesData, loading }] = useMaskBoxesOfLazyQuery({});
  const { providerChainId, isNotSupportedChain, account } = useWeb3Context();

  const history = useHistory();
  const location = useLocation();

  const page = useMemo(() => {
    const p = new URLSearchParams(location.search).get('page');
    return p ? parseInt(p, 10) : 1;
  }, [location.search]);

  useEffect(() => {
    if (!page) {
      history.replace(`${RouteKeys.MyMaskboxes}?page=1`);
    }
  }, [history, page]);

  const loadPrevPage = () => {
    if (!page) return;
    const p = page > 1 ? page - 1 : 1;
    history.push(`${RouteKeys.MyMaskboxes}?page=${p}`);
  };
  const loadNextPage = () => {
    if (!page) return;
    history.push(`${RouteKeys.MyMaskboxes}?page=${page + 1}`);
  };
  useEffect(() => {
    if (!page || !account) return;
    fetchBoxesOf({
      variables: {
        skip: (page - 1) * PAGE_SIZE,
        first: PAGE_SIZE,
        account,
      },
    });
  }, [fetchBoxesOf, page, account]);

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <LoadingIcon size={50} />
      </div>
    );
  }

  const maskboxes = boxesData?.maskboxes ?? EMPTY_LIST;

  if (!providerChainId) return <RequestConnection />;
  if (isNotSupportedChain) return <RequestSwitchChain />;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>My Mystery box</h1>
        <Button
          colorScheme="primary"
          onClick={() => {
            history.push(RouteKeys.Edit);
          }}
        >
          Create Mystery box
        </Button>
      </header>
      <ul className={styles.list}>
        {maskboxes.map((maskbox) => (
          <li key={maskbox.box_id} className={styles.item}>
            <MyMaskbox boxOnSubgraph={maskbox} />
          </li>
        ))}
      </ul>
      {page === 1 && maskboxes.length < PAGE_SIZE ? null : (
        <div className={styles.paginaton}>
          <Button className={styles.button} disabled={page === 1 || loading} onClick={loadPrevPage}>
            {t('Previous')}
          </Button>
          <Button
            className={styles.button}
            disabled={maskboxes.length < PAGE_SIZE || loading}
            onClick={loadNextPage}
          >
            {t('Next')}
          </Button>
        </div>
      )}
    </main>
  );
};
