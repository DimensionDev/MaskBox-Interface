import { ERC721Contract, TokenType, ZERO_ADDRESS } from '@/lib';
import { Activity, MediaType } from '@/types';
import { setStorage, StorageKeys } from '@/utils';
import { format, isValid as isValidDate } from 'date-fns';
import { atom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { eq } from 'lodash-es';
import { FormEvent, useCallback, useEffect } from 'react';

export interface FormData {
  name: string;
  mediaUrl: string;
  mediaType: MediaType;
  activities: Activity[];
  pricePerBox: string;
  // TODO rename to paymentTokenAddress
  tokenAddress: string;
  token: TokenType | null;
  erc721Contract: ERC721Contract | null;
  limit: number | null;
  nftContractAddress: string;
  sellAll: boolean;
  startAt: string;
  endAt: string;
  whiteList: string;
  holderTokenAddress: string;
  holderMinTokenAmount: string;
  holderToken: TokenType | null;
  selectedNFTIds: string[];
}

export const newActivity = () => ({ title: '', body: '' });

const date = new Date();
const startAt = format(date, "yyyy-MM-dd'T'HH:mm");
date.setDate(date.getDate() + 30);
const endAt = format(date, "yyyy-MM-dd'T'HH:mm");

export const defaultFormData: FormData = {
  name: '',
  mediaUrl: '',
  mediaType: MediaType.Unknown,
  activities: [newActivity(), newActivity(), newActivity()],
  pricePerBox: '',
  tokenAddress: ZERO_ADDRESS,
  token: null,
  erc721Contract: null,
  limit: 5,
  sellAll: !true,
  nftContractAddress: '0x0c8FB5C985E00fb1D002b6B9700084492Fb4B9A8',
  startAt,
  endAt,
  whiteList: '',
  holderTokenAddress: '',
  holderMinTokenAmount: '',
  holderToken: null,
  selectedNFTIds: [],
};
export const initFormData: FormData = defaultFormData;

const fieldKeys = Object.keys(initFormData) as Array<keyof FormData>;

export const formDataAtom = atom<FormData>(initFormData);

export const isEdittingAtom = atom<boolean>(false);
export const chainAtom = atom<string | null>(null);
export const boxIdAtom = atom<string | null>(null);

export const descriptionFullfilledAtom = atom((get) => {
  const formData = get(formDataAtom);
  return !!formData.name && formData.mediaUrl;
});

export const fieldDirtyAtom = atom<Partial<Record<keyof FormData, boolean>>>({});

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

export function useSetAllDirty() {
  const setDirty = useUpdateAtom(fieldDirtyAtom);
  return useCallback(() => {
    setDirty((oldMap) => {
      const dirtyMap: Partial<Record<keyof FormData, boolean>> = {};
      fieldKeys.forEach((key) => {
        dirtyMap[key] = true;
      });
      return eq(oldMap, dirtyMap) ? oldMap : dirtyMap;
    });
  }, []);
}

export const validationsAtom = atom<string[]>((get) => {
  const formData = get(formDataAtom);
  const dirtyFileds = get(fieldDirtyAtom);
  const validations: string[] = [];
  if (!formData.name && dirtyFileds.name) validations.push('Please input mystery box name');
  if (!formData.mediaUrl && dirtyFileds.mediaUrl)
    validations.push('Please provide Mystery thumbnail');
  if (!formData.pricePerBox && dirtyFileds.pricePerBox) {
    validations.push('Please provide price for a box');
  }
  if (formData.pricePerBox && parseFloat(formData.pricePerBox) < 0) {
    validations.push('Price box must be positive');
  }
  if (dirtyFileds.limit) {
    if (!formData.limit || formData.limit < 1) {
      validations.push('Limit of purchase per wallet is at least 1');
    } else if (formData.limit > 255) {
      validations.push('Limit of purchase per wallet is up to 255');
    }
  }

  if (!formData.nftContractAddress && dirtyFileds.nftContractAddress) {
    validations.push('Please select a contract');
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
  const setDirty = useUpdateAtom(fieldDirtyAtom);

  return <T extends keyof FormData>(fieldName: T, newValue: FormData[T]) => {
    setDirty((fd) => ({
      ...fd,
      [fieldName]: true,
    }));
    setFormData((fd) => ({
      ...fd,
      [fieldName]: newValue,
    }));
  };
}

/**
 * @deprecated
 * No need anymore
 */
export function useUpdateDraft() {
  const formData = useAtomValue(formDataAtom);
  useEffect(() => {
    setStorage<FormData>(StorageKeys.BoxDraft, formData);
  }, [formData]);
}

export function useBindFormField() {
  const updateField = useUpdateFormField();
  return (fieldName: keyof FormData) => {
    return (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(fieldName, evt.currentTarget.value);
    };
  };
}

export function useResetForm() {
  const updateFormData = useUpdateAtom(formDataAtom);
  const setDirty = useUpdateAtom(fieldDirtyAtom);
  const reset = useCallback(() => {
    updateFormData(defaultFormData);
    setDirty({});
  }, []);
  return reset;
}
