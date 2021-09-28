import classnames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';

type VariantType = 'default';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'middle' | 'large';
  fullWidth?: boolean;
  variant?: VariantType;
}

const variantMap: Record<VariantType, string> = {
  default: styles.variantDefault,
};

export const BaseButton: FC<ButtonProps> = ({ className, size, fullWidth, variant, ...rest }) => {
  const variantClass = variantMap[variant ?? 'default'];
  return (
    <button
      className={classnames(
        styles.button,
        className,
        {
          [styles.fullWidth]: fullWidth,
        },
        size ? styles[size] : null,
        variantClass,
      )}
      {...rest}
    />
  );
};
