import { BigNumber } from 'ethers';

export interface BoxPayment {
  token_addr: string;
  price: BigNumber;
  receivable_amount: string;
}

export interface BoxInfo {
  name: string;
  creator: string;
  nft_address: string;
  payment: BoxPayment[];
  personal_limit: number;
  started: boolean;
  expired: boolean;
  remaining: BigNumber;
  total: BigNumber;
  qualification: string;
}

export interface CreateResult extends Pick<BoxInfo, 'name' | 'nft_address' | 'creator'> {
  box_id: string;
  start_time: number;
  end_time: number;
  sell_all: boolean;
}
