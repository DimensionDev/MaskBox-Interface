import { useShowup } from '@/hooks';
import { FC, HTMLProps, useRef } from 'react';
import { Icon } from '../Icon';
import { Image } from '../Image';
import { VideoPlayer } from '../VideoPlayer';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  name?: string;
  image: string;
  animationUrl?: string;
}

export const MediaViewer: FC<Props> = ({ name, image, animationUrl, ...rest }) => {
  const mediaUrl = image || animationUrl || '';
  const ref = useRef<HTMLDivElement>(null);
  const showup = useShowup(ref);
  let hero: JSX.Element = <MockViewer />;
  if (mediaUrl?.match(/\.(png|jpg|gif)$/)) {
    hero = (
      <Image
        className={styles.image}
        loading="lazy"
        src={image}
        alt={name}
        height="100%"
        alternative={<Icon type="mask" size={48} />}
      />
    );
  } else if (mediaUrl.match(/\.mp4$/)) {
    hero = <VideoPlayer className={styles.videoPlayer} src={mediaUrl} alt={name} height="100%" />;
  }

  return (
    <div {...rest} ref={ref}>
      {showup ? hero : <MockViewer />}
    </div>
  );
};

export const MockViewer = () => {
  return <Icon type="mask" size={48} />;
};
