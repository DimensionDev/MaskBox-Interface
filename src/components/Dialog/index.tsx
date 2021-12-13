import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export interface DialogProps extends HTMLProps<HTMLDivElement> {
  open?: boolean;
  title?: string;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({ title, children, className, open, onClose, ...rest }) => {
  const t = useLocales();
  if (!open) return null;

  return (
    <dialog className={classnames(styles.dialog, className)} open {...rest}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button className={styles.closeButton} onClick={onClose} aria-label={t('Close')}>
          <Icon type="delete" size={32} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
};
