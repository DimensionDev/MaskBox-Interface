import { Button, LoadingIcon, Pagination } from '@/components';
import { RouteKeys } from '@/configs';
import { useWeb3Context } from '@/contexts';
import { MaskBoxesOfQuery, useMaskBoxesOfLazyQuery, useStatisticQuery } from '@/graphql-hooks';
import { usePermissionGranted } from '@/hooks';
import { MyMaskbox, RequestConnection, RequestSwitchChain } from '@/page-components';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useLocales } from './useLocales';

const PAGE_SIZE = 5;
const EMPTY_LIST: MaskBoxesOfQuery['maskboxes'] = [];
export const MyBoxes: FC = () => {
  const t = useLocales();
  const [fetchBoxesOf, { data: boxesData, loading }] = useMaskBoxesOfLazyQuery({});
  const { providerChainId, isNotSupportedChain, account } = useWeb3Context();
  const { data: statsData } = useStatisticQuery({
    variables: {
      id: account ? account.toLowerCase() : '',
    },
  });

  const total = statsData?.maskboxStatistic?.total || 0;

  const history = useHistory();
  const location = useLocation();

  const page = useMemo(() => {
    const p = new URLSearchParams(location.search).get('page');
    return p ? parseInt(p, 10) : 1;
  }, [location.search]);

  const navToPage = useCallback((page: number) => {
    history.push(`/my-maskboxes?page=${page}`);
  }, []);
  const permissionGranted = usePermissionGranted();
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

  const isEmpty = maskboxes.length === 0 && page === 1;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>{t('My MaskBoxes')}</h1>
        {permissionGranted && (
          <Button
            colorScheme="primary"
            onClick={() => {
              history.push(RouteKeys.Edit);
            }}
          >
            {t('Create MaskBox')}
          </Button>
        )}
      </header>
      {isEmpty ? (
        <div className={styles.empty}>
          <p className={styles.text}>
            {permissionGranted
              ? t('You haven’t created any mystery box yet.')
              : t('You are not allowed to create MaskBox.')}
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {maskboxes.map((maskbox) => (
            <li key={maskbox.box_id} className={styles.item}>
              <MyMaskbox boxOnSubgraph={maskbox} />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        className={styles.paginaton}
        page={page}
        total={total}
        size={PAGE_SIZE}
        onChange={navToPage}
      />
    </main>
  );
};
