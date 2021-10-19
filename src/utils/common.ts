import { BigNumber, utils } from 'ethers';

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function tenify(num: number) {
  return Math.abs(num) > 9 ? num : `0${num}`;
}

export function formatBalance(bn: BigNumber, decimals: number, significant = decimals) {
  const value = parseFloat(utils.formatUnits(bn, decimals));
  return value.toFixed(significant);
}
