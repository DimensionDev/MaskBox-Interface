import { MysteryBoxABI } from '@/abi';
import { CollectionInfo } from '@/contracts';
import { Contract, ContractInterface } from 'ethers';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { FC } from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  getCollectionInfo(id: number): Promise<CollectionInfo | null>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  getCollectionInfo: () => Promise.resolve(null),
});
export const useMBoxContract = () => useContext(MBoxContractContext);

// Rinkeby
const contractAddress = '0x16E6b23dc20A02696b5E69fBED906fD88FB13397';

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { ethersProvider } = useWeb3Context();

  const getCollectionInfo = useCallback(
    async (id: number) => {
      if (!contractAddress || !ethersProvider) {
        console.log('address', contractAddress);
        return null;
      }
      const contract = new Contract(
        contractAddress!,
        MysteryBoxABI as unknown as ContractInterface,
        ethersProvider,
      );
      const info = await contract
        .getCollectionInfo(id)
        .catch((collectionInfoError: Error) => console.error({ collectionInfoError }));
      return info as CollectionInfo;
    },
    [contractAddress, ethersProvider],
  );

  const contextValue = useMemo(
    () => ({
      getCollectionInfo,
    }),
    [getCollectionInfo],
  );

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
