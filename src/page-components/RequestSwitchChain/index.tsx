import { Button } from '@/components';
import { useWeb3Context } from '@/contexts';
import { ChainId, getNetworkName } from '@/lib';
import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  chainId?: ChainId;
}

export const RequestSwitchChain: FC<Props> = ({ className, chainId, ...rest }) => {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const cid = chainId || ChainId.Mainnet;
  return (
    <div className={classnames(className, styles.container)} {...rest}>
      <p className={styles.text}>
        {providerChainId ? getNetworkName(providerChainId) : ''} is not supported yet
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
        Switch to {getNetworkName(cid)}
      </Button>
    </div>
  );
};
