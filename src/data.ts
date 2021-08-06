export const mockNfts = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/300',
    name: '1559 Supporter 718/1559',
    probability: '1%',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/300',
    name: '1559 Supporter 718/1559',
    probability: '1%',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/400/300',
    name: '1559 Supporter 718/1559',
    probability: '1%',
  },
];

export const myNfts = new Array(15).fill(0).map((_, i) => {
  return {
    id: i.toString(),
    imageUrl: 'https://picsum.photos/400/300',
    name: '1559 Supporter 718/1559',
    probability: '1%',
  };
});
