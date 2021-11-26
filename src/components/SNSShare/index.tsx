import { RouteKeys } from '@/configs';
import { createShareUrl } from '@/lib';
import classnames from 'classnames';
import { FC, HTMLProps, useCallback } from 'react';
import { Icon } from '../Icon';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  chainId: string | number;
  boxId: string | number;
  boxName: string;
}

export const SNSShare: FC<Props> = ({ className, chainId, boxId, boxName, ...rest }) => {
  const t = useLocales();
  const twText = t('sns-share-to-twitter', {
    boxName,
    link: `${location.origin}/#${RouteKeys.Details}?chain=${chainId}&box=${boxId}`,
  });
  const handleShareToTwitter = useCallback(() => {
    const shareLink = createShareUrl(twText);
    window.open(shareLink, 'noopener noreferrer');
  }, [twText]);

  return (
    <div className={classnames(styles.snsShare, className)} {...rest}>
      <Icon type="twitter" className={styles.button} role="button" onClick={handleShareToTwitter} />
    </div>
  );
};
