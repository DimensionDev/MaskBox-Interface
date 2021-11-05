import classnames from 'classnames';
import React, { ButtonHTMLAttributes, FC, memo } from 'react';
import { LoadingIcon } from '../Icon';
import styles from './index.module.less';

type VariantType = 'default';
type ColorScheme = 'default' | 'primary' | 'light' | 'danger';
type SizeType = 'small' | 'middle' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: SizeType;
  fullWidth?: boolean;
  variant?: VariantType;
  colorScheme?: ColorScheme;
  round?: boolean;
  circle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap: Record<VariantType, string> = {
  default: styles.variantDefault,
};
const schemeMap: Record<ColorScheme, string> = {
  default: styles.schemeDefault,
  primary: styles.schemePrimary,
  light: styles.schemeLight,
  danger: styles.schemeDanger,
};

export const Button: FC<ButtonProps> = memo(
  ({
    className,
    size,
    fullWidth,
    variant,
    colorScheme,
    children,
    leftIcon,
    rightIcon,
    circle,
    round = true,
    ...rest
  }) => {
    const variantClass = variantMap[variant ?? 'default'];
    const schemeClass = schemeMap[colorScheme ?? 'default'];
    return (
      <button
        className={classnames(
          styles.button,
          className,
          {
            [styles.fullWidth]: fullWidth,
            [styles.round]: round,
            [styles.circle]: circle,
          },
          size ? styles[size] : null,
          variantClass,
          schemeClass,
        )}
        {...rest}
      >
        {leftIcon && (
          <span className={classnames(styles.iconHolder, styles.leftIcon)}>{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className={classnames(styles.iconHolder, styles.rightIcon)}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

interface Props extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton: FC<Props> = ({ loading, ...props }) => {
  return (
    <Button
      leftIcon={loading ? <LoadingIcon size={18} /> : undefined}
      disabled={loading}
      {...props}
    />
  );
};
