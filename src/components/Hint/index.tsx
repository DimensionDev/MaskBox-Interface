import { useBoolean } from '@/hooks';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLSpanElement> {
  height?: number;
  width?: number;
}

export const Hint: FC<Props> = ({ className, children, height, width, ...rest }) => {
  const [visible, show, hide] = useBoolean();
  return (
    <span className={classnames(styles.container, className)} {...rest}>
      <Icon type="help" size={18} onMouseOver={show} onMouseLeave={hide} />
      {visible && (
        <div className={styles.bubble} style={{ height, width }}>
          {children}
        </div>
      )}
    </span>
  );
};
