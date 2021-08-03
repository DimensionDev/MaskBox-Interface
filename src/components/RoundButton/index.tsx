import classnames from 'classnames';
import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './index.module.less';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const RoundButton: FC<Props> = ({ className, ...rest }) => {
  return <button className={classnames(styles.roundButton, className)} {...rest} />;
};
