import { BigNumber } from 'ethers';

export interface BoxPayment {
  token_addr: string;
  price: BigNumber;
  receivable_amount: string;
}

export interface BoxOnChain {
  creator: string;
  nft_address: string;
  name: string;
  payment: BoxPayment[];
  personal_limit: number;
  started: boolean;
  expired: boolean;
  remaining: BigNumber;
  total: BigNumber;
  qualification: string;
}

export interface CreateResult extends Pick<BoxOnChain, 'name' | 'nft_address' | 'creator'> {
  box_id: string;
  start_time: number;
  end_time: number;
  sell_all: boolean;
}
