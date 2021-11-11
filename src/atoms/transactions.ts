import { useWeb3Context } from '@/contexts';
import { Transaction, TransactionStatus } from '@/types';
import { getStorage, setStorage, StorageKeys } from '@/utils';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';

const STORAGE_KEY = StorageKeys.RecentTransations;
const initialStoredTxes = getStorage<Transaction[]>(STORAGE_KEY) ?? [];
export const recentTransactionsAtom = atom<Transaction[]>(initialStoredTxes);

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

  const pendingTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === TransactionStatus.Pending),
    [transactions],
  );

  console.log('transactions', { ethersProvider });
  useEffect(() => {
    if (!ethersProvider) return;
    const onBlockMined = () => {
      pendingTransactions.map(async (tx) => {
        const transaction = await ethersProvider.getTransactionReceipt(tx.txHash);
        if (transaction.status !== undefined) {
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
      setTxes((txes) => {
        const newTxes = uniqBy([tx, ...txes.slice(0, 4)], 'txHash');
        console.log({ newTxes });
        setStorage(STORAGE_KEY, newTxes);
        return newTxes;
      });
    },
    [setTxes],
  );

  const updateTransactionBy = useCallback(
    (newTx: Partial<Transaction> & Pick<Transaction, 'txHash'>) => {
      setTxes((txes) => {
        return txes.map((t) => {
          return t.txHash === newTx.txHash
            ? {
                ...t,
                ...newTx,
              }
            : t;
        });
      });
    },
    [setTxes],
  );

  const clearTransactions = useCallback(() => {
    updateTransactions([]);
  }, [updateTransactions]);

  return {
    transactions,
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
