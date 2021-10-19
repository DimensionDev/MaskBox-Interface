export type IconType =
  | 'add'
  | 'arrowDown'
  | 'arrowRight'
  | 'binance'
  | 'chevronRight'
  | 'close'
  | 'decrease'
  | 'delete'
  | 'empty'
  | 'ethereum'
  | 'external'
  | 'increase'
  | 'lisa'
  | 'loadingDark'
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
  arrowDown: 'arrow-down.svg',
  arrowRight: 'arrow-right.svg',
  binance: 'binance.svg',
  chevronRight: 'chevron-right.svg',
  close: 'close.svg',
  decrease: 'decrease.svg',
  delete: 'delete.svg',
  empty: 'empty.png',
  ethereum: 'ethereum.svg',
  external: 'external.svg',
  increase: 'increase.svg',
  lisa: 'lisa.svg',
  loadingDark: 'loading-dark.svg',
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
export const arrowDownIcon = new URL('./icons/arrow-down.svg', import.meta.url).href;
export const arrowRightIcon = new URL('./icons/arrow-right.svg', import.meta.url).href;
export const binanceIcon = new URL('./icons/binance.svg', import.meta.url).href;
export const chevronRightIcon = new URL('./icons/chevron-right.svg', import.meta.url).href;
export const closeIcon = new URL('./icons/close.svg', import.meta.url).href;
export const decreaseIcon = new URL('./icons/decrease.svg', import.meta.url).href;
export const deleteIcon = new URL('./icons/delete.svg', import.meta.url).href;
export const emptyIcon = new URL('./icons/empty.png', import.meta.url).href;
export const ethereumIcon = new URL('./icons/ethereum.svg', import.meta.url).href;
export const externalIcon = new URL('./icons/external.svg', import.meta.url).href;
export const increaseIcon = new URL('./icons/increase.svg', import.meta.url).href;
export const lisaIcon = new URL('./icons/lisa.svg', import.meta.url).href;
export const loadingDarkIcon = new URL('./icons/loading-dark.svg', import.meta.url).href;
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
  arrowDown: arrowDownIcon,
  arrowRight: arrowRightIcon,
  binance: binanceIcon,
  chevronRight: chevronRightIcon,
  close: closeIcon,
  decrease: decreaseIcon,
  delete: deleteIcon,
  empty: emptyIcon,
  ethereum: ethereumIcon,
  external: externalIcon,
  increase: increaseIcon,
  lisa: lisaIcon,
  loadingDark: loadingDarkIcon,
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
