import { ZERO } from '@/lib';
import { BigNumber, utils } from 'ethers';

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function tenify(num: number) {
  return Math.abs(num) > 9 ? num : `0${num}`;
}

export function formatBalance(bn: BigNumber, decimals: number, significant = decimals) {
  const value = parseFloat(utils.formatUnits(bn, decimals));
  if (bn.eq(ZERO)) return '0';
  const ONE = BigNumber.from(10).pow(decimals);
  if (bn.mod(ONE).eq(ZERO)) {
    return value;
  }
  return value.toFixed(significant);
}
