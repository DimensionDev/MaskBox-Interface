import classnames from 'classnames';
import { FC, HTMLProps, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '..';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLVideoElement> {}

export const VideoPlayer: FC<Props> = ({ className, src, ...rest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const togglePlayStatus = useCallback(() => {
    const videoEle = videoRef.current;
    if (!videoEle) return;
    if (videoEle.paused || videoEle.ended) {
      videoEle.play();
    } else {
      videoEle.pause();
    }
  }, [playing]);
  useEffect(() => {
    const videoEle = videoRef.current;
    if (!videoEle) return;
    const onPlaying = () => {
      setPlaying(true);
    };
    const onEndedOrPause = () => {
      setPlaying(false);
    };
    videoEle.addEventListener('playing', onPlaying);
    videoEle.addEventListener('ended', onEndedOrPause);
    videoEle.addEventListener('pause', onEndedOrPause);
    return () => {
      videoEle.removeEventListener('playing', onPlaying);
      videoEle.removeEventListener('ended', onEndedOrPause);
      videoEle.removeEventListener('pause', onEndedOrPause);
    };
  }, []);
  return (
    <div className={classnames(className, styles.player)}>
      <video src={src} height="100%" width="100%" ref={videoRef} controls={playing} {...rest} />
      <div className={styles.playPause} role="button" onClick={togglePlayStatus}>
        <Icon type={playing ? 'pause' : 'play'} />
      </div>
    </div>
  );
};
