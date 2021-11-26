import { getMediaType, useUpload } from '@/contexts';
import { MediaType } from '@/types';
import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Icon, LoadingIcon } from '../Icon';
import { Image } from '../Image';
import { useLocales } from '../useLocales';
import { VideoPlayer } from '../VideoPlayer';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onError'> {
  mediaUrl?: string;
  mediaType?: MediaType;
  onDragUpload?: (file: File) => void;
  onStartUpload?: () => void;
  onUploaded?: (opts: { url: string; mediaType: MediaType }) => void;
  onError?: (err: Error) => void;
}

const getMaxSize = (mediaType: MediaType) => {
  switch (mediaType) {
    case MediaType.Video:
    case MediaType.Audio:
      return 30 * 1024 * 1024;
    case MediaType.Image:
    case MediaType.Unknown:
      return 2 * 1024 * 1024;
  }
};

const FILE_EXT_RE = /\.(jpe?g|png|svg|gif|bmp|webp|mp4)/;
export const UploadBox: FC<Props> = ({
  className,
  mediaUrl,
  mediaType,
  onUploaded,
  onStartUpload,
  onError,
  ...rest
}) => {
  const t = useLocales();
  const { upload, uploading } = useUpload();
  const [invalidMessage, setInvalidMessage] = useState('');
  const [dragingIn, setDragingIn] = useState(false);
  const handleUpload = async (file?: File) => {
    setInvalidMessage('');
    try {
      onStartUpload?.();
      const result = await upload(file, (f) => {
        const mediaType = getMediaType(f.name);
        const maxSize = getMaxSize(mediaType);
        if (f.size > maxSize) {
          throw new Error(t('File size up to {size}MB', { size: maxSize / (1024 * 1024) }));
        } else if (!f.name.toLowerCase().match(FILE_EXT_RE)) {
          throw new Error(
            t('You should upload an image, only accept jpg, png, svg, gif, bmp, webp, mp4'),
          );
        }
      });
      if (result && onUploaded) {
        onUploaded(result);
      }
    } catch (err: any) {
      const message = err.message as string;
      setInvalidMessage(message);
      onError?.(err as Error);
    }
  };
  return (
    <div
      className={classnames(className, styles.uploadBox, {
        [styles.dragingIn]: dragingIn,
        [styles.error]: !!invalidMessage,
      })}
      onDragOver={(evt) => {
        evt.nativeEvent.preventDefault();
        setDragingIn(true);
      }}
      onDragLeave={(evt) => {
        evt.nativeEvent.preventDefault();
        setDragingIn(false);
      }}
      onDrop={async (evt) => {
        evt.nativeEvent.preventDefault();
        setDragingIn(false);
        const firstFile = evt.dataTransfer.files[0];
        if (!firstFile) return;
        if (firstFile.name.toLowerCase().match(FILE_EXT_RE)) {
          handleUpload(firstFile);
        } else {
          setInvalidMessage(
            t('You should upload an image, only jpg, png, svg, gif, bmp, webp, mp4 are supposed'),
          );
        }
      }}
      onClick={mediaUrl ? undefined : () => handleUpload()}
      onKeyDown={(evt) => {
        if (evt.code === 'Enter') {
          handleUpload();
        }
      }}
      {...rest}
    >
      {mediaUrl ? (
        (() => {
          switch (mediaType) {
            case MediaType.Image:
            case MediaType.Unknown:
              return (
                <Image
                  className={styles.previewImage}
                  src={mediaUrl}
                  alternative={<LoadingIcon size={48} color="inherit" />}
                />
              );
            case MediaType.Video:
              return <VideoPlayer className={styles.previewImage} src={mediaUrl} />;
            case MediaType.Audio:
              return <audio className={styles.previewImage} src={mediaUrl} />;
          }
          return null;
        })()
      ) : (
        <div className={styles.inner}>
          {uploading ? <LoadingIcon size={24} /> : <Icon size={24} type="upload" />}
          <div className={styles.description}>
            <div className={styles.texts}>
              <p className={styles.filetypes}>
                {t('JPG, PNG, SVG,GIF, BMP, WEBP, Max 2MB, MP4 Max 30MB.')}
              </p>
              <p>
                {t('Drag-and-drop file, or')}{' '}
                <span className={styles.highlight}>{t('Browse computer')}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
