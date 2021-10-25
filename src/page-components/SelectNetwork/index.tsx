import { Dialog, DialogProps } from '@/components';
import { useWeb3Context } from '@/contexts';
import { getNetworkName, networks } from '@/lib';
import classnames from 'classnames';
import { FC } from 'react';
import styles from './index.module.less';

interface Props extends DialogProps {}

export const SelectNetwork: FC<Props> = (props) => {
  const { ethersProvider, providerChainId } = useWeb3Context();

  const switchNetwork = async (chainId: number) => {
    if (!ethersProvider?.provider.isMetaMask) return;
    await ethersProvider.provider.request!({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
        },
      ],
    });
    props.onClose?.();
  };
  return (
    <Dialog
      {...props}
      className={classnames(props.className, styles.selectNetwork)}
      title="Select a Network"
    >
      <p className={styles.note}>You are currently on the {getNetworkName(providerChainId!)}</p>
      <ul className={styles.networks}>
        {networks.map((network) => {
          return (
            <li key={network.chainId} onClick={() => switchNetwork(network.chainId)}>
              <div
                role="button"
                className={classnames(
                  styles.network,
                  network.chainId === providerChainId && styles.selected,
                )}
              >
                <div className={styles.networkInner}>
                  <div className={styles.icon}>
                    <img src={network.iconUrl} alt={network.name} />
                  </div>
                  <div className={styles.name}>{network.name}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Dialog>
  );
};
