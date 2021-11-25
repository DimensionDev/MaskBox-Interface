import { ChainId } from './chainId';

const BASE_URL = 'https://api.thegraph.com/subgraphs/name/dimensiondev';
export const subgraphEndpoints: Record<number, string> = {
  [ChainId.Mainnet]: `${BASE_URL}/mask-box-mainnet`,
  [ChainId.Rinkeby]: `${BASE_URL}/mask-box-rinkeby`,
  [ChainId.Matic]: `${BASE_URL}/mask-box-polygon`,
};

export function getSubgraphEndpoint(chainId: number) {
  return subgraphEndpoints[chainId];
}
