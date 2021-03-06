import { EMPTY_LIST } from '@/utils';
import { BigNumber } from 'ethers';
import {
  ChainId,
  chainShortNameMap,
  contractAddresses,
  nativeTokens,
  networkExplorers,
  networkIcons,
  networkNames,
  SKIPS,
  IGNORE_IDS,
  tokenListUrls,
  TokenType,
} from '../constants';

export * from './providers';

export const logError = (error: { [key: string]: Error }) => {
  console.error(error);
};

export const getNetworkName = (chainId: number) => {
  return networkNames[chainId] || 'Unknown';
};

export const getSkips = (chainId: ChainId) => {
  return SKIPS[chainId] ?? 0;
};
export const getIgnoreIds = (chainId: ChainId) => {
  return IGNORE_IDS[chainId] ?? EMPTY_LIST;
};

export const getContractAddressConfig = (chainId: number) => {
  const shortName = chainShortNameMap[chainId];
  return contractAddresses[shortName];
};

export const getNetworkIcon = (chainId: number) => {
  return networkIcons[chainId];
};

// TODO use https://api.coingecko.com/api/v3/coins/list
const tokenIdMap: Record<string, string> = {
  mask: 'mask-network',
  eth: 'ethereum',
};
export const getCoingeckoTokenId = (tokenSymbol: string) => {
  return tokenIdMap[tokenSymbol.toLowerCase()];
};

export const getNetworkExplorer = (chainId: number) => {
  return networkExplorers[chainId];
};

export const getTokenListUrl = (chainId: number) => {
  return tokenListUrls[chainId] as string;
};

export const getNativeToken = (chainId: number): TokenType => {
  return nativeTokens[chainId];
};

export type Price = {
  isNative: boolean;
  value: BigNumber;
  decimals: number;
  symbol: string;
};

// TODO Native coins distinguish between different chains
export const ZERO_PPRICE: Price = {
  isNative: true,
  value: BigNumber.from(0),
  decimals: 18,
  symbol: 'eth',
};

export const createShareUrl = (text: string) => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};

export const createShareUrlForFacebook = (text: string) => {
  const url = new URL('https://www.facebook.com/sharer/sharer.php');
  url.searchParams.set('quote', text);
  url.searchParams.set('u', 'mask.io');
  return url.toString();
};
