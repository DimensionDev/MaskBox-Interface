import MysteryBoxABI from './MysteryBox.json';
import MysterBoxNFTABI from './MysterBoxNFT.json';

export { MysteryBoxABI, MysterBoxNFTABI };

export const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address, address) view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];
