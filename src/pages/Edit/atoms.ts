import { ERC721Token, TokenType, ZERO_ADDRESS } from '@/lib';
import { Activity } from '@/types';
import { isValid as isValidDate } from 'date-fns';
import { utils } from 'ethers';
import { atom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { FormEvent } from 'react';

export interface FormData {
  name: string;
  cover: string;
  activities: Activity[];
  pricePerBox: string;
  // TODO rename to paymentTokenAddress
  tokenAddress: string;
  token: TokenType | null;
  erc721Token: ERC721Token | null;
  limit: number | null;
  nftContractAddress: string;
  sellAll: boolean;
  startAt: string;
  endAt: string;
  whiteList: string;
  selectedNFTIds: string[];
}

export const newActivity = () => ({ title: '', body: '' });

const date = new Date();
const startAt = date.toJSON().split('.')[0];
date.setDate(date.getDate() + 30);
const endAt = date.toJSON().split('.')[0];

const initFormData: FormData = {
  name: '',
  cover: 'https://ipfs.infura.io/ipfs/Qmerb9QvH5KV2JHw7vwDB3CVwDEA5gncwhPvvbA1epLxTJ',
  activities: [newActivity(), newActivity(), newActivity()],
  pricePerBox: '',
  tokenAddress: ZERO_ADDRESS,
  token: null,
  erc721Token: null,
  limit: 5,
  sellAll: true,
  nftContractAddress: '',
  startAt,
  endAt,
  whiteList: '',
  selectedNFTIds: [],
};

export const formDataAtom = atom<FormData>(initFormData);

export const descriptionFullfilledAtom = atom((get) => {
  const formData = get(formDataAtom);
  return !!formData.name && formData.cover;
});

export const metaFullfilledAtom = atom((get) => {
  const formData = get(formDataAtom);
  const sellListIsOk =
    formData.sellAll || (!formData.sellAll && formData.selectedNFTIds.length > 0);
  const datesIsOk =
    formData.startAt &&
    formData.endAt &&
    new Date(formData.endAt).getTime() > new Date(formData.startAt).getTime();
  const limitIsOk = formData.limit && formData.limit > 0;
  return (
    formData.pricePerBox && limitIsOk && formData.nftContractAddress && sellListIsOk && datesIsOk
  );
});

export const readyToCreateAtom = atom((get) => {
  const descriptionFullfilled = get(descriptionFullfilledAtom);
  const metaFullfilled = get(metaFullfilledAtom);
  return descriptionFullfilled && metaFullfilled;
});

export const validationsAtom = atom<string[]>((get) => {
  const formData = get(formDataAtom);
  const validations: string[] = [];
  if (!formData.name) validations.push('Please input mystery box name');
  if (!formData.cover) validations.push('Please provide Mystery thumbnail');
  if (!formData.pricePerBox) {
    validations.push('Please provide price for a box');
  } else if (parseFloat(formData.pricePerBox) < 0) {
    validations.push('Price box must be positive');
  }
  if (!formData.limit || formData.limit < 1)
    validations.push('Limit of purchase per wallet is at least 1');

  if (!formData.nftContractAddress) {
    validations.push('Please select a contract, fill in the contract address.');
  } else if (!utils.isAddress(formData.nftContractAddress)) {
    validations.push('NFT contract address is not valid');
  }

  if (!formData.sellAll && formData.selectedNFTIds.length < 1) {
    validations.push('Please select some NFTs');
  }

  const startDateValid = isValidDate(new Date(formData.startAt));
  if (!formData.startAt || !startDateValid) {
    validations.push('Please set a valid start date');
  }
  const endDateValid = isValidDate(new Date(formData.endAt));
  if (!formData.endAt || !endDateValid) {
    validations.push('Please set a valid end date');
  }
  if (
    startDateValid &&
    endDateValid &&
    new Date(formData.endAt).getTime() <= new Date(formData.startAt).getTime()
  ) {
    validations.push('End date should be later than start date');
  }

  return validations;
});

export function useUpdateFormField() {
  const setFormData = useUpdateAtom(formDataAtom);

  return <T extends keyof FormData>(fieldName: T, newValue: FormData[T]) => {
    setFormData((fd) => ({
      ...fd,
      [fieldName]: newValue,
    }));
  };
}

export function useBindFormField() {
  const updateField = useUpdateFormField();
  return (fieldName: keyof FormData) => {
    return (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(fieldName, evt.currentTarget.value);
    };
  };
}
