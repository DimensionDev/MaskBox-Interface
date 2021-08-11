export type IconType = 'close' | 'empty' | 'external' | 'lisa' | 'loading' | 'risk' | 'success';
export const iconNameMap = {
  close: 'close.svg',
  empty: 'empty.png',
  external: 'external.svg',
  lisa: 'lisa.svg',
  loading: 'loading.svg',
  risk: 'risk.svg',
  success: 'success.svg',
};
const close = new URL('./icons/close.svg', import.meta.url).href;
const empty = new URL('./icons/empty.png', import.meta.url).href;
const external = new URL('./icons/external.svg', import.meta.url).href;
const lisa = new URL('./icons/lisa.svg', import.meta.url).href;
const loading = new URL('./icons/loading.svg', import.meta.url).href;
const risk = new URL('./icons/risk.svg', import.meta.url).href;
const success = new URL('./icons/success.svg', import.meta.url).href;
const icons = { close, empty, external, lisa, loading, risk, success };
export default icons;
