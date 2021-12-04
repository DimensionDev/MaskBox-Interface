export function ipfsUrl(url: string) {
  return (url = url.startsWith('ipfs://')
    ? `https://cloudflare-ipfs.com/${url.replace('ipfs://', 'ipfs/')}`
    : url);
}
