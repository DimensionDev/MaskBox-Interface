import classnames from 'classnames';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { Icon, LoadingIcon } from '../Icon';

import styles from './index.module.less';

type VariantType = 'success' | 'warning' | 'error';

export interface CustomToastContentProps {
  title: string;
  message?: string | React.ReactNode;
  icon?: React.ReactNode;
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

interface ShowToastOptions extends Omit<CustomToastContentProps, 'onDismiss'> {}

const ariaProps = {
  className: styles.toastAriaContainerFix,
} as const;

export function showToast(options: ShowToastOptions) {
  const toastId = toast(
    (t) => {
      return (
        <ToastContent
          {...options}
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
    },
  );
  return () => {
    toast.dismiss(toastId);
  };
}
