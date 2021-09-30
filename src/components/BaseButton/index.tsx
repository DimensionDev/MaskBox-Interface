import classnames from 'classnames';
import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';

type VariantType = 'default';
type ColorScheme = 'default' | 'primary' | 'light';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'middle' | 'large';
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
};

export const BaseButton: FC<ButtonProps> = ({
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
        <span className={classnames(styles.iconHolder, styles.rightIcon)}>{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className={classnames(styles.iconHolder, styles.rightIcon)}>{rightIcon}</span>
      )}
    </button>
  );
};
