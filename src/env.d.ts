interface Ethereum {
  isMetaMask?: boolean;
  isCoin98?: boolean;
  request: (options: { method: string; params?: any[] }) => Promise<any>;
}
interface Window {
  ethereum: Ethereum;
}
