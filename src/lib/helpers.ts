import { PaymentInfo } from '@/contracts';
import { BigNumber, Contract, ethers } from 'ethers';
import { chainUrls, networkExplorers, networkIcons, networkNames, ZERO_ADDRESS } from './constants';

export const getRPCUrl = (chainId: keyof typeof chainUrls) => {
  return chainUrls[chainId || 1].rpc;
};

export const logError = (error: { [key: string]: Error }) => {
  console.error(error);
};

export const getNetworkName = (chainId: number) => {
  return networkNames[chainId] || 'Unknown Network';
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

// @deprecate
export const getPrice = async (
  payment: PaymentInfo,
  ethersProvider: ethers.providers.Web3Provider,
): Promise<Price> => {
  if (payment.token_addr === ZERO_ADDRESS) {
    return {
      isNative: true,
      value: BigNumber.from(payment.price),
      decimals: 18,
      symbol: 'eth',
    };
  } else {
    const abi = [
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
    ];
    const tokenContract = new Contract(payment.token_addr, abi, ethersProvider);
    const [decimals, tokenSymbol] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.symbol(),
    ]);
    return {
      isNative: false,
      value: BigNumber.from(payment.price),
      decimals: decimals,
      symbol: tokenSymbol,
    };
  }
};
