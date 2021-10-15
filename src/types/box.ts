import { BoxInfo } from '.';

export interface Activity {
  title: string;
  body: string;
}

export interface BoxMetas {
  cover: string;
  activities: Activity[];
}

export interface ExtendedBoxInfo extends BoxInfo, BoxMetas {}
