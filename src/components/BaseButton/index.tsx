import classnames from 'classnames';
import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'middle' | 'large';
}

export const BaseButton: FC<ButtonProps> = ({ className, size, ...rest }) => {
  return (
    <button
      className={classnames(styles.button, size ? styles[size] : null, className)}
      {...rest}
    />
  );
};
