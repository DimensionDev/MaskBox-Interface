import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLTextAreaElement> {}

export const Textarea: FC<Props> = ({ className, ...rest }) => {
  return <textarea className={classnames(styles.textarea, className)} {...rest} />;
};
