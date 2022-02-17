import { BoxMetas, MediaType } from '@/types';
import { utils } from 'ethers';
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import RSS3 from 'rss3-next';
import { useWeb3Context } from '../Web3Context';

export interface BoxRSS3Node {
  id: string;
  name: string;
  mediaUrl: string;
  mediaType: MediaType;
  activities: {
    title: string;
    body: string;
  }[];
  whitelistFileName?: string;
  whitelist?: string;
  qualification_rss3: string;
}

interface IRSS3Context {
  createRSS3: () => Promise<RSS3 | null>;
  saveBox: <T extends { id: string }>(box: T) => Promise<void>;
  getBoxMetas: (addr: string, boxId: string | number) => Promise<BoxRSS3Node | undefined>;
}

const RSS3Context = createContext<IRSS3Context>({
  createRSS3: () => Promise.resolve(null),
  saveBox: () => Promise.resolve(),
  getBoxMetas: () => {
    return Promise.resolve({
      id: '',
      name: '',
      mediaUrl: '',
      mediaType: MediaType.Unknown,
      activities: [],
    });
  },
});

export function useRSS3(): IRSS3Context {
  return useContext(RSS3Context);
}

export function useBoxOnRSS3(creator: string | undefined, boxId: string | undefined) {
  const [boxOnRSS3, setBoxOnRSS3] = useState<Partial<BoxMetas>>({});
  const { getBoxMetas } = useRSS3();
  useEffect(() => {
    if (creator && boxId) {
      const checksumAddress = utils.getAddress(creator);
      getBoxMetas(checksumAddress, boxId)
        .then((data) => {
          if (data) {
            setBoxOnRSS3({
              name: data.name,
              mediaType: data.mediaType as MediaType,
              mediaUrl: data.mediaUrl,
              activities: data.activities,
              whitelist: data?.whitelist,
              whitelistFileName: data?.whitelistFileName,
            });
          } else {
            throw new Error(`Meta info was not found`);
          }
        })
        .catch((err) => {
          console.log('Fails at getting box info', err);
        });
    }
  }, [creator, boxId]);

  return boxOnRSS3;
}

const endpoint = 'https://hub.pass3.me';

export const RSS3Provider: FC = ({ children }) => {
  const { account, ethersProvider } = useWeb3Context();

  const createRSS3 = useCallback(
    async (address?: string) => {
      const signer = ethersProvider?.getSigner();
      return address
        ? new RSS3({
            endpoint,
            address: utils.getAddress(address),
            sign: async (message: string) => {
              return signer?.signMessage(message) ?? '';
            },
          })
        : new RSS3({
            endpoint,
          });
    },
    [ethersProvider],
  );

  const saveBox = useCallback(
    async <T extends { id: string }>(box: T) => {
      if (!account) return;
      const checksumAddress = utils.getAddress(account);
      const rss3 = await createRSS3(checksumAddress);
      if (!rss3) return;
      const file = await rss3.files.get(checksumAddress);
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
    async (owner: string, boxId: string | number) => {
      const checksumAddress = utils.getAddress(owner);
      const rss3 = await createRSS3(checksumAddress);
      const file = await rss3.files.get(checksumAddress);
      const nft = Object.getOwnPropertyDescriptor(file, '_box');
      if (!nft?.value?.[boxId]) {
        throw new Error(`Meta info for box ${boxId} was not found`);
      }
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
