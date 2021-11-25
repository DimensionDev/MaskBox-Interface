import { ChainId } from './chainId';
import { ZERO_ADDRESS } from './common';

export const tokenListUrls: Record<number, string> = {
  1: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/1/tokens.json',
  3: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/3/tokens.json',
  4: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/4/tokens.json',
  56: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/56/tokens.json',
  97: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/97/tokens.json',
  137: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/97/tokens.json',
  100: 'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/100/tokens.json',
  80001:
    'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/80001/tokens.json',
  42161:
    'https://raw.githubusercontent.com/DimensionDev/Mask-Token-List/gh-pages/latest/42161/tokens.json',
};

/**
 * TODO rename to ERC20Token
 */
export interface TokenType {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface TokenListConfig {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: TokenType[];
}

export const nativeTokens: Record<number, TokenType> = {
  [ChainId.Mainnet]: {
    chainId: ChainId.Mainnet,
    address: ZERO_ADDRESS,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ether',
    logoURI:
      'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
  },
  [ChainId.Rinkeby]: {
    chainId: ChainId.Rinkeby,
    address: ZERO_ADDRESS,
    symbol: 'RIN',
    decimals: 18,
    name: 'Rinkeby Ether',
    logoURI:
      'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
  },
  [ChainId.Matic]: {
    chainId: ChainId.Matic,
    address: ZERO_ADDRESS,
    symbol: 'MATIC',
    decimals: 18,
    name: 'MATIC',
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  },
};
