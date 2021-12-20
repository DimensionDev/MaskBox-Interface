import classnames from 'classnames';
import { FC, HTMLProps, useCallback } from 'react';
import { Button } from '../Button';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  total: number;
  page: number;
  size: number;
  onChange?: (page: number) => void;
}

export const Pagination: FC<Props> = ({ className, total, size = 5, page, onChange, ...rest }) => {
  const t = useLocales();
  const loadPrevPage = useCallback(() => {
    if (!page || !onChange) return;
    const p = page > 1 ? page - 1 : 1;
    onChange(p);
  }, [page, onChange]);

  const pageCount = Math.ceil(total / size);

  const loadNextPage = useCallback(() => {
    if (!page || !onChange) return;
    const p = page > 1 ? page - 1 : 1;
    onChange(p);
  }, [page, onChange]);

  if (pageCount <= 1) return null;

  return (
    <div className={classnames(className, styles.paginaton)} {...rest}>
      {page > 1 && (
        <Button className={styles.button} colorScheme="light" round={false} onClick={loadPrevPage}>
          {t('Previous')}
        </Button>
      )}
      {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((num) => (
        <Button
          colorScheme={page === num ? 'primary' : 'light'}
          round={false}
          key={num}
          onClick={() => onChange?.(num)}
          className={classnames(styles.page, page === num ? styles.selected : undefined)}
        >
          {num}
        </Button>
      ))}
      {page < pageCount && (
        <Button className={styles.button} colorScheme="light" round={false} onClick={loadNextPage}>
          {t('Next')}
        </Button>
      )}
    </div>
  );
};
