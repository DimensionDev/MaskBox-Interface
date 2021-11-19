import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getInjectedProvider } from './injected';

export enum ProviderType {
  Injected = 'injected',
  WalletConnect = 'wallect-connect',
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.INFURA_ID,
    },
  },
};
const web3modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

export default async function getProvider(providerType?: ProviderType) {
  switch (providerType) {
    case ProviderType.Injected:
      return getInjectedProvider();
    case ProviderType.WalletConnect:
    default:
      return await web3modal.requestProvider();
  }
}
