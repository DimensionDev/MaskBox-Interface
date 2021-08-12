import { chainUrls, networkIcons, networkNames } from './constants';

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
