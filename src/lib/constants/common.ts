import { getStorage, StorageKeys } from '@/utils';
import { BigNumber } from 'ethers';
import { ChainId } from './chainId';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO = BigNumber.from(0);

/**
 * ignore dirty data, pass to `id_not_in` field in `query MaskBoxes`
 */
export const IGNORE_IDS: Partial<Record<ChainId, string[]>> = {
  [ChainId.Mainnet]: ['12', '14'],
  [ChainId.Matic]: [],
  [ChainId.BSC]: [],
  [ChainId.Rinkeby]: [],
};

/**
 * skip dirty data, pass to `box_id_gt` field in `query MaskBoxes`
 */
export const SKIPS: Partial<Record<ChainId, number>> = {
  [ChainId.Mainnet]: 10,
  [ChainId.Matic]: 0,
  [ChainId.BSC]: 0,
  [ChainId.Rinkeby]: 0,
};

export const DEV_MODE_ENABLED =
  process.env.NODE_ENV === 'development' || getStorage(StorageKeys.DevMode);
