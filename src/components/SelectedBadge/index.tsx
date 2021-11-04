import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  selected?: boolean;
}

export const SelectableIcon: FC<Props> = ({ className, selected, children, ...rest }) => {
  return (
    <span role="button" className={classnames(className, styles.container)} {...rest}>
      {children}
      {selected && <Icon className={styles.icon} type="checked" size={16} />}
    </span>
  );
};
