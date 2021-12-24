import { chainUrls } from '../constants';

/**
 * randomly get a infura id for load balancing
 */
export function getJSONRPCUrl() {
  const ids = process.env.INFURA_ID!.split(',');
  const randomIdx = Math.ceil(Math.random() * ids.length);
  return `https://mainnet.infura.io/v3/${ids[randomIdx]}`;
}

export const getRPCUrl = (chainId: keyof typeof chainUrls) => {
  return chainUrls[chainId || 1].rpc;
};
