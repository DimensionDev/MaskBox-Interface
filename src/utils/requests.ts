import { ERC721TokenMeta } from '@/types';
import { defsUrl } from './defs';

const nftCache = new Map();
export async function fetchNFTTokenDetail(uri: string): Promise<ERC721TokenMeta> {
  if (nftCache.get(uri)) {
    return nftCache.get(uri);
  }

  const response = await fetch(defsUrl(uri));
  const data = (await response.json()) as ERC721TokenMeta;
  if (data.image) {
    data.image = defsUrl(data.image);
  }
  nftCache.set(uri, data);

  return data;
}
