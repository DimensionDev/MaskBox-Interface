import { chainUrls } from '../constants';

function getInfuraId() {
  const ids = process.env.INFURA_ID!.split(',').filter(Boolean);
  const randomIdx = Math.floor(Math.random() * ids.length);
  return ids[randomIdx] || ids[0];
}
export const INFURA_ID = getInfuraId();

/**
 * randomly get a infura id for load balancing
 */
export function getJSONRPCUrl() {
  return `https://mainnet.infura.io/v3/${INFURA_ID}`;
}

export const getRPCUrl = (chainId: keyof typeof chainUrls) => {
  return chainUrls[chainId || 1].rpc;
};
