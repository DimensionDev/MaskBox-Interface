import { BigNumber } from 'ethers';

// interface Uint256 {
//   _hex: string;
//   toString(): string;
// }

export interface NFTInfo {
  latest_nft_id: BigNumber;
  total: number;
  sold: number;
}

export interface PaymentInfo {
  token_addr: string;
  price: BigNumber;
  receivable_amount: BigNumber;
}

/** response of getCollectionInfo */
export interface CollectionInfo {
  _owner: string;
  _name: string;
  _draw_limit: number;
  _start_time: number;
  _end_time: number;
  _total_quantity: number;
  _drawn_quantity: number;
  _claimed_quantity: number;
  _nft_list: NFTInfo[];
  _payment_list: PaymentInfo[];
}
