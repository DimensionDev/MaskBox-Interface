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
  fileName?: string;
  onDragUpload?: (file: File) => void;
  onStartUpload?: () => void;
  onUploaded?: (opts: { fileAddressList: string[]; fileName: string }) => void;
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
    case MediaType.csv:
      return 10 * 1024 * 1024;
  }
};

const FILE_EXT_RE = /.csv/;
export const UploadButton: FC<Props> = ({
  className,
  fileName,
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
    console.log('file11', file);
    // const fileReader = new FileReader();
    // fileReader.readAsText(file);
    // fileReader.onload = function(){
    //   console.log(this.result)
    // }
    setInvalidMessage('');
    try {
      onStartUpload?.();
      const result = await upload(file, (f) => {
        console.log('f', f);
        const mediaType = getMediaType(f.name);
        const maxSize = getMaxSize(mediaType);
        if (f.size > maxSize) {
          throw new Error(t('File size up to {size}MB', { size: maxSize / (1024 * 1024) }));
        } else if (!f.name.toLowerCase().match(FILE_EXT_RE)) {
          throw new Error(t('You should upload a file, only accept csv'));
        } else {
          const fileReader = new FileReader();
          fileReader.readAsText(f);
          fileReader.onload = function () {
            const addressList = this.result?.toString()?.split(/\s+/);

            if (onUploaded) {
              onUploaded({
                fileAddressList: addressList || [''],
                fileName: f.name,
              });
            }
          };
        }
      });
    } catch (err: any) {
      const message = err.message as string;
      setInvalidMessage(message);
      onError?.(err as Error);
    }
  };
  return (
    <div
      className={classnames(className, styles.UploadButton, {
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
          setInvalidMessage(t('You should upload a file, only csv is supposed'));
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
      {fileName ? (
        <div className={classnames(styles.uploadBox, styles.uploadedBox)}>
          <div>{fileName}</div>
          <Icon
            onClick={() => onUploaded && onUploaded({ addressInfo: '', fileName: '' })}
            size={24}
            type="close"
          />
        </div>
      ) : (
        <div className={styles.uploadBox}>
          {uploading ? <LoadingIcon size={24} /> : <Icon size={24} type="uploadButton" />}
          <div className={styles.description}>{t('Drag or Choose file')}</div>
        </div>
      )}
      <div className={styles.leftEnd}>(.csv)</div>
    </div>
  );
};
