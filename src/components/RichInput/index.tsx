import classnames from 'classnames';
import { FC, HTMLProps, memo } from 'react';
import { Input, InputProps } from '../Input';
import styles from './index.module.less';

type SizeType = 'small' | 'middle' | 'large';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  leftAddon: React.ReactNode;
  inputProps: InputProps;
}

export const RichInput: FC<Props> = memo(({ leftAddon, className, inputProps, ...rest }) => {
  return (
    <div className={classnames(styles.container, className)} {...rest}>
      {leftAddon ? <span className={styles.leftHolder}>{leftAddon}</span> : null}
      <Input {...inputProps} />
    </div>
  );
});
