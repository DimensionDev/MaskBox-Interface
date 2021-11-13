import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLSpanElement> {
  colorScheme?: ColorScheme;
}

type ColorScheme = 'default' | 'success';

const schemeMap: Partial<Record<ColorScheme, string>> = {
  success: styles.success,
};

export const Badge: FC<Props> = ({ className, children, colorScheme = 'default', ...rest }) => {
  const schemeClass = schemeMap[colorScheme];
  return (
    <span className={classnames(styles.badge, className, schemeClass)} {...rest}>
      {children}
    </span>
  );
};
