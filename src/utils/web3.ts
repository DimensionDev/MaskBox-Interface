import { getAddress } from 'ethers/lib/utils';

export function formatAddres(address: string) {
  const account = getAddress(address);
  const len = account.length;
  return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
}
