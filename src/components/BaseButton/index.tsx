import classnames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'middle' | 'large';
  fullWidth?: boolean;
}

export const BaseButton: FC<ButtonProps> = ({ className, size, fullWidth, ...rest }) => {
  return (
    <button
      className={classnames(
        styles.button,
        className,
        {
          [styles.fullWidth]: fullWidth,
        },
        size ? styles[size] : null,
      )}
      {...rest}
    />
  );
};
