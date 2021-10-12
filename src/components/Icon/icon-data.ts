export type IconType =
  | 'add'
  | 'arrowRight'
  | 'binance'
  | 'chevronRight'
  | 'close'
  | 'delete'
  | 'empty'
  | 'ethereum'
  | 'external'
  | 'lisa'
  | 'loading'
  | 'moon'
  | 'polygon'
  | 'riskRed'
  | 'risk'
  | 'search'
  | 'success'
  | 'sun'
  | 'upload'
  | 'uploading'
  | 'wallet';
export const iconNameMap = {
  add: 'add.svg',
  arrowRight: 'arrow-right.svg',
  binance: 'binance.svg',
  chevronRight: 'chevron-right.svg',
  close: 'close.svg',
  delete: 'delete.svg',
  empty: 'empty.png',
  ethereum: 'ethereum.svg',
  external: 'external.svg',
  lisa: 'lisa.svg',
  loading: 'loading.svg',
  moon: 'moon.svg',
  polygon: 'polygon.svg',
  riskRed: 'risk-red.svg',
  risk: 'risk.svg',
  search: 'search.svg',
  success: 'success.svg',
  sun: 'sun.svg',
  upload: 'upload.svg',
  uploading: 'uploading.svg',
  wallet: 'wallet.svg',
};
export const addIcon = new URL('./icons/add.svg', import.meta.url).href;
export const arrowRightIcon = new URL('./icons/arrow-right.svg', import.meta.url).href;
export const binanceIcon = new URL('./icons/binance.svg', import.meta.url).href;
export const chevronRightIcon = new URL('./icons/chevron-right.svg', import.meta.url).href;
export const closeIcon = new URL('./icons/close.svg', import.meta.url).href;
export const deleteIcon = new URL('./icons/delete.svg', import.meta.url).href;
export const emptyIcon = new URL('./icons/empty.png', import.meta.url).href;
export const ethereumIcon = new URL('./icons/ethereum.svg', import.meta.url).href;
export const externalIcon = new URL('./icons/external.svg', import.meta.url).href;
export const lisaIcon = new URL('./icons/lisa.svg', import.meta.url).href;
export const loadingIcon = new URL('./icons/loading.svg', import.meta.url).href;
export const moonIcon = new URL('./icons/moon.svg', import.meta.url).href;
export const polygonIcon = new URL('./icons/polygon.svg', import.meta.url).href;
export const riskRedIcon = new URL('./icons/risk-red.svg', import.meta.url).href;
export const riskIcon = new URL('./icons/risk.svg', import.meta.url).href;
export const searchIcon = new URL('./icons/search.svg', import.meta.url).href;
export const successIcon = new URL('./icons/success.svg', import.meta.url).href;
export const sunIcon = new URL('./icons/sun.svg', import.meta.url).href;
export const uploadIcon = new URL('./icons/upload.svg', import.meta.url).href;
export const uploadingIcon = new URL('./icons/uploading.svg', import.meta.url).href;
export const walletIcon = new URL('./icons/wallet.svg', import.meta.url).href;
const icons = {
  add: addIcon,
  arrowRight: arrowRightIcon,
  binance: binanceIcon,
  chevronRight: chevronRightIcon,
  close: closeIcon,
  delete: deleteIcon,
  empty: emptyIcon,
  ethereum: ethereumIcon,
  external: externalIcon,
  lisa: lisaIcon,
  loading: loadingIcon,
  moon: moonIcon,
  polygon: polygonIcon,
  riskRed: riskRedIcon,
  risk: riskIcon,
  search: searchIcon,
  success: successIcon,
  sun: sunIcon,
  upload: uploadIcon,
  uploading: uploadingIcon,
  wallet: walletIcon,
};
export default icons;
