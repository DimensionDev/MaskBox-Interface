import classnames from 'classnames';
import { FC, HTMLProps, memo } from 'react';
import styles from './index.module.less';

type SizeType = 'small' | 'middle' | 'large';

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  size?: SizeType;
  fullWidth?: boolean;
}

export const Input: FC<Props> = memo(({ size = 'middle', className, type, fullWidth, ...rest }) => {
  return (
    <input
      className={classnames(styles.input, className, styles[size], {
        [styles.fullWidth]: fullWidth,
      })}
      type={type ?? 'text'}
      {...rest}
    />
  );
});
