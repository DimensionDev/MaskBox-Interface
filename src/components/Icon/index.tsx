import { FC, memo, useMemo } from 'react';
import classnames from 'classnames';
import icons, { IconType } from './icon-data';

import styles from './index.module.less';

export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  type?: IconType;
  iconUrl?: string;
  size?: number;
}

export const Icon: FC<IconProps> = memo(({ type, iconUrl, size, className, style, ...rest }) => {
  const iconSize = size ?? 24;
  const iconStyle = useMemo(
    () => ({
      height: `${iconSize}px`,
      width: `${iconSize}px`,
      backgroundImage: `url(${iconUrl ?? icons[type!]})`,
      backgroundSize: `${iconSize}px`,
      ...style,
    }),
    [iconSize, iconUrl, type],
  );
  return <span {...rest} className={classnames(styles.icon, className)} style={iconStyle} />;
});

export const LoadingIcon: FC<Omit<IconProps, 'type'>> = (props) => {
  return (
    <Icon
      size={24}
      className={classnames(props.className, styles.spinning)}
      {...props}
      type="loading"
    />
  );
};

export type { IconType };
