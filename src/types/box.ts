import { BoxInfo } from './maskbox';

export interface Activity {
  title: string;
  body: string;
}

export interface BoxMetas {
  mediaType: string;
  mediaUrl: string;
  activities: Activity[];
}

export interface ExtendedBoxInfo extends BoxInfo, BoxMetas {}
