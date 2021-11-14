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
  1: {
    chainId: 1,
    address: ZERO_ADDRESS,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ether',
    logoURI:
      'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
  },
  4: {
    chainId: 4,
    address: ZERO_ADDRESS,
    symbol: 'RIN',
    decimals: 18,
    name: 'Rinkeby Ether',
    logoURI:
      'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
  },
};
