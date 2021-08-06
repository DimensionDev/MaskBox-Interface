import classnames from 'classnames';
import React, { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  description?: string;
}
export const Empty: FC<Props> = ({ description, className, ...rest }) => {
  return (
    <div className={classnames(styles.empty, className)} {...rest}>
      <Icon type="empty" size={96} />
      <p>{description}</p>
    </div>
  );
};
