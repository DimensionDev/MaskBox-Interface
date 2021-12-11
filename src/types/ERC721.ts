export interface ERC721Token {
  description?: string;
  image?: string;
  name?: string;
  tokenURI?: string;
  tokenId: string;
}

export interface ERC721TokenMeta {
  name?: string;
  image: string;
  image_data?: string;
  external_url?: string;
  description?: string;
  attributes?: Array<Record<string, string>>;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}
