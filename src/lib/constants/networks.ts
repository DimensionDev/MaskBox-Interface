import { ethereumIcon, binanceIcon, polygonIcon } from '../../components/Icon/icon-data';

export const networkNames: Record<number, string> = {
  1: 'ETH Mainnet',
  3: 'Ethereum Testnet Ropsten',
  4: 'Ethereum Testnet Rinkeby',
  5: 'Ethereum Testnet Kovan',
  42: 'Kovan Testnet',
  56: 'Binance Smart Chain',
  77: 'Sokol Testnet',
  97: 'Binance Smart Chain Testnet',
  100: 'xDai Chain',
  137: 'Matic Mainnet',
  80001: 'Matic Testnet Mumbai',
};

export type ChainId = keyof typeof networkNames;
type Network = {
  chainId: ChainId;
  name: string;
  iconUrl: string;
};

export const networkIcons: Record<number, string> = {
  1: ethereumIcon,
  4: ethereumIcon,
  56: binanceIcon,
  137: polygonIcon,
};

export const networks: Network[] = ([1, 56, 137] as const).map((chainId) => {
  return {
    chainId,
    name: networkNames[chainId],
    iconUrl: networkIcons[chainId],
  };
});

export const networkExplorers: Record<number, string> = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/',
  56: 'https://bscscan.com/tx/',
  137: 'https://polygonscan.com/tx/',
};
