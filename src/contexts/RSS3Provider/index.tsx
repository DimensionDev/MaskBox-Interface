import { createContext, FC, useCallback, useContext, useEffect, useRef } from 'react';
import RSS3 from 'rss3-next';
import { useWeb3Context } from '../Web3Context';

interface BoxRSS3Node {
  id: string;
  name: string;
  cover: string;
  activities: {
    title: string;
    body: string;
  }[];
}

interface IRSS3Context {
  createRSS3: () => Promise<RSS3 | null>;
  saveBox: <T extends { id: string }>(box: T) => Promise<void>;
  getBoxMetas: (addr: string, boxId: string) => Promise<BoxRSS3Node | undefined>;
}

const RSS3Context = createContext<IRSS3Context>({
  createRSS3: () => Promise.resolve(null),
  saveBox: () => Promise.resolve(),
  getBoxMetas: () => {
    return Promise.resolve({ id: '', name: '', cover: '', activities: [] });
  },
});

export function useRSS3(): IRSS3Context {
  return useContext(RSS3Context);
}

const endpoint = 'https://hub.pass3.me';

export const RSS3Provider: FC = ({ children }) => {
  const { account, ethersProvider } = useWeb3Context();
  type JsonRpcSigner = ReturnType<NonNullable<typeof ethersProvider>['getSigner']>;
  const signerRef = useRef<JsonRpcSigner>();
  useEffect(() => {
    if (!ethersProvider) return;
    signerRef.current = ethersProvider.getSigner();
  }, [ethersProvider]);

  const createRSS3 = useCallback(
    async (address?: string) => {
      return address
        ? new RSS3({
            endpoint,
            address,
            sign: async (message: string) => {
              return signerRef.current?.signMessage(message) ?? '';
            },
          })
        : new RSS3({
            endpoint,
          });
    },
    [account],
  );

  const saveBox = useCallback(
    async <T extends { id: string }>(box: T) => {
      if (!account) return;
      const rss3 = await createRSS3(account);
      if (!rss3) return;
      const file = await rss3.files.get(account);
      if (!file) throw new Error('The account was not found.');
      rss3.files.set({
        ...file,
        // @ts-ignore
        _box: {
          ...(file._box ?? {}),
          [box.id]: box,
        },
      });
      await rss3.files.sync();
    },
    [account, createRSS3, ethersProvider],
  );

  const getBoxMetas = useCallback(
    async (owner: string, boxId: string) => {
      const rss3 = await createRSS3(owner);
      const file = await rss3.files.get(owner);
      const nft = Object.getOwnPropertyDescriptor(file, '_box');
      if (!nft?.value) return;
      const data = nft.value[boxId] as BoxRSS3Node;

      return data;
    },
    [createRSS3],
  );

  const contextValue = {
    createRSS3,
    saveBox,
    getBoxMetas,
  };

  return <RSS3Context.Provider value={contextValue}>{children}</RSS3Context.Provider>;
};
