import React, { FC, memo, useMemo } from 'react';
import classnames from 'classnames';
import { IconType, iconNameMap } from './icon-data';

import styles from './index.module.less';

export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  type: IconType;
  size?: number;
}

const getIcon = (name: IconType) => {
  return new URL(`./icons/${iconNameMap[name]}`, import.meta.url).href;
};

export const Icon: FC<IconProps> = memo(({ type, size, className, style, ...rest }) => {
  const iconSize = size ?? 24;
  const iconStyle = useMemo(
    () => ({
      height: `${iconSize}px`,
      width: `${iconSize}px`,
      backgroundImage: `url(${getIcon(type)})`,
      backgroundSize: `${iconSize}px`,
      ...style,
    }),
    [iconSize, type],
  );
  return <span {...rest} className={classnames(styles.icon, className)} style={iconStyle} />;
});

export const LoadingIcon: FC = () => {
  return <Icon type="loading" size={24} className={styles.spinning} />;
};
