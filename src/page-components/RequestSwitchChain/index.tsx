import { Button } from '@/components';
import { useWeb3Context } from '@/contexts';
import { ChainId, getNetworkName } from '@/lib';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  chainId?: ChainId;
}

export const RequestSwitchChain: FC<Props> = ({ className, chainId, ...rest }) => {
  const t = useLocales();
  const { ethersProvider, providerChainId } = useWeb3Context();
  const cid = chainId || ChainId.Mainnet;
  return (
    <div className={classnames(className, styles.container)} {...rest}>
      <p className={styles.text}>
        {t('{network} is not supported yet', {
          network: providerChainId ? getNetworkName(providerChainId) : '',
        })}
      </p>
      <Button
        className={styles.button}
        onClick={() => {
          if (ethersProvider?.provider) {
            ethersProvider.provider.request!({
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId: `0x${cid.toString(16)}`,
                },
              ],
            });
          }
        }}
      >
        {t('Switch to {network}', { network: getNetworkName(cid) })}
      </Button>
    </div>
  );
};
