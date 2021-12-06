export function defsUrl(url: string) {
  if (url.match(/^https?:\/\//)) return url;

  return url.replace(/^(ipfs|ar|dweb):\/\//, (full, m) => {
    switch (m) {
      case 'ipfs':
        return 'https://ipfs.io/ipfs/';
      case 'ipns':
        return 'https://ipfs.io/ipns/';
      case 'dweb':
        return 'https://dweb.link/ipfs/';
      case 'ar':
        return 'https://arweave.net/';
    }
    return full;
  });
}
