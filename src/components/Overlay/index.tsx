import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const Overlay: FC<Props> = (props) => {
  return <div {...props} className={classnames(props.className, styles.overlay)} />;
};
