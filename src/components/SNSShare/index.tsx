import { createShareUrl, createShareUrlForFacebook } from '@/lib';
import classnames from 'classnames';
import { FC, HTMLProps, useCallback } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  boxName: string;
}

export const SNSShare: FC<Props> = ({ className, boxName, ...rest }) => {
  const text = `Check out NFT mystery box ${boxName}on Maskbox platform, let’s try it and good luck! Subscribe @realMaskNetwork for more updates.
${location.href}`;
  const handleShareToTwitter = useCallback(() => {
    const shareLink = createShareUrl(text);
    window.open(shareLink, 'noopener noreferrer');
  }, [text]);
  const handleShareToFacebook = useCallback(() => {
    const shareLink = createShareUrlForFacebook(text);
    window.open(shareLink, 'noopener noreferrer');
  }, [text]);
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
