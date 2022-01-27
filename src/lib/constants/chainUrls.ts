import { ChainId } from './chainId';

export const chainUrls = {
  [ChainId.Mainnet]: {
    rpc: 'https://mainnet-nethermind.blockscout.com/',
    explorer: 'https://etherscan.io',
    explorerName: 'etherscan',
    chainId: ChainId.Mainnet,
    name: 'ETH Mainnet',
  },
  [ChainId.BSC]: {
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    explorerName: 'bscscan',
    chainId: ChainId.BSC,
    name: 'Binance Smart Chain',
  },
  [ChainId.Matic]: {
    rpc: '',
    explorer: 'http://polygonscan.com/',
    explorerName: 'polygon etherscan',
    chainId: ChainId.Matic,
    name: 'Rinkeby',
  },
  [ChainId.Rinkeby]: {
    rpc: '',
    explorer: 'http://rinkeby.etherscan.io/',
    explorerName: 'rinkeby etherscan',
    chainId: ChainId.Rinkeby,
    name: 'Rinkeby',
  },
};
