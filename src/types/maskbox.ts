import { BigNumber } from 'ethers';

export interface BoxPayment {
  token_addr: string;
  price: BigNumber;
  receivable_amount: string;
}

export interface BoxInfoOnChain {
  creator: string;
  nft_address: string;
  name: string;
  personal_limit: number;
  qualification_data: string;
  holder_token_addr: string;
  holder_min_token_amount: BigNumber;
}

export interface BoxStatusOnChain {
  payment: BoxPayment[];
  started: boolean;
  expired: boolean;
  canceled: boolean;
  remaining: BigNumber;
  total: BigNumber;
}

export type BoxOnChain = BoxInfoOnChain & BoxStatusOnChain;

export interface CreateResult extends Pick<BoxOnChain, 'name' | 'nft_address' | 'creator'> {
  box_id: string;
  start_time: number;
  end_time: number;
  sell_all: boolean;
}

export enum MediaType {
  Audio = 'audio',
  Image = 'image',
  Video = 'video',
  Unknown = 'unknown',
  Csv = 'csv',
}

export interface Activity {
  title: string;
  body: string;
}

// TODO inherits from BoxStorageNode
export interface BoxMetas {
  id: string;
  name: string;
  mediaType: MediaType;
  mediaUrl: string;
  activities: Activity[];
  whitelistFileName?: string;
  whitelist?: string;
  qualification_rss3: string;
}

export interface ExtendedBoxInfo extends BoxOnChain, BoxMetas {}
