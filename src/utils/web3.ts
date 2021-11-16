import { ZERO } from '@/lib';
import { BigNumber, utils } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

export function formatAddres(address: string): string {
  const account = getAddress(address);
  const len = account.length;
  return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
}

export function isSameAddress(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}

export function addGasMargin(value: BigNumber, scale = 5000) {
  return BigNumber.from(value)
    .mul(10000 + scale)
    .div(10000);
}

export function formatBalance(bn: BigNumber, decimals: number, significant = decimals) {
  const value = parseFloat(utils.formatUnits(bn, decimals));
  if (bn.eq(ZERO)) return '0';
  const ONE = BigNumber.from(10).pow(decimals);
  if (bn.mod(ONE).eq(ZERO)) return value;
  return value.toFixed(significant);
}
