import { ERC20_ABI, MysteryBoxABI } from '@/abi';
import { CollectionInfo } from '@/contracts';
import {
  contractAddresses,
  DEFAULT_COLLECTION_ID,
  drawTxParameters,
  Price,
  ZERO,
  ZERO_ADDRESS,
  ZERO_PPRICE,
} from '@/lib';
import { BigNumber, Contract, ContractInterface } from 'ethers';
import noop from 'lodash-es/noop';
import React, { FC, memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useWeb3Context } from '../Web3Context';
import { MboxState, useMbox } from './useMbox';

interface ContextOptions {
  myBalance: BigNumber;
  myAllowance: BigNumber;
  collectionInfo?: CollectionInfo;
  collectionPrice: Price;
  nftCount: number;
  collectionId: number;
  approve(): Promise<boolean>;
  buy(): Promise<{ hash: string } | void>;
  claim(): Promise<void>;
  setMbox: React.Dispatch<React.SetStateAction<MboxState>>;
  getCollectionInfo(): Promise<CollectionInfo | null>;
  checkIsReadyToClaim(): Promise<void>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  myBalance: ZERO,
  myAllowance: ZERO,
  collectionPrice: ZERO_PPRICE,
  getCollectionInfo: () => Promise.resolve(null),
  approve: () => Promise.resolve(false),
  buy: () => Promise.resolve(),
  claim: () => Promise.resolve(),
  nftCount: 1,
  collectionId: DEFAULT_COLLECTION_ID,
  setMbox: noop,
  checkIsReadyToClaim: () => Promise.resolve(),
});
export const useMBoxContract = () => useContext(MBoxContractContext);

// Rinkeby
const contractAddress = contractAddresses.Rinkeby.MysteryBox;

const mboxContract = new Contract(contractAddress, MysteryBoxABI as unknown as ContractInterface);

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { account, ethersProvider } = useWeb3Context();
  const [
    { info, price, balance, allowance, nftCount, paymentIndex, collectionId, isReadyToClaim },
    setMbox,
  ] = useMbox();

  const contract = useRef(mboxContract);
  useEffect(() => {
    if (ethersProvider) {
      contract.current = contract.current.connect(ethersProvider);
    }
  }, [ethersProvider]);

  const checkIsReadyToClaim = useCallback(async () => {
    if (!account) return;
    const result = await contract.current.isReadyToClaim(collectionId, account);
    setMbox((state) => ({
      ...state,
      isReadyToClaim: result,
    }));

    return result;
  }, [collectionId, account]);

  const getCollectionInfo = useCallback(async () => {
    try {
      const info: CollectionInfo = await contract.current.getCollectionInfo(collectionId);
      setMbox((state) => ({
        ...state,
        info,
      }));
      return info;
    } catch (collectionInfoError) {
      console.error({ collectionInfoError });
      return null;
    }
  }, [collectionId]);

  const payment = info?._payment_list[paymentIndex];
  console.log('payment from list', payment);

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

    const abi = ['function approve(address, uint256) returns (boolean)'];
    const tokenContract = new Contract(payment.token_addr, abi, ethersProvider.getSigner());
    const result: boolean = await tokenContract.approve(contractAddress, payment.price);
    await fetchTransactionIninfo();
    return result;
  }, [payment, ethersProvider]);

  const buy = useCallback(async () => {
    if (!payment || !ethersProvider) return;
    const tx = await mboxContract
      .connect(ethersProvider.getSigner())
      .drawNFT(BigNumber.from(collectionId), nftCount, paymentIndex, drawTxParameters);
    await tx.wait(3);
    return tx;
  }, [payment, nftCount, ethersProvider]);

  const claim = useCallback(async () => {
    if (!ethersProvider || !account) return;
    const ready = await mboxContract.connect(ethersProvider).isReadyToClaim(collectionId, account);
    console.log('isReadyToClaim', ready);
    const result = await mboxContract.connect(ethersProvider.getSigner()).claimNFT(collectionId);
    return result;
  }, [account, collectionId, ethersProvider]);

  const contextValue = {
    myAllowance: allowance,
    myBalance: balance,
    collectionPrice: price,
    collectionInfo: info,
    claim,
    nftCount,
    collectionId,
    isReadyToClaim,
    setMbox,
    approve,
    buy,
    checkIsReadyToClaim,
    getCollectionInfo,
  };

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
