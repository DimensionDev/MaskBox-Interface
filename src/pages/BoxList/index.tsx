import { Button, Icon, LoadingIcon } from '@/components';
import { ThemeType, useTheme } from '@/contexts';
import { MaskBoxesQuery, useMaskBoxesLazyQuery } from '@/graphql-hooks';
import { WrapMaskbox } from '@/page-components';
import { FC, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import { useLocales } from './useLocales';

const PAGE_SIZE = 5;
const EMPTY_LIST: MaskBoxesQuery['maskboxes'] = [];
export const BoxList: FC = () => {
  const t = useLocales();
  const [fetchBoxes, { data: boxesData, loading }] = useMaskBoxesLazyQuery({});

  const history = useHistory();
  const location = useLocation();
  const { theme } = useTheme();

  const page = useMemo(() => {
    const p = new URLSearchParams(location.search).get('page');
    return p ? parseInt(p, 10) : 1;
  }, [location.search]);

  const loadPrevPage = () => {
    if (!page) return;
    const p = page > 1 ? page - 1 : 1;
    history.push(`/list?page=${p}`);
  };
  const loadNextPage = () => {
    if (!page) return;
    history.push(`/list?page=${page + 1}`);
  };
  useEffect(() => {
    if (!page) return;
    fetchBoxes({
      variables: {
        skip: (page - 1) * PAGE_SIZE,
        first: PAGE_SIZE,
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

  const maskboxes = boxesData?.maskboxes ?? EMPTY_LIST;
  if (maskboxes.length === 0) {
    return (
      <div className={styles.status}>
        <p className={styles.text}>{t('No items to display.')}</p>
        <Icon type={theme === ThemeType.Light ? 'empty' : 'emptyDark'} size={96} />
      </div>
    );
  }

  return (
    <>
      <ul className={styles.list}>
        {maskboxes.map((maskbox) => (
          <li key={maskbox.box_id} className={styles.item}>
            <WrapMaskbox boxOnSubgraph={maskbox} inList />
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
    </>
  );
};
