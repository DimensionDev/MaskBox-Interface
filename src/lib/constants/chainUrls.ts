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
};
