import { FC, Fragment } from 'react';
import { useWatchAccount } from './account';
import { useWatchChain } from './chain';

export function useAtomWatchers() {
  useWatchAccount();
  useWatchChain();
}

export const AtomWatchers: FC = ({ children }) => {
  useWatchAccount();
  useWatchChain();
  return <Fragment>{children}</Fragment>;
};
