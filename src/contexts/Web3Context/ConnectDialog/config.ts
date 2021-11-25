import { ChainId } from '@/lib';
import { ProviderType } from '../providers';
export const connectableChains = [
  {
    name: 'Ethereum',
    chainId: ChainId.Mainnet,
    iconType: 'ethereumChain',
  },
  {
    name: 'Rinkeby',
    chainId: ChainId.Rinkeby,
    iconType: 'ethereumChain',
  },
  // {
  //   name: 'polygon',
  //   chainId: ChainId.Matic,
  //   iconType: 'polygonChain',
  // },
  // {
  //   name: 'binance',
  //   chainId: ChainId.BSC,
  //   iconType: 'binanceChain',
  // },
] as const;

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
