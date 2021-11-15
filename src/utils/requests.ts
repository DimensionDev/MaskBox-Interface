import { ERC721Token } from '@/types';

const nftCache = new Map();
export async function fetchNFTTokenDetail(uri: string): Promise<Omit<ERC721Token, 'tokenId'>> {
  if (nftCache.get(uri)) {
    return nftCache.get(uri);
  }

  const response = await fetch(uri);
  const data = await response.json();
  nftCache.set(uri, data);

  return data as Omit<ERC721Token, 'tokenId'>;
}
