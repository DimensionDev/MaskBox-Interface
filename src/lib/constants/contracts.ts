import { ethers } from 'ethers';
import { ChainId } from './chainId';

export const chainShortNameMap: Record<number, string> = {
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.Matic]: 'Matic',
};

export const contractAddresses: Record<string, Record<string, string>> = {
  Mainnet: {
    Maskbox: '0x294428f04b0F9EbC49B7Ad61E2736ebD6808c145',
    MaskboxNFT: '0x56136E69A5771436a9598804c5eA792230c21181',
  },
  Rinkeby: {
    Maskbox: '0xF8ED169BC0cdA735A88d32AC10b88AA5B69181ac',
    MaskboxNFT: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
  },
  Matic: {
    Maskbox: '0x02F98667b3A1202a320F67a669a5e4e451fD0cc1',
    MaskboxNFT: '0x49C2a3D93C4B94eAd101d9936f1ebCA634394a78',
  },
};

export interface ERC721Contract {
  name: string;
  chainId: number;
  address: string;
  symbol: string;
}

export const NFTContracts: Record<number, ERC721Contract[]> = {
  [ChainId.Mainnet]: [
    {
      chainId: 1,
      name: 'Mask Test NFT',
      address: '0x56136E69A5771436a9598804c5eA792230c21181',
      symbol: 'MaskTestNFT',
    },
  ],
  [ChainId.Rinkeby]: [
    {
      chainId: 4,
      name: 'Mask Test NFT',
      address: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
      symbol: 'MaskTestNFT',
    },
  ],
  [ChainId.Matic]: [
    {
      chainId: ChainId.Matic,
      name: 'Mask Test NFT',
      address: '0x49C2a3D93C4B94eAd101d9936f1ebCA634394a78',
      symbol: 'MaskTestNFT',
    },
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
