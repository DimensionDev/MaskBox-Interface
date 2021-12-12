import { ERC721TokenMeta } from '@/types';
import { defsUrl } from './defs';

const nftCache = new Map();
export async function fetchNFTTokenDetail(uri: string): Promise<ERC721TokenMeta> {
  if (nftCache.get(uri)) {
    return nftCache.get(uri);
  }

  const response = await proxyFetch(defsUrl(uri));
  const data = (await response.json()) as ERC721TokenMeta;
  if (data.image) {
    data.image = defsUrl(data.image);
  }
  nftCache.set(uri, data);

  return data;
}

const PROXY_URL = `https://cors.r2d2.to/`;

export function proxyFetch(uri: string) {
  const proxiedUrl = uri.match(/^https?:\/\/(ipfs.io|arweave.net)/) ? uri : `${PROXY_URL}?${uri}`;
  return fetch(proxiedUrl);
}
