import { MediaType } from '@/contexts';
import { BoxOnChain } from './maskbox';

export interface Activity {
  title: string;
  body: string;
}

// TODO inherits from BoxRSS3Node
export interface BoxMetas {
  id: string;
  name: string;
  mediaType: MediaType;
  mediaUrl: string;
  activities: Activity[];
}

export interface ExtendedBoxInfo extends BoxOnChain, BoxMetas {}
