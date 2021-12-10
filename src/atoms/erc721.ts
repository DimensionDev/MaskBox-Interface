import { ERC721Token } from '@/types';
import { atom } from 'jotai';

type TokensMap = Record<string, ERC721Token[]>;
export const erc721TokensMapAtom = atom<TokensMap>({});
export const sellingERC721Address = atom<string | null>(null);

export const erc721TokensAtom = atom<ERC721Token[] | []>((get) => {
  const address = get(sellingERC721Address);
  const erc721TokensMap = get(erc721TokensMapAtom);
  if (!address) return [];
  return erc721TokensMap[address] ?? [];
});
