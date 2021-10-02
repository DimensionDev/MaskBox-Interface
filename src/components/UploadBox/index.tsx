import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  uploading?: boolean;
  previewUrl?: string;
}

export const UploadBox: FC<Props> = ({ className, uploading, previewUrl, ...rest }) => {
  return (
    <div className={classnames(className, styles.uploadBox)} {...rest}>
      {previewUrl ? (
        <img className={styles.previewImage} src={previewUrl} />
      ) : (
        <div className={styles.inner}>
          <Icon size={24} type={uploading ? 'uploading' : 'upload'} />
          <div className="description">
            Drag-and-drap file,or <span className={styles.highlight}>Browse computer</span>
          </div>
        </div>
      )}
    </div>
  );
};
