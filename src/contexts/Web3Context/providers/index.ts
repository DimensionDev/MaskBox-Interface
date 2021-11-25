import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getInjectedProvider } from './injected';

export enum ProviderType {
  Injected = 'injected',
  Walletconnect = 'walletconnect',
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
  disableInjectedProvider: false,
  providerOptions,
});

export default async function getProvider(type?: string) {
  switch (type) {
    case ProviderType.Injected:
      return getInjectedProvider();
    case ProviderType.Walletconnect:
      return await web3modal.connectTo('walletconnect');
    default:
      return await web3modal.requestProvider();
  }
}
export * from './addChainToWallet';
