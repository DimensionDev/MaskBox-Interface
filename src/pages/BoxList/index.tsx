import { Icon, LoadingIcon, Pagination } from '@/components';
import { ThemeType, useTheme, useWeb3Context } from '@/contexts';
import { MaskBoxesQuery, useMaskBoxesLazyQuery, useStatisticQuery } from '@/graphql-hooks';
import { getIgnoreIds, getSkips, ZERO_ADDRESS } from '@/lib';
import { WrapMaskbox } from '@/page-components';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useLocales } from './useLocales';

const PAGE_SIZE = 5;
const EMPTY_LIST: MaskBoxesQuery['maskboxes'] = [];
export const BoxList: FC = () => {
  const t = useLocales();
  const [fetchBoxes, { data: boxesData, loading }] = useMaskBoxesLazyQuery({});
  const { data: statsData } = useStatisticQuery({
    variables: {
      id: ZERO_ADDRESS,
    },
  });
  const { providerChainId: chainId } = useWeb3Context();
  const skips = useMemo(() => (chainId ? getSkips(chainId) : 0), [chainId]);
  const ignoreIds = useMemo(() => (chainId ? getIgnoreIds(chainId) : EMPTY_LIST), [chainId]);
  const total = Math.max((statsData?.maskboxStatistic?.total || 0) - skips - ignoreIds.length, 0);

  const history = useHistory();
  const location = useLocation();
  const { theme } = useTheme();

  const page = useMemo(() => {
    const p = new URLSearchParams(location.search).get('page');
    return p ? parseInt(p, 10) : 1;
  }, [location.search]);

  const navToPage = useCallback((page: number) => {
    history.push(`/list?page=${page}`);
  }, []);

  useEffect(() => {
    if (!page) return;
    fetchBoxes({
      variables: {
        skip: (page - 1) * PAGE_SIZE,
        first: PAGE_SIZE,
        from: skips,
        ignores: ignoreIds,
      },
    });
  }, [fetchBoxes, page, skips, ignoreIds]);

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <LoadingIcon size={50} />
      </div>
    );
  }

  const maskboxes = boxesData?.maskboxes ?? EMPTY_LIST;

  return (
    <>
      {maskboxes.length === 0 ? (
        <div className={styles.status}>
          <p className={styles.text}>{t('No items to display.')}</p>
          <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
        </div>
      ) : (
        <ul className={styles.list}>
          {maskboxes.map((maskbox) => (
            <li key={maskbox.box_id} className={styles.item}>
              <WrapMaskbox boxOnSubgraph={maskbox} inList />
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
    </>
  );
};
