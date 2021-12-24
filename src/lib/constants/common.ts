import { BigNumber } from 'ethers';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO = BigNumber.from(0);

/**
 * skip dirty data, make sure same as `box_id_gt` field in `query MaskBoxes`
 */
export const SKIPS = 10;
