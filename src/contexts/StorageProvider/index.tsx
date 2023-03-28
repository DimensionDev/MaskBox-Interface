import { BoxMetas, MediaType } from '@/types';
import { utils } from 'ethers';
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_MERKLE_PROOF } from '@/constants';
import { useWeb3Context } from '../Web3Context';

export interface BoxStorageNode {
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

interface IStringStorageContext {
  saveBox: <T extends { id: string }>(box: T) => Promise<void>;
  getBoxMetas: (addr: string, boxId: string | number) => Promise<BoxStorageNode | undefined>;
}

const StringStorageContext = createContext<IStringStorageContext>({
  saveBox: () => Promise.resolve(),
  getBoxMetas: () => {
    return Promise.resolve({
      id: '',
      name: '',
      mediaUrl: '',
      mediaType: MediaType.Unknown,
      activities: [],
      qualification_rss3: DEFAULT_MERKLE_PROOF,
    });
  },
});

export function useStringStorage(): IStringStorageContext {
  return useContext(StringStorageContext);
}

export function useBoxOnStorage(creator: string | undefined, boxId: string | undefined) {
  const [boxOnStorage, setBoxOnStorage] = useState<Partial<BoxMetas>>({});
  const { getBoxMetas } = useStringStorage();
  useEffect(() => {
    if (creator && boxId) {
      const checksumAddress = utils.getAddress(creator);
      getBoxMetas(checksumAddress, boxId)
        .then((data) => {
          if (data) {
            setBoxOnStorage({
              name: data.name,
              mediaType: data.mediaType as MediaType,
              mediaUrl: data.mediaUrl,
              activities: data.activities,
              whitelist: data?.whitelist,
              whitelistFileName: data?.whitelistFileName,
              qualification_rss3: data?.qualification_rss3,
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

  return boxOnStorage;
}

const endpoint = 'https://store-dev.firefly.land/api/v1/str';

export const StringStorageProvider: FC = ({ children }) => {
  const { account, ethersProvider } = useWeb3Context();

  const saveToStringStorage = useCallback(
    async (key: string, value: string, address: string) => {
      if (!key || !value || !address) return;
      const signer = ethersProvider?.getSigner();
      const signature = await signer.signMessage(value);
      if (!signature) throw new Error('signature error!');

      const response = await fetch(`${endpoint}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
          address,
          signature,
          key: `MaskBox-${key}`,
        }),
      });
      const result = await response.json();
      if (result !== 200) throw new Error(result.message);
      return;
    },
    [ethersProvider],
  );

  const getFromStringStorage = useCallback(async (key: string, address: string) => {
    if (!key || !address) return '';
    const response = await fetch(
      urlcat(`${endpoint}/get`, {
        key: `MaskBox-${key}`,
        address,
      }),
    );
    if (!response.ok) return;
    const result: { code: number; reason: string; message: string; metaData: { value: string } } =
      await response.json();

    return result.metaData.value;
  });

  const saveBox = useCallback(
    async <T extends { id: string }>(box: T) => {
      if (!account) return;
      const checksumAddress = utils.getAddress(account);
      await saveToStringStorage(box.id, JSON.stringify(box), checksumAddress);
    },
    [account, ethersProvider, saveToStringStorage],
  );

  const getBoxMetas = useCallback(async (owner: string, boxId: string | number) => {
    const checksumAddress = utils.getAddress(owner);
    const result = getFromStringStorage(boxId, owner);
    if (!result) throw new Error(`Meta info for box ${boxId} was not found`);

    return JSON.parse(result);
  }, []);

  const contextValue = {
    saveBox,
    getBoxMetas,
  };

  return (
    <StringStorageContext.Provider value={contextValue}>{children}</StringStorageContext.Provider>
  );
};
function urlcat(arg0: string, arg1: { key: string; address: string }): RequestInfo | URL {
  throw new Error('Function not implemented.');
}
