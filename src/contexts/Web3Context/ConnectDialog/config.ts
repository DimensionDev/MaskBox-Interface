import { ChainId } from '@/lib';
import { getStorage, notEmpty, setStorage, StorageKeys } from '@/utils';
import { ProviderType } from '../providers';

const devModeEnabled = process.env.NODE_ENV === 'development' || getStorage(StorageKeys.DevMode);

window.enableDevMode = () => {
  setStorage(StorageKeys.DevMode, true);
  location.reload();
};

export const connectableChains = [
  {
    name: 'Ethereum',
    chainId: ChainId.Mainnet,
    iconType: 'ethereumChain',
  },
  devModeEnabled
    ? {
        name: 'Rinkeby',
        chainId: ChainId.Rinkeby,
        iconType: 'ethereumChain',
      }
    : null,
  {
    name: 'polygon',
    chainId: ChainId.Matic,
    iconType: 'polygonChain',
  },
  // {
  //   name: 'binance',
  //   chainId: ChainId.BSC,
  //   iconType: 'binanceChain',
  // },
].filter(notEmpty);

interface WalletProvider {
  id: string;
  installed?: boolean;
  type: ProviderType;
  installUrl?: string;
  iconType: 'metamaskWallet' | 'c98' | 'walletconnect';
}

const metamaskWallet: WalletProvider = {
  id: 'metamask',
  installed: true,
  type: ProviderType.Injected,
  iconType: 'metamaskWallet',
};
// const c98Wallet: WalletProvider = {
//   id: 'c98',
//   installed: true,
//   type: 'injected',
//   iconType: 'c98',
// };

const ethereum = window.ethereum ?? {};
const getInjectedWallet = (): WalletProvider => {
  if (ethereum.isMetaMask) {
    return metamaskWallet;
  }
  return {
    ...metamaskWallet,
    installed: false,
    installUrl: 'https://metamask.io/',
  };
};

export const connectableWallets: WalletProvider[] = [
  getInjectedWallet(),
  {
    id: 'walletconnect',
    installed: true,
    type: ProviderType.Walletconnect,
    iconType: 'walletconnect',
  },
  // {
  //   id: 'mask',
  //   type: 'injected',
  //   iconType: 'maskWallet',
  // },
];
