import { MysterBoxNFTABI } from '@/abi';
import { contractAddresses } from '@/lib';
import { BigNumber, Contract, ContractInterface } from 'ethers';
import React, { FC, memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  tokens: any[];
  getMyBalance(): Promise<number>;
  getMyToken(index: BigNumber): Promise<string | null>;
  getMyTokens(): Promise<any[]>;
}

export const NFTContractContext = React.createContext<ContextOptions>({
  getMyBalance: () => Promise.resolve(0),
  tokens: [],
  getMyToken: () => Promise.resolve(null),
  getMyTokens: () => Promise.resolve([]),
});
export const useNFTContract = () => useContext(NFTContractContext);

// Rinkeby
const contractAddress = contractAddresses.Rinkeby.MysteryBoxNFT;
const nftContract = new Contract(contractAddress, MysterBoxNFTABI as unknown as ContractInterface);

export const NFTContractProvider: FC = memo(({ children }) => {
  const { ethersProvider, account } = useWeb3Context();
  const [tokens, setTokens] = useState<any[]>([]);

  const contract = useRef(nftContract);

  useEffect(() => {
    if (ethersProvider) {
      contract.current = nftContract.connect(ethersProvider);
    }
  }, [ethersProvider]);

  const getMyBalance = useCallback(async () => {
    if (!account) return 0;

    const balance = await contract.current
      .balanceOf(account)
      .catch((getMyBalanceError: Error) => console.error({ getMyBalanceError }));

    console.log('balance', balance);
    return (balance as BigNumber).toNumber();
  }, [account]);

  const getMyToken = useCallback(
    async (index: BigNumber) => {
      const tokenId = await contract.current
        .tokenOfOwnerByIndex(account, index)
        .catch((getMyTokenError: Error) => console.error({ getMyTokenError }));
      const uri = await contract.current.tokenURI(tokenId);
      console.log('tokenURI', uri);
      return uri;
    },
    [account],
  );

  const getMyTokens = useCallback(async () => {
    const balance = await getMyBalance();
    console.log('balance', balance);
    const getTokens = new Array(balance)
      .fill(0)
      .map((_, index) => getMyToken(BigNumber.from(index)));
    const list = await Promise.all(getTokens);
    setTokens(list);
    return list;
  }, [getMyBalance, getMyToken]);

  const contextValue = {
    tokens,
    getMyTokens,
    getMyBalance,
    getMyToken,
  };

  return <NFTContractContext.Provider value={contextValue}>{children}</NFTContractContext.Provider>;
});
