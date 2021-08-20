import { ethers } from 'ethers';

export const contractAddresses = {
  Rinkeby: {
    MysteryBox: '0xBc972613eeb3f1CE0fa2B5B82A38447d5516a7b0',
    MysteryBoxNFT: '0x49E4cA04206ae703674F716d32622f35AfFfD2B0',
    LinkAccessor: '0xFBCFD05989E63B59A9155b7cC3aF51701B1283De',
  },
};

export const drawTxParameters = {
  // 6 M Gwei
  gasLimit: 6000000,
  // `0.01 ether` is the fee users need to pay to draw an NFT
  value: ethers.utils.parseUnits('0.02', 'ether'),
};
