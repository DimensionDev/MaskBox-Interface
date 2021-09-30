export * from './web3';
export * from './storage';

export function tenify(num: number) {
  return Math.abs(num) > 9 ? num : `0${num}`;
}