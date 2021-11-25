import { useBoolean } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLSpanElement> {
  height?: number;
  width?: number;
  position?: 'left' | 'right';
  bubbleProps?: HTMLProps<HTMLDivElement>;
}

export const Hint: FC<Props> = ({
  className,
  children,
  height,
  width,
  position = 'left',
  bubbleProps,
  ...rest
}) => {
  const [visible, show, hide] = useBoolean();
  return (
    <span className={classnames(styles.container, className, styles[position])} {...rest}>
      <Icon type="help" size={18} onMouseOver={show} onMouseLeave={hide} />
      {visible && (
        <div
          className={classnames(styles.bubble, bubbleProps?.className)}
          style={{ height, width, ...bubbleProps?.style }}
        >
          {children}
        </div>
      )}
    </span>
  );
};
