import { ethers } from 'ethers';

export const chainShortNameMap: Record<number, string> = {
  1: 'Mainnet',
  4: 'Rinkeby',
};

export const contractAddresses: Record<string, Record<string, string>> = {
  Mainnet: {
    Maskbox: '0x0dFB34D213f613Dda67a2924F60b5301d42ABFb7',
    MaskboxNFT: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
    LinkAccessor: '0xFBCFD05989E63B59A9155b7cC3aF51701B1283De',
  },
  Rinkeby: {
    Maskbox: '0xbFcf8210F5B6764D86a9C5252218ad627A6a949d',
    MaskboxNFT: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
    LinkAccessor: '0xFBCFD05989E63B59A9155b7cC3aF51701B1283De',
  },
};

// TODO deduplicate with src/types/ERC721#ERC721Token
export interface ERC721Token {
  name: string;
  chainId: number;
  address: string;
  symbol: string;
}

export const NFTContracts: Record<number, ERC721Token[]> = {
  1: [
    {
      chainId: 1,
      name: 'Mask Test NFT',
      address: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
      symbol: 'MaskTestNFT',
    },
  ],
  4: [
    // {
    //   chainId: 4,
    //   name: 'Mask Test NFT',
    //   address: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
    //   symbol: 'MaskTestNFT',
    // },
  ],
};

export const fromBlocks: Record<string, number> = {
  Mainnet: 13396393,
  Rinkeby: 9369286,
};

export const drawTxParameters = {
  // 6 M Gwei
  gasLimit: 6000000,
  // `0.01 ether` is the fee users need to pay to draw an NFT
  value: ethers.utils.parseUnits('0.02', 'ether'),
};

export const getContractFromBlock = (chainId: number) => {
  return fromBlocks[chainId];
};

export const getNFTContracts = (chainId: number) => {
  return NFTContracts[chainId];
};
