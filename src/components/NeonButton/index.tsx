import classnames from 'classnames';
import { FC } from 'react';
import { ButtonProps, Button } from '../Button';

import styles from './index.module.less';

export const NeonButton: FC<ButtonProps> = ({ className, ...rest }) => {
  return <Button className={classnames(styles.neonButton, className)} {...rest} />;
};
