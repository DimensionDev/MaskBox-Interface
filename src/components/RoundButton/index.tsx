import classnames from 'classnames';
import { FC } from 'react';
import { Button, ButtonProps } from '../Button';
import styles from './index.module.less';

interface Props extends ButtonProps {}

export const RoundButton: FC<Props> = ({ className, ...rest }) => {
  return <Button className={classnames(styles.roundButton, className)} {...rest} />;
};
