import classnames from 'classnames';
import React, { FC } from 'react';
import { ButtonProps, BaseButton } from '../BaseButton';

import styles from './index.module.less';

export const NeonButton: FC<ButtonProps> = ({ className, ...rest }) => {
  return <BaseButton className={classnames(styles.neonButton, className)} {...rest} />;
};
