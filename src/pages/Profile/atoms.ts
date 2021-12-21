import { atom } from 'jotai';

interface Collectible {
  name: string;
  logo?: string;
}
export const maskboxCollectiblesAtom = atom<Collectible[]>([]);
