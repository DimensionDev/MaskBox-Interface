import classnames from 'classnames';
import { omit, pick } from 'lodash-es';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { ToastOptions } from 'react-hot-toast/dist/core/types';
import { Icon, LoadingIcon } from '../Icon';

import styles from './index.module.less';

type VariantType = 'success' | 'warning' | 'error';

export interface CustomToastContentProps {
  title: string;
  message?: string | React.ReactNode;
  processing?: boolean;
  variant?: VariantType;
  onDismiss?: () => void;
}

const IconMap: Record<VariantType, React.ReactNode> = {
  success: <Icon type="success" />,
  error: <Icon type="risk" />,
  warning: null,
};

export const ToastContent: FC<CustomToastContentProps> = ({
  title,
  message,
  processing,
  variant,
  onDismiss,
}) => {
  const variantIcon = processing ? <LoadingIcon /> : variant ? IconMap[variant] : null;
  return (
    <div className={classnames(styles.content, variant ? styles[variant] : null)}>
      {variantIcon && <div className={styles.icon}>{variantIcon}</div>}
      <div className={styles.texts}>
        <h2 className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <Icon type="close" className={styles.closeButton} onClick={onDismiss} />
    </div>
  );
};

interface ShowToastOptions extends Omit<CustomToastContentProps, 'onDismiss'>, ToastOptions {}

const ariaProps = {
  className: styles.toastAriaContainerFix,
} as const;

export function showToast(options: ShowToastOptions) {
  const contentOptions = pick<ShowToastOptions, 'title' | 'message' | 'processing' | 'variant'>(
    options,
    'title',
    'message',
    'processing',
    'variant',
  );
  const restOptions = omit(options, 'title', 'message', 'processing', 'variant');
  const toastId = toast(
    (t) => {
      return (
        <ToastContent
          {...contentOptions}
          onDismiss={() => {
            toast.dismiss(t.id);
          }}
        />
      );
    },
    {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      ariaProps,
      duration: options.processing ? Infinity : undefined,
      ...restOptions,
    },
  );
  return () => {
    toast.dismiss(toastId);
  };
}
