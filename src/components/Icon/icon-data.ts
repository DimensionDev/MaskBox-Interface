export type IconType =
  | 'binance'
  | 'close'
  | 'empty'
  | 'ethereum'
  | 'external'
  | 'lisa'
  | 'loading'
  | 'polygon'
  | 'risk'
  | 'success'
  | 'wallet';
export const iconNameMap = {
  binance: 'binance.svg',
  close: 'close.svg',
  empty: 'empty.png',
  ethereum: 'ethereum.svg',
  external: 'external.svg',
  lisa: 'lisa.svg',
  loading: 'loading.svg',
  polygon: 'polygon.svg',
  risk: 'risk.svg',
  success: 'success.svg',
  wallet: 'wallet.svg',
};
export const binanceIcon = new URL('./icons/binance.svg', import.meta.url).href;
export const closeIcon = new URL('./icons/close.svg', import.meta.url).href;
export const emptyIcon = new URL('./icons/empty.png', import.meta.url).href;
export const ethereumIcon = new URL('./icons/ethereum.svg', import.meta.url).href;
export const externalIcon = new URL('./icons/external.svg', import.meta.url).href;
export const lisaIcon = new URL('./icons/lisa.svg', import.meta.url).href;
export const loadingIcon = new URL('./icons/loading.svg', import.meta.url).href;
export const polygonIcon = new URL('./icons/polygon.svg', import.meta.url).href;
export const riskIcon = new URL('./icons/risk.svg', import.meta.url).href;
export const successIcon = new URL('./icons/success.svg', import.meta.url).href;
export const walletIcon = new URL('./icons/wallet.svg', import.meta.url).href;
const icons = {
  binance: binanceIcon,
  close: closeIcon,
  empty: emptyIcon,
  ethereum: ethereumIcon,
  external: externalIcon,
  lisa: lisaIcon,
  loading: loadingIcon,
  polygon: polygonIcon,
  risk: riskIcon,
  success: successIcon,
  wallet: walletIcon,
};
export default icons;
