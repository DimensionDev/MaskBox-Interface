import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { useLocales } from '../useLocales';
import { Button, Icon } from '@/components';
import styles from './index.module.less';
import { ProviderType, useWeb3Context } from '@/contexts';
import { formatAddres } from '@/utils';
import { getNetworkColor, getNetworkName } from '@/lib';

interface Props extends HTMLProps<HTMLDivElement> {}

export const WalletDocker: FC<Props> = ({ className, ...rest }) => {
  const t = useLocales();
  const {
    connectWeb3,
    isMetaMask,
    providerChainId,
    account,
    openAccountDialog,
    openConnectionDialog,
    isNotSupportedChain,
  } = useWeb3Context();
  return (
    <div className={classnames(styles.walletDocker, className)} {...rest}>
      <div className={styles.operations}>
        {account ? (
          <>
            <Button
              className={styles.button}
              onClick={openConnectionDialog}
              colorScheme={isNotSupportedChain ? 'danger' : 'default'}
            >
              <Icon
                className={styles.icon}
                type="dot"
                color={getNetworkColor(providerChainId!)}
                size={20}
              />
              {isNotSupportedChain ? 'Network error' : getNetworkName(providerChainId!)}
            </Button>

            <Button className={styles.button} title={account} onClick={openAccountDialog}>
              <Icon className={styles.icon} type={isMetaMask ? 'metamask' : 'wallet'} size={16} />
              {formatAddres(account)}
            </Button>
          </>
        ) : (
          <Button
            size="middle"
            onClick={() => {
              connectWeb3?.(undefined, ProviderType.Walletconnect);
            }}
          >
            {t('Connect Wallet')}
          </Button>
        )}
      </div>
    </div>
  );
};
