import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLSpanElement> {
  colorScheme?: ColorScheme;
}

type ColorScheme = 'default' | 'success';

const schemeMap: Record<ColorScheme, string> = {
  default: styles.schemeDefault,
  success: styles.schemeSuccess,
};

export const Badge: FC<Props> = ({ className, children, colorScheme = 'default', ...rest }) => {
  const schemeClass = schemeMap[colorScheme];
  return (
    <span className={classnames(styles.badge, className, schemeClass)} {...rest}>
      {children}
    </span>
  );
};
