import { showToast } from '@/components';
import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getRPCUrl, logError } from '@/lib';

interface ContextOptions {
  providerChainId: number;
  ethersProvider: ethers.providers.Web3Provider;
  account: string;
  connectWeb3: () => Promise<void>;
  disconnect: () => void;
}

export const Web3Context = React.createContext<Partial<ContextOptions>>({});
export const useWeb3Context = () => useContext(Web3Context);

const rpc = {
  1: getRPCUrl(1),
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: { rpc },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

const clearWCStorage = () => {
  localStorage.removeItem('walletconnect');
};

type Provider =
  | WalletConnectProvider
  | {
      chainId: string;
      isMetaMask?: boolean;
      send: (
        payload: Record<string, unknown>,
        callback: (err: Error | null, response: Record<string, unknown>) => void,
      ) => void;
      sendAsync: (
        payload: Record<string, unknown>,
        callback: (err: Error | null, response: Record<string, unknown>) => void,
      ) => void;
    };

interface Web3State extends Omit<ContextOptions, 'connectWeb3' | 'disconnect'> {}

export const Web3Provider: FC = ({ children }) => {
  const [{ providerChainId, ethersProvider, account }, setWeb3State] = useState<Partial<Web3State>>(
    {},
  );

  const setWeb3Provider = useCallback(
    async (prov: Provider) => {
      try {
        const provider = new ethers.providers.Web3Provider(prov);
        const chainId = Number(prov.chainId as string);
        if (!account) {
          const signer = provider.getSigner();
          setWeb3State({
            account: await signer.getAddress(),
            ethersProvider: provider,
            providerChainId: chainId,
          });
        } else {
          setWeb3State((state) => ({
            ...state,
            ethersProvider: provider,
            providerChainId: chainId,
          }));
        }
      } catch (err: any) {
        showToast({
          variant: 'error',
          title: 'Fails to set provider',
          message: err.message,
        });
      }
    },
    [account],
  );

  const disconnect = useCallback(() => {
    web3Modal.clearCachedProvider();
    clearWCStorage();
    setWeb3State({});
  }, [setWeb3State]);

  const connectWeb3 = useCallback(async () => {
    try {
      const modalProvider = await web3Modal.requestProvider();

      await setWeb3Provider(modalProvider);

      const gnosisSafe = await web3Modal.isSafeApp();

      if (!gnosisSafe) {
        modalProvider.on('accountsChanged', (accounts: string[]) => {
          setWeb3State((state) => ({
            ...state,
            account: accounts[0],
          }));
        });
        modalProvider.on('chainChanged', () => {
          setWeb3Provider(modalProvider);
        });
      }
      if (modalProvider.isWalletConnect) {
        modalProvider.on('disconnect', disconnect);
      }
    } catch (error) {
      logError({ web3ModalError: error });
    }
  }, [setWeb3Provider, disconnect]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    (async () => {
      if ((await web3Modal.isSafeApp()) || web3Modal.cachedProvider) {
        connectWeb3();
      }
    })();
  }, [connectWeb3]);

  const value = useMemo(
    () => ({
      connectWeb3,
      disconnect,
      account,
      ethersProvider,
      providerChainId,
    }),
    [connectWeb3, disconnect, account, ethersProvider, providerChainId],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
