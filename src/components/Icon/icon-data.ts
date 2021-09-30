export type IconType =
  | 'arrowRight'
  | 'binance'
  | 'chevronRight'
  | 'close'
  | 'empty'
  | 'ethereum'
  | 'external'
  | 'lisa'
  | 'loading'
  | 'moon'
  | 'polygon'
  | 'risk'
  | 'success'
  | 'sun'
  | 'wallet';
export const iconNameMap = {
  arrowRight: 'arrow-right.svg',
  binance: 'binance.svg',
  chevronRight: 'chevron-right.svg',
  close: 'close.svg',
  empty: 'empty.png',
  ethereum: 'ethereum.svg',
  external: 'external.svg',
  lisa: 'lisa.svg',
  loading: 'loading.svg',
  moon: 'moon.svg',
  polygon: 'polygon.svg',
  risk: 'risk.svg',
  success: 'success.svg',
  sun: 'sun.svg',
  wallet: 'wallet.svg',
};
export const arrowRightIcon = new URL('./icons/arrow-right.svg', import.meta.url).href;
export const binanceIcon = new URL('./icons/binance.svg', import.meta.url).href;
export const chevronRightIcon = new URL('./icons/chevron-right.svg', import.meta.url).href;
export const closeIcon = new URL('./icons/close.svg', import.meta.url).href;
export const emptyIcon = new URL('./icons/empty.png', import.meta.url).href;
export const ethereumIcon = new URL('./icons/ethereum.svg', import.meta.url).href;
export const externalIcon = new URL('./icons/external.svg', import.meta.url).href;
export const lisaIcon = new URL('./icons/lisa.svg', import.meta.url).href;
export const loadingIcon = new URL('./icons/loading.svg', import.meta.url).href;
export const moonIcon = new URL('./icons/moon.svg', import.meta.url).href;
export const polygonIcon = new URL('./icons/polygon.svg', import.meta.url).href;
export const riskIcon = new URL('./icons/risk.svg', import.meta.url).href;
export const successIcon = new URL('./icons/success.svg', import.meta.url).href;
export const sunIcon = new URL('./icons/sun.svg', import.meta.url).href;
export const walletIcon = new URL('./icons/wallet.svg', import.meta.url).href;
const icons = {
  arrowRight: arrowRightIcon,
  binance: binanceIcon,
  chevronRight: chevronRightIcon,
  close: closeIcon,
  empty: emptyIcon,
  ethereum: ethereumIcon,
  external: externalIcon,
  lisa: lisaIcon,
  loading: loadingIcon,
  moon: moonIcon,
  polygon: polygonIcon,
  risk: riskIcon,
  success: successIcon,
  sun: sunIcon,
  wallet: walletIcon,
};
export default icons;
