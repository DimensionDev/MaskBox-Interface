import { MysterBoxNFTABI } from '@/abi';
import { ERC721Token } from '@/types';
import { fetchNFTTokenDetail, notEmpty } from '@/utils';
import { BigNumber, Contract, utils } from 'ethers';
import React, { FC, memo, useCallback, useContext, useState } from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  tokens: ERC721Token[];
  getMyBalance(contract: Contract): Promise<number>;
  getMyToken(contract: Contract, index: BigNumber): Promise<ERC721Token | null>;
  getMyTokens(contractAddress: string): Promise<ERC721Token[]>;
}

export const NFTContractContext = React.createContext<ContextOptions>({
  getMyBalance: () => Promise.resolve(0),
  tokens: [],
  getMyToken: () => Promise.resolve(null),
  getMyTokens: () => Promise.resolve([]),
});
export const useNFTContract = () => useContext(NFTContractContext);

export const NFTContractProvider: FC = memo(({ children }) => {
  const { ethersProvider, account } = useWeb3Context();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);

  const getMyBalance = useCallback(
    async (contract: Contract) => {
      if (!account || !ethersProvider) return 0;

      const balance = await contract
        .balanceOf(account)
        .catch((getMyBalanceError: Error) => console.error({ getMyBalanceError }));

      console.log('balance', balance);
      return (balance as BigNumber).toNumber();
    },
    [account],
  );

  const getMyToken = useCallback(
    async (contract: Contract, index: BigNumber) => {
      const tokenId = await contract
        .tokenOfOwnerByIndex(account, index)
        .catch((getMyTokenError: Error) => console.error({ getMyTokenError }));
      if (!tokenId) return null;
      const uri = await contract.tokenURI(tokenId);
      const data = await fetchNFTTokenDetail(uri);
      return { ...data, tokenId: index.toString() } as ERC721Token;
    },
    [account],
  );

  const getMyTokens = useCallback(
    async (contractAddress: string) => {
      if (!ethersProvider || !utils.isAddress(contractAddress)) return [];
      const contract = new Contract(contractAddress, MysterBoxNFTABI, ethersProvider);
      const balance = await getMyBalance(contract);
      console.log('balance', balance);
      const getTokens = new Array(balance)
        .fill(0)
        .map((_, index) => getMyToken(contract, BigNumber.from(index)));
      const list = (await Promise.all(getTokens)).filter(notEmpty);
      setTokens(list);
      return list;
    },
    [getMyBalance, getMyToken],
  );

  const contextValue = {
    tokens,
    getMyTokens,
    getMyBalance,
    getMyToken,
  };

  return <NFTContractContext.Provider value={contextValue}>{children}</NFTContractContext.Provider>;
});
