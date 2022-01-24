import { getStorage, StorageKeys } from '@/utils';
import { BigNumber } from 'ethers';
import { uniq } from 'lodash-es';
import { ChainId } from './chainId';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO = BigNumber.from(0);

function getIgnoreIds(config: string, extendValue: string[] = []) {
  const configIds = config ? config.split(',') : [];
  return uniq([...extendValue, ...configIds]);
}

/**
 * ignore dirty data, pass to `id_not_in` field in `query MaskBoxes`
 */
export const IGNORE_IDS: Partial<Record<ChainId, string[]>> = {
  [ChainId.Mainnet]: getIgnoreIds(process.env.IGNORE_IDS_ON_MAINNET, ['12', '14']),
  [ChainId.Matic]: getIgnoreIds(process.env.IGNORE_IDS_ON_MATIC),
  [ChainId.BSC]: getIgnoreIds(process.env.IGNORE_IDS_ON_BSC),
  [ChainId.Rinkeby]: getIgnoreIds(process.env.IGNORE_IDS_ON_RINKEBY),
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
