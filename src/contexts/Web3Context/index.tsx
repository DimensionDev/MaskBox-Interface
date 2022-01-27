import { showToast } from '@/components';
import { ChainId, getJSONRPCUrl, isSupportedChain } from '@/lib';
import { getStorage, StorageKeys, useBoolean, useStorage } from '@/utils';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isMobile as checkIsMobile } from 'web3modal';
import { AccountDialog } from './AccountDialog';
import { connectableWallets, ConnectDialog } from './ConnectDialog';
import getProvider, { ProviderType } from './providers';

export * from './providers';

type Web3Provider = ethers.providers.Web3Provider;
type JsonRpcProvider = ethers.providers.JsonRpcProvider;

interface ContextOptions {
  /** TODO rename to chainId */
  providerChainId: number;
  /** TODO rename to provider */
  ethersProvider: Web3Provider | JsonRpcProvider;
  account: string;
  openConnectionDialog: () => void;
  closeConnectionDialog: () => void;
  openAccountDialog: () => void;
  closeAccountDialog: () => void;
  disconnect: () => void;
  connectWeb3: (chainId?: ChainId, providerType?: ProviderType) => Promise<void>;
  isMetaMask: boolean;
  isConnecting: boolean;
  isNotSupportedChain: boolean;
}

const isMobile = checkIsMobile();

export const Web3Context = React.createContext<Partial<ContextOptions>>({});
export const useWeb3Context = () => useContext(Web3Context);

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
  const [accountDialogVisible, setAccountDialogVisible] = useState(false);
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
  const [dialogVisible, openConnectionDialog, closeConnectionDialog] = useBoolean();

  const setWeb3Provider = useCallback(
    async (prov: Provider) => {
      try {
        if (!prov) return;
        const provider = new ethers.providers.Web3Provider(prov);
        const accounts: string[] = await provider.send('eth_accounts', []);
        if (accounts.length === 0) return;
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

  const setDefaultProvider = useCallback(() => {
    const provider = new ethers.providers.JsonRpcProvider(getJSONRPCUrl());
    setWeb3State((state) => ({
      ...state,
      ethersProvider: provider,
      providerChainId: ChainId.Mainnet as number,
    }));
  }, []);

  const disconnect = useCallback(() => {
    setWeb3State({});
    removeStoredChainId();
    removeStoredWalletId();
  }, []);

  const connectWeb3 = useCallback(
    async (chainId?: ChainId, walletType?: ProviderType) => {
      try {
        setIsConnecting(true);
        const provider = await getProvider(isMobile ? undefined : walletType);
        if (chainId && chainId !== parseInt(provider.chainId as string, 16)) {
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
      } else {
        setDefaultProvider();
      }
    })();
  }, [connectWeb3, setDefaultProvider]);

  const openAccountDialog = useCallback(() => {
    setAccountDialogVisible(true);
  }, []);
  const closeAccountDialog = useCallback(() => {
    setAccountDialogVisible(false);
  }, []);

  const value = useMemo(() => {
    const isNotSupportedChain = providerChainId !== undefined && !isSupportedChain(providerChainId);
    return {
      openConnectionDialog,
      closeConnectionDialog,
      openAccountDialog,
      closeAccountDialog,
      disconnect,
      account,
      ethersProvider,
      providerChainId,
      connectWeb3,
      isMetaMask: !!(ethersProvider as Web3Provider)?.provider?.isMetaMask,
      isConnecting,
      isNotSupportedChain,
    };
  }, [
    disconnect,
    account,
    ethersProvider,
    connectWeb3,
    providerChainId,
    isConnecting,
    openAccountDialog,
    closeAccountDialog,
  ]);

  return (
    <Web3Context.Provider value={value}>
      {children}
      <ConnectDialog
        open={dialogVisible}
        onClose={closeConnectionDialog}
        chainId={storedChainId ?? ChainId.Mainnet}
        walletId={storedWalletId ?? undefined}
        onSelect={({ chainId, walletId }) => {
          setWeb3State((state) => ({
            ...state,
            providerChainId: chainId,
          }));
          const walletType = connectableWallets.find((w) => w.id === walletId)?.type;
          connectWeb3(chainId, walletType).then(() => {
            setStoredChainId(chainId);
            setStoredWalletId(walletId);
          });
          closeConnectionDialog();
        }}
      />
      <AccountDialog open={accountDialogVisible} onClose={closeAccountDialog} />
    </Web3Context.Provider>
  );
};
