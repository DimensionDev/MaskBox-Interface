import { useWeb3Context } from '@/contexts';
import { Transaction, TransactionStatus } from '@/types';
import { getStorage, setStorage, StorageKeys } from '@/utils';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { chainAtom } from './chain';
import { accountAtom } from './account';

const STORAGE_KEY = StorageKeys.RecentTransations;

type StoredTransactionMap = Record<string, Transaction[]>;

const initialStoredTxesMap = getStorage<Transaction[]>(STORAGE_KEY) ?? {};

export const transactionsMapAtom = atom<StoredTransactionMap>(initialStoredTxesMap);

type Update = Transaction[] | ((txes: Transaction[]) => Transaction[]);

const keyAtom = atom<string | null>((get) => {
  const chainId = get(chainAtom);
  const account = get(accountAtom);
  if (!chainId || !account) return null;
  return `${chainId}/${account}`;
});

export const recentTransactionsAtom = atom<Transaction[], Update>(
  (get) => {
    const key = get(keyAtom);
    if (!key) return [];
    const txesMap = get(transactionsMapAtom);
    return txesMap[key] ?? [];
  },
  (get, set, update) => {
    const key = get(keyAtom);
    if (!key) return;
    const txesMap = get(transactionsMapAtom);
    const updatedTxes = typeof update === 'function' ? update(txesMap[key] ?? []) : update;
    const updatedMap = {
      ...txesMap,
      [key]: updatedTxes,
    };
    set(transactionsMapAtom, updatedMap);
    setStorage<StoredTransactionMap>(STORAGE_KEY, updatedMap);
  },
);

export const useRecentTransactions = () => {
  const [transactions, setTxes] = useAtom(recentTransactionsAtom);
  const updateTransactions = useCallback(
    (txes: Transaction[]) => {
      setStorage(STORAGE_KEY, txes);
      setTxes(txes);
    },
    [setTxes],
  );
  const { ethersProvider } = useWeb3Context();

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
  const pendingTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === TransactionStatus.Pending),
    [transactions],
  );

  useEffect(() => {
    if (!ethersProvider) return;
    const onBlockMined = () => {
      pendingTransactions.map(async (tx) => {
        const transaction = await ethersProvider.getTransactionReceipt(tx.txHash);
        if (transaction && transaction.status !== undefined) {
          updateTransactionBy({
            txHash: tx.txHash,
            status: transaction.status,
          });
        }
      });
    };
    ethersProvider.on('block', onBlockMined);
    return () => {
      ethersProvider.off('block', onBlockMined);
    };
  }, [ethersProvider, pendingTransactions]);

  const addTransaction = useCallback(
    (tx: Transaction) => {
      setTxes((txes) => uniqBy([tx, ...txes], 'txHash'));
    },
    [setTxes],
  );

  const updateTransactionBy = useCallback(
    (newTx: Partial<Transaction> & Pick<Transaction, 'txHash'>) => {
      setTxes((txes) => {
        return txes.map((tx) => (tx.txHash === newTx.txHash ? { ...tx, ...newTx } : tx));
      });
    },
    [setTxes],
  );

  const clearTransactions = useCallback(() => {
    updateTransactions([]);
  }, [updateTransactions]);

  return {
    transactions,
    recentTransactions,
    updateTransactions,
    addTransaction,
    updateTransactionBy,
    clearTransactions,
  };
};

export const useUpdateRecentTransactions = (txes: Transaction[]) => {
  const updateTxes = useUpdateAtom(recentTransactionsAtom);
  setStorage(STORAGE_KEY, txes);
  updateTxes(txes);
};
