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
  const iconStyle = useMemo(
    () => ({
      height: `${size}px`,
      width: `${size}px`,
      backgroundImage: `url(${getIcon(type)})`,
      backgroundSize: `${size}px`,
      ...style,
    }),
    [size, type],
  );
  return <span {...rest} className={classnames(styles.icon, className)} style={iconStyle} />;
});
