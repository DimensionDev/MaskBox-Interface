import classnames from 'classnames';
import { FC } from 'react';
import { ButtonProps, BaseButton } from '../BaseButton';

import styles from './index.module.less';

export const ThickButton: FC<ButtonProps> = ({ className, ...rest }) => {
  return <BaseButton className={classnames(styles.thickButton, className)} {...rest} />;
};
