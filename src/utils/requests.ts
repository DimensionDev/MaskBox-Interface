import { ERC721Token } from '@/types';
import { defsUrl } from './defs';

const nftCache = new Map();
export async function fetchNFTTokenDetail(uri: string): Promise<Omit<ERC721Token, 'tokenId'>> {
  if (nftCache.get(uri)) {
    return nftCache.get(uri);
  }

  const response = await fetch(defsUrl(uri));
  const data = (await response.json()) as Omit<ERC721Token, 'tokenId'>;
  data.image = defsUrl(data.image);
  nftCache.set(uri, data);

  return data;
}
