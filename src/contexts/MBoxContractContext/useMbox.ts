import { CollectionInfo } from '@/contracts';
import { DEFAULT_COLLECTION_ID, Price, ZERO, ZERO_PPRICE } from '@/lib';
import { BigNumber } from 'ethers';
import { useState } from 'react';

export interface MboxState {
  info?: CollectionInfo;
  price: Price;
  balance: BigNumber;
  allowance: BigNumber;
  nftCount: number;
  paymentIndex: number;
  collectionId: number;
  isReadyToClaim: boolean;
}

export function useMbox() {
  return useState<MboxState>({
    price: ZERO_PPRICE,
    balance: ZERO,
    allowance: ZERO,
    nftCount: 1,
    paymentIndex: 1,
    collectionId: DEFAULT_COLLECTION_ID,
    isReadyToClaim: false,
  });
}
