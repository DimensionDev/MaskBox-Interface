import { showToast, useDialog } from '@/components';
import { ChainId, isSupportedChain, logError } from '@/lib';
import { getStorage, StorageKeys, useStorage } from '@/utils';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { connectableWallets, ConnectDialog } from './ConnectDialog';
import getProvider from './providers';

interface ContextOptions {
  providerChainId: number;
  ethersProvider: ethers.providers.Web3Provider;
  account: string;
  openConnectionDialog: () => void;
  closeConnectionDialog: () => void;
  disconnect: () => void;
  isMetaMask: boolean;
  isConnecting: boolean;
  isNotSupportedChain: boolean;
}

export const Web3Context = React.createContext<Partial<ContextOptions>>({});
export const useWeb3Context = () => useContext(Web3Context);

const clearWCStorage = () => {
  localStorage.removeItem('walletconnect');
};

type Provider =
  | WalletConnectProvider
  | {
      chainId: string;
      isMetaMask?: boolean;
      selectedAddress: null | string;
      send: (
        payload: Record<string, unknown>,
        callback: (err: Error | null, response: Record<string, unknown>) => void,
      ) => void;
      sendAsync: (
        payload: Record<string, unknown>,
        callback: (err: Error | null, response: Record<string, unknown>) => void,
      ) => void;
    };

interface Web3State extends Omit<ContextOptions, 'disconnect'> {}

export const Web3Provider: FC = ({ children }) => {
  const [storedChainId, setStoredChainId, removeStoredChainId] = useStorage<ChainId>(
    StorageKeys.ChainId,
  );
  const [storedWalletId, setStoredWalletId, removeStoredWalletId] = useStorage<string>(
    StorageKeys.WalletId,
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [{ providerChainId, ethersProvider, account }, setWeb3State] = useState<Partial<Web3State>>(
    {},
  );
  const [dialogVisible, openConnectionDialog, closeConnectionDialog] = useDialog();

  const setWeb3Provider = useCallback(
    async (prov: Provider) => {
      try {
        if (!prov.selectedAddress) return;
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
    clearWCStorage();
    setWeb3State({});
    removeStoredChainId();
    removeStoredWalletId();
  }, []);

  const connectWeb3 = useCallback(
    async (chainId: ChainId, walletType: string) => {
      try {
        setIsConnecting(true);
        const provider = await getProvider(walletType);
        if (chainId !== parseInt(provider.chainId as string, 16)) {
          await provider.request!({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
              },
            ],
          });
        }
        await setWeb3Provider(provider);

        const updateWeb3Provider = () => setWeb3Provider(provider);
        provider.on('accountsChanged', updateWeb3Provider);
        provider.on('chainChanged', updateWeb3Provider);
        provider.on('disconnect', disconnect);
      } catch (error: any) {
        logError({ web3ModalError: error });
      } finally {
        setIsConnecting(false);
      }
    },
    [setWeb3Provider, disconnect],
  );

  useEffect(() => {
    const walletId = getStorage<string>(StorageKeys.WalletId);
    (async () => {
      const walletType = connectableWallets.find((w) => w.id === walletId)?.type;
      if (walletId && walletType) {
        const provider = await getProvider(walletType);
        if (provider) {
          connectWeb3(parseInt(provider.chainId, 16), walletType);
        }
      }
    })();
  }, [connectWeb3]);

  const value = useMemo(() => {
    const isNotSupportedChain = providerChainId !== undefined && !isSupportedChain(providerChainId);
    return {
      openConnectionDialog,
      closeConnectionDialog,
      disconnect,
      account,
      ethersProvider,
      providerChainId,
      isMetaMask: !!ethersProvider?.provider?.isMetaMask,
      isConnecting,
      isNotSupportedChain,
    };
  }, [disconnect, account, ethersProvider, providerChainId, isConnecting]);

  return (
    <Web3Context.Provider value={value}>
      {children}
      <ConnectDialog
        open={dialogVisible}
        onClose={closeConnectionDialog}
        chainId={storedChainId ?? undefined}
        walletId={storedWalletId ?? undefined}
        onSelect={({ chainId, walletId, walletType }) => {
          setWeb3State((state) => ({
            ...state,
            providerChainId: chainId,
          }));
          setStoredChainId(chainId);
          setStoredWalletId(walletId);
          connectWeb3(chainId, walletType);
          closeConnectionDialog();
        }}
      />
    </Web3Context.Provider>
  );
};
