import type { NFTItemProps } from './components';

export const mockNfts: NFTItemProps[] = [
  {
    latest_nft_id: {
      _hex: '1',
      toString: () => '1',
    },
    total: 100,
    sold: 5,
    percentage: 10,
    name: '1559 Supporter 718/1559',
    imageUrl: 'https://picsum.photos/400/300',
  },
  {
    latest_nft_id: {
      _hex: '2',
      toString: () => '2',
    },
    total: 100,
    sold: 5,
    percentage: 10,
    name: '1559 Supporter 718/1559',
    imageUrl: 'https://picsum.photos/400/300',
  },
  {
    latest_nft_id: {
      _hex: '3',
      toString: () => '3',
    },
    total: 100,
    sold: 5,
    percentage: 10,
    name: '1559 Supporter 718/1559',
    imageUrl: 'https://picsum.photos/400/300',
  },
];

export const myNfts: NFTItemProps[] = new Array(15).fill(mockNfts[0]).map((nft, i) => {
  return {
    ...nft,
    latest_nft_id: {
      _hex: `${i + mockNfts.length}`,
      toString: () => `${i + mockNfts.length}`,
    },
  };
});
