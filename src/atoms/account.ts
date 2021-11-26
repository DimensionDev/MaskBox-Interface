import { useWeb3Context } from '@/contexts';
import { atom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';

export const accountAtom = atom<string | undefined>(undefined);

export function useWatchAccount() {
  const { account } = useWeb3Context();
  const updateAccount = useUpdateAtom(accountAtom);
  useEffect(() => {
    updateAccount(account);
  }, [updateAccount, account]);
}
