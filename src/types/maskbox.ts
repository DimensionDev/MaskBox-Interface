import { BigNumber } from 'ethers';

export interface BoxInfo {
  name: string;
  creator: string;
  nft_address: string;
  payment: {
    token_addr: string;
    price: BigNumber;
    receivable_amount: string;
  }[];
  personal_limit: BigNumber;
  started: boolean;
  expired: boolean;
  remaining: BigNumber;
  total: BigNumber;
  qualification: string;
}
