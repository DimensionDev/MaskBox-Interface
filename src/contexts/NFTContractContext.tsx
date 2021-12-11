import { MaskboxNFTABI } from '@/abi';
import { showToast } from '@/components';
import { ERC721Token } from '@/types';
import { notEmpty } from '@/utils';
import { BigNumber, Contract, utils } from 'ethers';
import React, { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  tokens: ERC721Token[];
  getName: (address?: string) => Promise<string>;
  getMyBalance(contract: Contract): Promise<number>;
  getMyToken(contract: Contract, index: BigNumber): Promise<ERC721Token | null | undefined>;
  getMyTokens(contractAddress: string): Promise<ERC721Token[]>;
  getByIdList(contractAddress: string, idList: string[]): Promise<ERC721Token[]>;
}

export const NFTContractContext = React.createContext<ContextOptions>({
  tokens: [],
  getName: () => Promise.resolve(''),
  getMyBalance: () => Promise.resolve(0),
  getMyToken: () => Promise.resolve(null),
  getMyTokens: () => Promise.resolve([]),
  getByIdList: () => Promise.resolve([]),
});
export const useNFTContract = () => useContext(NFTContractContext);

export function useNFTName(address?: string) {
  const [name, setName] = useState('');
  const { getName } = useNFTContract();
  useEffect(() => {
    getName(address).then(setName);
  }, [getName, address]);
  return name;
}

export const NFTContractProvider: FC = memo(({ children }) => {
  const { ethersProvider, account } = useWeb3Context();
  const [tokens, setTokens] = useState<ERC721Token[]>([]);

  const getMyBalance = useCallback(
    async (contract: Contract) => {
      if (!account || !ethersProvider) return 0;
      try {
        const balance = await contract.balanceOf(account);
        if (!balance) return 0;
        return (balance as BigNumber).toNumber();
      } catch (getMyBalanceError: any) {
        console.error({ getMyBalanceError });
        return 0;
      }
    },
    [account, ethersProvider],
  );

  const getTokenById = async (contract: Contract, tokenId: string): Promise<ERC721Token> => {
    const uri = await contract.tokenURI(tokenId);
    return { tokenURI: uri, tokenId };
  };

  const getMyToken = useCallback(
    async (contract: Contract, index: BigNumber) => {
      try {
        const tokenId: BigNumber = await contract.tokenOfOwnerByIndex(account, index);
        if (!tokenId) return null;
        const token = await getTokenById(contract, tokenId.toString());
        return token;
      } catch (getMyTokenError: any) {
        if (getMyTokenError.reason) {
          showToast({
            title: getMyTokenError.reason,
            variant: 'error',
          });
        }
        console.error({ getMyTokenError });
      }
    },
    [account],
  );

  const getName = useCallback(
    async (contractAddress?: string) => {
      if (!ethersProvider || !contractAddress || !utils.isAddress(contractAddress)) {
        return '';
      }
      const contract = new Contract(contractAddress, MaskboxNFTABI, ethersProvider);
      const name = await contract.name();
      return name;
    },
    [ethersProvider],
  );

  const getMyTokens = useCallback(
    async (contractAddress: string) => {
      if (!ethersProvider || !utils.isAddress(contractAddress)) {
        setTokens([]);
        return [];
      }
      const contract = new Contract(contractAddress, MaskboxNFTABI, ethersProvider);
      const balance = await getMyBalance(contract);
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
      const contract = new Contract(contractAddress, MaskboxNFTABI, ethersProvider);
      const getTokens = idList.map((id) => getTokenById(contract, id));
      const list = (await Promise.all(getTokens)).filter(notEmpty);
      return list;
    },
    [ethersProvider],
  );

  const contextValue = {
    tokens,
    getName,
    getMyBalance,
    getMyToken,
    getMyTokens,
    getByIdList,
  };

  return <NFTContractContext.Provider value={contextValue}>{children}</NFTContractContext.Provider>;
});
