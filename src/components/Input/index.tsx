import classnames from 'classnames';
import React, { FC, HTMLProps, memo } from 'react';
import styles from './index.module.less';

type SizeType = 'small' | 'middle' | 'large';

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  size?: SizeType;
  fullWidth?: boolean;
  round?: boolean;
  leftAddon?: React.ReactNode;
}

export const Input: FC<Props> = memo(
  ({ size = 'middle', className, type, fullWidth, round, leftAddon, ...rest }) => {
    return (
      <div className={classnames(styles.container, className)}>
        {leftAddon ? <span className={styles.leftHolder}>{leftAddon}</span> : null}
        <input
          className={classnames(styles.input, styles[size], {
            [styles.fullWidth]: fullWidth,
            [styles.round]: round,
            [styles.hasLeft]: leftAddon,
          })}
          type={type ?? 'text'}
          {...rest}
        />
      </div>
    );
  },
);
