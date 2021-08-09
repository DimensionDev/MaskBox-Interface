import classnames from 'classnames';
import React, { FC, HTMLProps } from 'react';
import { Overlay } from '../Overlay';
import styles from './index.module.less';

export interface DialogProps extends HTMLProps<HTMLDialogElement> {
  open?: boolean;
  title?: string;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({ title, children, className, open, onClose, ...rest }) => {
  if (!open) return null;

  return (
    <Overlay>
      <dialog className={classnames(styles.dialog, className)} open {...rest}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </dialog>
    </Overlay>
  );
};
