import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

export * from './useDialog';

export interface DialogProps extends HTMLProps<HTMLDivElement> {
  open?: boolean;
  title?: string;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({ title, children, className, open, onClose, ...rest }) => {
  if (!open) return null;

  return (
    <dialog className={classnames(styles.dialog, className)} open {...rest}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button className={styles.closeButton} onClick={onClose}>
          <Icon type="delete" size={32} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
};
