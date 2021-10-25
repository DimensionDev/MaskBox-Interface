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
  getByIdList(contractAddress: string, idList: string[]): Promise<ERC721Token[]>;
}

export const NFTContractContext = React.createContext<ContextOptions>({
  getMyBalance: () => Promise.resolve(0),
  tokens: [],
  getMyToken: () => Promise.resolve(null),
  getMyTokens: () => Promise.resolve([]),
  getByIdList: () => Promise.resolve([]),
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
      if (!balance) return 0;

      console.log('balance', balance);
      return (balance as BigNumber).toNumber();
    },
    [account],
  );

  const getTokenById = async (contract: Contract, tokenId: string) => {
    const uri = await contract.tokenURI(tokenId);
    const data = await fetchNFTTokenDetail(uri);
    return { ...data, tokenId } as ERC721Token;
  };

  const getMyToken = useCallback(
    async (contract: Contract, index: BigNumber) => {
      const tokenId = await contract
        .tokenOfOwnerByIndex(account, index)
        .catch((getMyTokenError: Error) => console.error({ getMyTokenError }));
      if (!tokenId) return null;
      const token = await getTokenById(contract, tokenId);
      return token;
    },
    [account],
  );

  const getMyTokens = useCallback(
    async (contractAddress: string) => {
      if (!ethersProvider || !utils.isAddress(contractAddress)) {
        setTokens([]);
        return [];
      }
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
    [ethersProvider, getMyBalance, getMyToken],
  );

  const getByIdList = useCallback(
    async (contractAddress: string, idList: string[]) => {
      if (!ethersProvider || !utils.isAddress(contractAddress)) return [];
      const contract = new Contract(contractAddress, MysterBoxNFTABI, ethersProvider);
      const getTokens = idList.map((id) => getTokenById(contract, id));
      const list = (await Promise.all(getTokens)).filter(notEmpty);
      return list;
    },
    [ethersProvider],
  );

  const contextValue = {
    tokens,
    getMyBalance,
    getMyToken,
    getMyTokens,
    getByIdList,
  };

  return <NFTContractContext.Provider value={contextValue}>{children}</NFTContractContext.Provider>;
});
