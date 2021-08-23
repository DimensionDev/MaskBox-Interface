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
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWeb3Context } from './Web3Context';

interface ContextOptions {
  estimateGas: BigNumber;
  myBalance: BigNumber;
  myAllowance: BigNumber;
  collectionInfo?: CollectionInfo;
  collectionPrice: Price;
  getCollectionInfo(): Promise<CollectionInfo | null>;
  approve(): Promise<boolean>;
  buy(): Promise<{ hash: string } | void>;
  claim(): Promise<void>;
  nftCount: number;
  setNftCount: React.Dispatch<React.SetStateAction<number>>;
  collectionId: number;
  setCollectionId: React.Dispatch<React.SetStateAction<number>>;
}

export const MBoxContractContext = React.createContext<ContextOptions>({
  estimateGas: ZERO,
  myBalance: ZERO,
  myAllowance: ZERO,
  collectionPrice: ZERO_PPRICE,
  getCollectionInfo: () => Promise.resolve(null),
  approve: () => Promise.resolve(false),
  buy: () => Promise.resolve(),
  claim: () => Promise.resolve(),
  nftCount: 1,
  setNftCount: noop,
  collectionId: DEFAULT_COLLECTION_ID,
  setCollectionId: noop,
});
export const useMBoxContract = () => useContext(MBoxContractContext);

// Rinkeby
const contractAddress = contractAddresses.Rinkeby.MysteryBox;

const mboxContract = new Contract(contractAddress, MysteryBoxABI as unknown as ContractInterface);

export const MBoxContractProvider: FC = memo(({ children }) => {
  const { account, ethersProvider } = useWeb3Context();
  const [info, setInfo] = useState<CollectionInfo>();
  const [price, setPrice] = useState<Price>(ZERO_PPRICE);
  const [balance, setBalance] = useState<BigNumber>(ZERO);
  const [allowance, setAllowance] = useState<BigNumber>(ZERO);
  const [estimateGas, setEstimateGas] = useState<BigNumber>(ZERO);
  const [nftCount, setNftCount] = useState(1);
  const [paymentIndex, setPaymentIndex] = useState(1);
  const [collectionId, setCollectionId] = useState(DEFAULT_COLLECTION_ID);

  const contract = useRef(mboxContract);
  useEffect(() => {
    if (ethersProvider) {
      contract.current = contract.current.connect(ethersProvider);
    }
  }, [ethersProvider]);

  const getCollectionInfo = useCallback(async () => {
    const info: CollectionInfo = await contract.current
      .getCollectionInfo(collectionId)
      .then((cinfo: CollectionInfo) => {
        setInfo(cinfo);
        return cinfo;
      })
      .catch((collectionInfoError: Error) => console.error({ collectionInfoError }));
    return info;
  }, [collectionId]);

  const payment = info?._payment_list[paymentIndex];
  console.log('payment from list', payment);

  const fetchTransactionIninfo = useCallback(async () => {
    if (!payment || !ethersProvider || !account) return;

    if (payment.token_addr === ZERO_ADDRESS) {
      setPrice({
        isNative: true,
        value: BigNumber.from(payment.price),
        decimals: 18,
        symbol: 'eth',
      });
      ethersProvider.getBalance(account).then((v) => {
        setBalance(v);
      });
    } else {
      const tokenContract = new Contract(payment.token_addr, ERC20_ABI, ethersProvider);
      Promise.all([
        tokenContract.decimals(),
        tokenContract.symbol(),
        tokenContract.allowance(account, contractAddress),
        tokenContract.balanceOf(account),
      ]).then(([decimals, tokenSymbol, allowance, balance]) => {
        setPrice({
          isNative: false,
          value: BigNumber.from(payment.price),
          decimals: decimals,
          symbol: tokenSymbol,
        });
        setAllowance(BigNumber.from(allowance));
        setBalance(BigNumber.from(balance));
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

  const contextValue = useMemo(
    () => ({
      estimateGas,
      myAllowance: allowance,
      myBalance: balance,
      collectionPrice: price,
      collectionInfo: info,
      getCollectionInfo,
      approve,
      buy,
      claim,
      nftCount,
      setNftCount,
      collectionId,
      setCollectionId,
    }),
    [
      estimateGas,
      allowance,
      balance,
      price,
      info,
      getCollectionInfo,
      approve,
      buy,
      claim,
      nftCount,
      collectionId,
      setCollectionId,
    ],
  );

  return (
    <MBoxContractContext.Provider value={contextValue}>{children}</MBoxContractContext.Provider>
  );
});
