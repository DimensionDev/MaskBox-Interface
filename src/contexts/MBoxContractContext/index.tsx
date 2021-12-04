import { ZERO } from '@/lib';
import { BoxInfoOnChain, BoxStatusOnChain } from '@/types';
import { addGasMargin } from '@/utils';
import { BigNumber } from 'ethers';
import { createContext, FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useMaskboxContract } from '..';
import { useWeb3Context } from '../Web3Context';

export * from './useAddress';
export * from './useContract';

interface ContextOptions {
  getBoxInfo: (boxId: string) => Promise<BoxInfoOnChain>;
  getBoxStatus: (boxId: string) => Promise<BoxStatusOnChain>;
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

export const MBoxContractContext = createContext<ContextOptions>({
  getBoxInfo: () => Promise.resolve({} as BoxInfoOnChain),
  getBoxStatus: () => Promise.resolve({} as BoxStatusOnChain),
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

  const getBoxStatus = useCallback(
    async (boxId: string) => {
      if (!contract) return;
      const boxStatus = await contract.getBoxStatus(boxId);
      return boxStatus;
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
      const signer = ethersProvider.getSigner();
      const estimatedGas = await contract
        .connect(signer)
        .estimateGas.openBox(boxId, quantity, paymentTokenIndex, proof, overrides);
      const tx = await contract.connect(signer).openBox(boxId, quantity, paymentTokenIndex, proof, {
        gasLimit: addGasMargin(estimatedGas),
        ...overrides,
      });
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
    getBoxStatus,
    getNftListForSale,
    openBox,
    getPurchasedNft,
  };

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
