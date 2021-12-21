import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Image, ImageProps } from '../Image';
import styles from './index.module.less';
import { icons } from '../Icon';

interface Props extends HTMLProps<HTMLDivElement> {
  sizes: ImageProps['sizes'];
  address?: string;
}

// TODO: implement details

const defaultLogo = new URL('./default-collectible-logo.png', import.meta.url).href;

export const CollectionLogo: FC<Props> = ({ className, sizes, ...rest }) => {
  return (
    <div className={classnames(className, styles.logo)} {...rest}>
      <Image src={defaultLogo} className={styles.image} sizes={sizes} />
    </div>
  );
};
