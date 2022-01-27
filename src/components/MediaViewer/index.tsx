import { FC, HTMLProps, useRef } from 'react';
import { Icon, LoadingCircle } from '../Icon';
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
  return (
    <div {...rest} ref={ref}>
      {mediaUrl.match(/\.mp4$/i) ? (
        <VideoPlayer className={styles.videoPlayer} src={mediaUrl} alt={name} height="100%" />
      ) : (
        <Image
          className={styles.image}
          loading="lazy"
          src={image}
          alt={name}
          height="100%"
          alternative={<Icon type="mask" size={48} />}
        />
      )}
    </div>
  );
};

export const MockViewer: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div {...props}>
      <Icon type="mask" size={48} />;
    </div>
  );
};

export const MediaViewerSkeleton: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div {...props}>
      <LoadingCircle />
    </div>
  );
};
