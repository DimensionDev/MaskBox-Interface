import classnames from 'classnames';
import React, { FC, HTMLProps, memo } from 'react';
import styles from './index.module.less';

type SizeType = 'small' | 'middle' | 'large';

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  size?: SizeType;
  fullWidth?: boolean;
  round?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  multiLine?: boolean;
}

export const Input: FC<InputProps> = memo(
  ({
    size = 'middle',
    className,
    type,
    multiLine = false,
    fullWidth,
    round,
    leftAddon,
    rightAddon,
    ...rest
  }) => {
    return (
      <div className={classnames(styles.container, className)}>
        {leftAddon ? <span className={styles.leftHolder}>{leftAddon}</span> : null}
        {multiLine ? (
          <textarea
            className={classnames(styles.textarea, styles[size], {
              [styles.fullWidth]: fullWidth,
              [styles.round]: round,
              [styles.hasLeft]: leftAddon,
            })}
            rows={4}
            cols={25}
            disabled={rest?.disabled}
            value={rest?.value}
            placeholder={rest?.placeholder}
            onChange={rest?.onChange}
          />
        ) : (
          <input
            className={classnames(styles.input, styles[size], {
              [styles.fullWidth]: fullWidth,
              [styles.round]: round,
              [styles.hasLeft]: leftAddon,
            })}
            type={type ?? 'text'}
            {...rest}
          />
        )}
        {rightAddon ? <span className={styles.rightHolder}>{rightAddon}</span> : null}
      </div>
    );
  },
);
