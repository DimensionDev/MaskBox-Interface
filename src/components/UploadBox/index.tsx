import { useUpload, MediaType, getMediaType } from '@/contexts';
import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Icon, LoadingIcon } from '../Icon';
import { showToast } from '../Toast';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  mediaUrl?: string;
  mediaType?: MediaType;
  onDragUpload?: (file: File) => void;
  onUploaded?: (opts: { url: string; mediaType: MediaType }) => void;
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

const FILE_EXT_RE = /\.(jpe?g|png|svg|gif|bmp|webp|mp3|mp4)/;
export const UploadBox: FC<Props> = ({ className, mediaUrl, mediaType, onUploaded, ...rest }) => {
  const { upload, uploading } = useUpload();
  const [invalidMessage, setInvalidMessage] = useState('');
  const [dragingIn, setDragingIn] = useState(false);
  const handleUpload = async (file?: File) => {
    setInvalidMessage('');
    try {
      const result = await upload(file, (f) => {
        const mediaType = getMediaType(f.name);
        const maxSize = getMaxSize(mediaType);
        if (f.size > maxSize) {
          throw new Error(`File size up to ${maxSize / (1024 * 1024)}MB`);
        } else if (!f.name.toLowerCase().match(FILE_EXT_RE)) {
          throw new Error(
            'You should upload an image, only accept jpg, png, svg, gif, bmp, webp, mp3, mp4',
          );
        }
      });
      if (result && onUploaded) {
        onUploaded(result);
      }
    } catch (err: any) {
      const message = err.message as string;
      setInvalidMessage(message);
      showToast({
        variant: 'error',
        title: message,
      });
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
            'You should upload an image, only jpg, png, svg, gif, bmp, webp, mp3, mp4 are supposed',
          );
        }
      }}
      onClick={() => handleUpload()}
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
              return <img className={styles.previewImage} src={mediaUrl} />;
            case MediaType.Video:
              return <video className={styles.previewImage} src={mediaUrl} />;
            case MediaType.Audio:
              return <audio className={styles.previewImage} src={mediaUrl} />;
          }
          return null;
        })()
      ) : (
        <div className={styles.inner}>
          {uploading ? <LoadingIcon size={24} /> : <Icon size={24} type="upload" />}
          <div className={styles.description}>
            {invalidMessage ? (
              invalidMessage
            ) : (
              <div className={styles.texts}>
                <p>JPG, PNG, SVG,GIF, BMP, WEBP, Max 2mb, MP4 or Mp3, Max 30mb.</p>
                <p>
                  Drag-and-drap file, or <span className={styles.highlight}>Browse computer</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
