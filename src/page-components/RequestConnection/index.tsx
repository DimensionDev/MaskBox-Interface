import { Button, LoadingIcon } from '@/components';
import { useWeb3Context } from '@/contexts';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const RequestConnection: FC<Props> = ({ className, ...rest }) => {
  const t = useLocales();
  const { openConnectionDialog, isConnecting } = useWeb3Context();
  return (
    <div className={classnames(className, styles.container)} {...rest}>
      <p className={styles.text}>
        {isConnecting ? t('Connecting') : t('Please connect your wallet.')}
      </p>
      <Button
        className={styles.button}
        onClick={openConnectionDialog}
        disabled={isConnecting}
        leftIcon={isConnecting ? <LoadingIcon /> : undefined}
      >
        {t('Connect Wallet')}
      </Button>
    </div>
  );
};
