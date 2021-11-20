import { createShareUrl, createShareUrlForFacebook } from '@/lib';
import classnames from 'classnames';
import { FC, HTMLProps, useCallback } from 'react';
import { Icon } from '../Icon';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  boxName: string;
}

export const SNSShare: FC<Props> = ({ className, boxName, ...rest }) => {
  const t = useLocales();
  const twText = t('sns-share-to-twitter', {
    boxName,
    link: window.location.href,
  });
  const fbText = t('sns-share-to-facebook', {
    boxName,
    link: window.location.href,
  });
  const handleShareToTwitter = useCallback(() => {
    const shareLink = createShareUrl(twText);
    window.open(shareLink, 'noopener noreferrer');
  }, [twText]);
  const handleShareToFacebook = useCallback(() => {
    const shareLink = createShareUrlForFacebook(fbText);
    window.open(shareLink, 'noopener noreferrer');
  }, [fbText]);
  return (
    <div className={classnames(styles.snsShare, className)} {...rest}>
      <Icon type="twitter" className={styles.button} role="button" onClick={handleShareToTwitter} />
      <Icon
        type="facebook"
        className={styles.button}
        role="button"
        onClick={handleShareToFacebook}
      />
    </div>
  );
};
