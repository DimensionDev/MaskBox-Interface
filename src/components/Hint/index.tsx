import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLSpanElement> {
  height?: number;
  width?: number;
}

export const Hint: FC<Props> = ({ className, children, height, width, ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span className={classnames(styles.container, className)} {...rest}>
      <Icon
        type="help"
        size={18}
        onMouseOver={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
      {visible && (
        <div className={styles.bubble} style={{ height, width }}>
          {children}
        </div>
      )}
    </span>
  );
};
