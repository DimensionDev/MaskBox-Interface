import { ZERO_ADDRESS } from '@/lib';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

export function formatAddres(address: string): string {
  const account = getAddress(address);
  const len = account.length;
  return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
}

export function isSameAddress(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}

export function isZeroAddress(addr: string) {
  return isSameAddress(addr, ZERO_ADDRESS);
}

export function addGasMargin(value: BigNumber, scale = 5000) {
  return BigNumber.from(value)
    .mul(10000 + scale)
    .div(10000);
}

/**
 * borrow from Maskbook
 */
export function formatBalance(balance: BigNumber, decimals: number, significant = decimals) {
  const negative = balance.isNegative(); // balance < 0n
  const base = BigNumber.from(10).pow(decimals); // 10n ** decimals

  if (negative) balance = balance.abs(); // balance * -1n

  let fraction = balance.mod(base).toString(); // (balance % base).toString(10)

  // add leading zeros
  while (fraction.length < decimals) fraction = `0${fraction}`;

  // match significant digits
  const matchSignificantDigits = new RegExp(
    `^0*[1-9]\\d{0,${significant > 0 ? significant - 1 : 0}}`,
  );
  fraction = fraction.match(matchSignificantDigits)?.[0] ?? '';

  // trim tailing zeros
  fraction = fraction.replace(/0+$/g, '');

  const whole = balance.div(base).toString(); // (balance / base).toString(10)
  const value = `${whole}${fraction === '' ? '' : `.${fraction}`}`;

  const raw = negative ? `-${value}` : value;
  return raw.includes('.') ? raw.replace(/0+$/, '').replace(/\.$/, '') : raw;
}
