const BASE_URL = 'https://api.thegraph.com/subgraphs/name/dimensiondev';
export const subgraphEndpoints: Record<number, string> = {
  1: `${BASE_URL}/mask-box-mainnet`,
  4: `${BASE_URL}/mask-box-rinkeby`,
};

export function getSubgraphEndpoint(chainId: number) {
  return subgraphEndpoints[chainId];
}
