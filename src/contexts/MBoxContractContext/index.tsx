import { ZERO } from '@/lib';
import { BoxInfo } from '@/types';
import { BigNumber } from 'ethers';
import React, { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useMaskboxContract } from '..';
import { useWeb3Context } from '../Web3Context';

export * from './useAddress';
export * from './useContract';

interface ContextOptions {
  getBoxInfo: (boxId: string) => Promise<BoxInfo>;
  getNftListForSale: (box: string, cursor?: BigNumber, amount?: BigNumber) => Promise<string[]>;
  openBox: (
    boxId: string,
    quantity: number,
    paymentTokenIndex: number,
    proof: string[],
    overrides: Record<string, any>,
  ) => Promise<any>;
  getPurchasedNft: (boxId: string, customer: string) => Promise<string[]>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  getBoxInfo: () => Promise.resolve({} as BoxInfo),
  getNftListForSale: () => Promise.resolve([]),
  openBox: () => Promise.resolve(null),
  getPurchasedNft: () => Promise.resolve([]),
});

export const useMBoxContract = () => useContext(MBoxContractContext);

export function usePurchasedNft(boxId?: string, customer?: string) {
  const { getPurchasedNft } = useMBoxContract();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!boxId || !customer) return;
    getPurchasedNft(boxId, customer).then(setIds);
  }, [boxId, customer, getPurchasedNft]);

  return ids;
}

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { ethersProvider } = useWeb3Context();

  const contract = useMaskboxContract();

  const getBoxInfo = useCallback(
    async (boxId: string) => {
      if (!contract) return;
      const boxInfo = await contract.getBoxInfo(boxId);
      return boxInfo;
    },
    [contract],
  );

  const getNftListForSale = useCallback(
    async (boxId: string, cursor: BigNumber = ZERO, amount: BigNumber = BigNumber.from(20)) => {
      if (!contract) return [];
      const idList: BigNumber[] = await contract.getNftListForSale(boxId, cursor, amount);
      return idList.map((id) => id.toString());
    },
    [contract],
  );

  const openBox = useCallback(
    async (
      boxId: string,
      quantity: number,
      paymentTokenIndex: number,
      proof: string[],
      overrides: Record<string, any>,
    ) => {
      if (!contract || !ethersProvider) {
        return null;
      }
      const tx = await contract
        .connect(ethersProvider.getSigner())
        .openBox(boxId, quantity, paymentTokenIndex, proof, overrides);
      return tx;
    },
    [contract],
  );

  const getPurchasedNft = useCallback(
    async (boxId: string, customer: string) => {
      if (!contract) return [];
      const idList: BigNumber[] = await contract.getPurchasedNft(boxId, customer);
      return idList.map((bn) => bn.toString());
    },
    [contract],
  );

  const contextValue = {
    getBoxInfo,
    getNftListForSale,
    openBox,
    getPurchasedNft,
  };

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
