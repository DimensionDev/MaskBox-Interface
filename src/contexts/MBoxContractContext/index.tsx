import { ERC20_ABI, MysteryBoxABI } from '@/abi';
import { CollectionInfo } from '@/contracts';
import {
  DEFAULT_COLLECTION_ID,
  drawTxParameters,
  getContractAddressConfig,
  Price,
  ZERO,
  ZERO_ADDRESS,
  ZERO_PPRICE,
} from '@/lib';
import { BoxInfo } from '@/types';
import { BigNumber, Contract, ContractInterface } from 'ethers';
import noop from 'lodash-es/noop';
import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useWeb3Context } from '../Web3Context';
import { MboxState, useMbox } from './useMbox';

interface ContextOptions {
  myBalance: BigNumber;
  myAllowance: BigNumber;
  collectionInfo?: CollectionInfo;
  collectionPrice: Price;
  nftCount: number;
  collectionId: number;
  isReadyToClaim: boolean;
  approve(): Promise<boolean>;
  buy(): Promise<{ hash: string } | void>;
  setMbox: React.Dispatch<React.SetStateAction<MboxState>>;
  getCollectionInfo(): Promise<CollectionInfo | null | undefined>;
  contractAddress: string;
  getBoxInfo: (boxId: string) => Promise<BoxInfo>;
  getNftListForSale: (box: string, cursor?: BigNumber, amount?: BigNumber) => Promise<string[]>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  myBalance: ZERO,
  myAllowance: ZERO,
  isReadyToClaim: false,
  collectionPrice: ZERO_PPRICE,
  getCollectionInfo: () => Promise.resolve(null),
  approve: () => Promise.resolve(false),
  buy: () => Promise.resolve(),
  nftCount: 1,
  collectionId: DEFAULT_COLLECTION_ID,
  setMbox: noop,
  contractAddress: '',
  getBoxInfo: () => Promise.resolve({} as BoxInfo),
  getNftListForSale: () => Promise.resolve([]),
});
export const useMBoxContract = () => useContext(MBoxContractContext);

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { account, ethersProvider, providerChainId } = useWeb3Context();
  const [
    { info, price, balance, allowance, nftCount, paymentIndex, collectionId, isReadyToClaim },
    setMbox,
  ] = useMbox();

  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId)?.MysteryBox : ''),
    [providerChainId],
  );
  const contract = useRef<Contract>();
  useEffect(() => {
    if (ethersProvider && contractAddress) {
      contract.current = new Contract(
        contractAddress,
        MysteryBoxABI as unknown as ContractInterface,
        ethersProvider,
      );
    }
  }, [ethersProvider, contractAddress]);

  const getCollectionInfo = useCallback(async () => {
    if (!contract.current) return;
    try {
      const info: CollectionInfo = await contract.current.getCollectionInfo(collectionId);
      setMbox((state) => ({
        ...state,
        info,
      }));
      return info;
    } catch (collectionInfoError) {
      return null;
    }
  }, [collectionId]);

  const payment = info?._payment_list[paymentIndex];

  const fetchTransactionIninfo = useCallback(async () => {
    if (!payment || !ethersProvider || !account) return;

    if (payment.token_addr === ZERO_ADDRESS) {
      setMbox((state) => ({
        ...state,
        price: {
          isNative: true,
          value: BigNumber.from(payment.price),
          decimals: 18,
          symbol: 'eth',
        },
      }));
      ethersProvider.getBalance(account).then((balance) => {
        setMbox((state) => ({
          ...state,
          balance,
        }));
      });
    } else {
      const tokenContract = new Contract(payment.token_addr, ERC20_ABI, ethersProvider);
      Promise.all([
        tokenContract.decimals(),
        tokenContract.symbol(),
        tokenContract.allowance(account, contractAddress),
        tokenContract.balanceOf(account),
      ]).then(([decimals, tokenSymbol, allowance, balance]) => {
        setMbox((state) => ({
          ...state,
          price: {
            isNative: false,
            value: BigNumber.from(payment.price),
            decimals: decimals,
            symbol: tokenSymbol,
          },
          allowance: BigNumber.from(allowance),
          balance: BigNumber.from(balance),
        }));
      });
    }
  }, [payment, account, ethersProvider]);

  useEffect(() => {
    fetchTransactionIninfo();
  }, [fetchTransactionIninfo]);

  const approve = useCallback(async () => {
    if (!payment || !ethersProvider) return Promise.resolve(false);

    const tokenContract = new Contract(payment.token_addr, ERC20_ABI, ethersProvider.getSigner());
    const result: boolean = await tokenContract.approve(contractAddress, payment.price);
    await fetchTransactionIninfo();
    return result;
  }, [payment, ethersProvider]);

  const buy = useCallback(async () => {
    if (!payment || !ethersProvider || !contract.current) return;
    const tx = await contract.current
      .connect(ethersProvider.getSigner())
      .drawNFT(BigNumber.from(collectionId), nftCount, paymentIndex, drawTxParameters);
    await tx.wait(3);
    return tx;
  }, [payment, nftCount, ethersProvider]);

  const getBoxInfo = useCallback(
    async (boxId: string) => {
      if (!ethersProvider || !providerChainId || !contractAddress) return;
      const contract = new Contract(contractAddress, MysteryBoxABI, ethersProvider);
      const boxInfo = await contract.getBoxInfo(boxId);
      return boxInfo;
    },
    [contractAddress, providerChainId, ethersProvider],
  );

  const getNftListForSale = useCallback(
    async (boxId: string, cursor: BigNumber = ZERO, amount: BigNumber = BigNumber.from(20)) => {
      if (!ethersProvider || !providerChainId || !contractAddress) return [];
      const contract = new Contract(contractAddress, MysteryBoxABI, ethersProvider);
      const idList: BigNumber[] = await contract.getNftListForSale(boxId, cursor, amount);
      return idList.map((id) => id.toString());
    },
    [contractAddress, providerChainId, ethersProvider],
  );

  const contextValue = {
    myAllowance: allowance,
    myBalance: balance,
    collectionPrice: price,
    collectionInfo: info,
    nftCount,
    collectionId,
    isReadyToClaim,
    setMbox,
    approve,
    buy,
    getCollectionInfo,
    contractAddress,
    getBoxInfo,
    getNftListForSale,
  };

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
