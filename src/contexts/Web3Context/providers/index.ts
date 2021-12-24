import { INFURA_ID } from '@/lib';
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
      infuraId: INFURA_ID,
      qrcodeModalOptions: {
        desktopLinks: [],
      },
    },
  },
};
const web3modal = new Web3Modal({
  cacheProvider: true,
  disableInjectedProvider: false,
  providerOptions,
});

const clearWCStorage = () => {
  localStorage.removeItem('walletconnect');
};

export default async function getProvider(type?: string) {
  let provider: any;
  switch (type) {
    case ProviderType.Injected:
      provider = await getInjectedProvider();
      break;
    case ProviderType.Walletconnect:
      provider = await web3modal.connectTo('walletconnect');
      break;
    default:
      provider = await web3modal.requestProvider();
  }
  if (provider) {
    provider.on('disconnect', () => {
      web3modal.clearCachedProvider();
      clearWCStorage();
    });
  }
  return provider;
}
export * from './addChainToWallet';
