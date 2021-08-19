import { MysterBoxNFTABI } from '@/abi';
import { BigNumber, Contract, ContractInterface } from 'ethers';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { FC } from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  tokens: any[];
  getMyBalance(): Promise<BigNumber>;
  getMyToken(index: BigNumber): Promise<string | null>;
  getMyTokens(): Promise<any[]>;
}

export const NFTContractContext = React.createContext<ContextOptions>({
  getMyBalance: () => Promise.resolve(BigNumber.from(0)),
  tokens: [],
  getMyToken: () => Promise.resolve(null),
  getMyTokens: () => Promise.resolve([]),
});
export const useNFTContract = () => useContext(NFTContractContext);

// Rinkeby
const contractAddress = '0x0Ba0dda8F21165672d711D939ca162ec97Ef178d';

export const NFTContractProvider: FC = memo(({ children }) => {
  const { ethersProvider, account } = useWeb3Context();
  const [tokens, setTokens] = useState<any[]>([]);
  const contract = useMemo(
    () =>
      new Contract(
        contractAddress,
        MysterBoxNFTABI as unknown as ContractInterface,
        ethersProvider,
      ),
    [ethersProvider],
  );

  const getMyBalance = useCallback(async () => {
    const balance = await contract
      .balanceOf(account)
      .catch((getMyBalanceError: Error) => console.error({ getMyBalanceError }));

    console.log('balance', balance);
    return balance;
  }, [account, contract]);

  const getMyToken = useCallback(
    async (index: BigNumber) => {
      const tokenId = await contract
        .tokenOfOwnerByIndex(account, index)
        .catch((getMyTokenError: Error) => console.error({ getMyTokenError }));
      const uri = await contract.tokenURI(tokenId);
      console.log('tokenURI', uri);
      return uri;
    },
    [account, contract],
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
  }, []);

  const contextValue = useMemo(
    () => ({
      tokens,
      getMyTokens,
      getMyBalance,
      getMyToken,
    }),
    [tokens, getMyBalance, getMyToken, getMyTokens],
  );

  return <NFTContractContext.Provider value={contextValue}>{children}</NFTContractContext.Provider>;
});
