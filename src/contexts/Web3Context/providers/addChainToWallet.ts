import { ethers } from 'ethers';

interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

export function addChainToWallet(
  provider: ethers.providers.Web3Provider,
  chainConfig: AddEthereumChainParameter,
) {
  provider.send('wallet_addEthereumChain', [chainConfig]);
}

export function addRinkebyToWallet(provider: ethers.providers.Web3Provider) {
  addChainToWallet(provider, {
    chainName: 'Ethereum Testnet Rinkeby',
    chainId: '0x4',
    rpcUrls: [
      // infura id from coin98
      'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      'wss://rinkeby.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    nativeCurrency: {
      name: 'Rinkeby Ether',
      symbol: 'RIN',
      decimals: 18,
    },
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  });
}
