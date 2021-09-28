import classnames from 'classnames';
import { FC } from 'react';
import { BaseButton, ButtonProps } from '../BaseButton';
import styles from './index.module.less';

interface Props extends ButtonProps {}

export const RoundButton: FC<Props> = ({ className, ...rest }) => {
  return <BaseButton className={classnames(styles.roundButton, className)} {...rest} />;
};
