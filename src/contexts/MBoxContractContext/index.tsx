import { MysteryBoxABI } from '@/abi';
import { ZERO } from '@/lib';
import { BoxInfo } from '@/types';
import { BigNumber, Contract, ContractInterface } from 'ethers';
import React, { FC, memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useWeb3Context } from '../Web3Context';
import { useMaskboxAddress } from './useAddress';

interface ContextOptions {
  contractAddress: string;
  getBoxInfo: (boxId: string) => Promise<BoxInfo>;
  getNftListForSale: (box: string, cursor?: BigNumber, amount?: BigNumber) => Promise<string[]>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  contractAddress: '',
  getBoxInfo: () => Promise.resolve({} as BoxInfo),
  getNftListForSale: () => Promise.resolve([]),
});
export const useMBoxContract = () => useContext(MBoxContractContext);

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { ethersProvider, providerChainId } = useWeb3Context();

  const address = useMaskboxAddress();
  const contract = useRef<Contract>();
  useEffect(() => {
    if (ethersProvider && address) {
      contract.current = new Contract(
        address,
        MysteryBoxABI as unknown as ContractInterface,
        ethersProvider,
      );
    }
  }, [ethersProvider, address]);

  const getBoxInfo = useCallback(
    async (boxId: string) => {
      if (!ethersProvider || !providerChainId || !address) return;
      const contract = new Contract(address, MysteryBoxABI, ethersProvider);
      const boxInfo = await contract.getBoxInfo(boxId);
      return boxInfo;
    },
    [address, providerChainId, ethersProvider],
  );

  const getNftListForSale = useCallback(
    async (boxId: string, cursor: BigNumber = ZERO, amount: BigNumber = BigNumber.from(20)) => {
      if (!ethersProvider || !providerChainId || !address) return [];
      const contract = new Contract(address, MysteryBoxABI, ethersProvider);
      const idList: BigNumber[] = await contract.getNftListForSale(boxId, cursor, amount);
      return idList.map((id) => id.toString());
    },
    [address, providerChainId, ethersProvider],
  );

  const contextValue = {
    contractAddress: address,
    getBoxInfo,
    getNftListForSale,
  };

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
