import { useUpload } from '@/contexts';
import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Icon, LoadingIcon } from '../Icon';
import { showToast } from '../Toast';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  previewUrl?: string;
  onDragUpload?: (file: File) => void;
  onUploaded?: (url: string) => void;
}

const ONE_MB = 1 * 1024 * 1024;
export const UploadBox: FC<Props> = ({ className, previewUrl, onUploaded, ...rest }) => {
  const { upload, uploading } = useUpload();
  const [invalidMessage, setInvalidMessage] = useState('');
  const [dragingIn, setDragingIn] = useState(false);
  const handleUpload = async (file?: File) => {
    setInvalidMessage('');
    try {
      const url = await upload(file, (f) => {
        if (f.size > ONE_MB) {
          throw new Error('File size of cover image up to 1MB');
        } else if (!f.name.toLowerCase().match(/\.(jpe?g|png|svg|gif|bmp|webp)/)) {
          throw new Error('You should upload an image, only accept jpg, png, svg, gif, bmp, webp');
        }
      });
      if (url && onUploaded) {
        onUploaded(url);
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
        if (firstFile.name.toLowerCase().match(/\.(jpe?g|png|svg|gif|bmp|webp)/)) {
          handleUpload(firstFile);
        } else {
          setInvalidMessage(
            'You should upload an image, only jpg, png, svg, gif, bmp, webp are supposed',
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
      {previewUrl ? (
        <img className={styles.previewImage} src={previewUrl} />
      ) : (
        <div className={styles.inner}>
          {uploading ? <LoadingIcon size={24} /> : <Icon size={24} type="upload" />}
          <div className={styles.description}>
            {invalidMessage ? (
              invalidMessage
            ) : (
              <>
                Drag-and-drap file,or <span className={styles.highlight}>Browse computer</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
