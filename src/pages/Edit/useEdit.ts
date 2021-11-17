import { MaskboxNFTABI } from '@/abi';
import { useNFTContract, useWeb3Context } from '@/contexts';
import { ERC721Token } from '@/types';
import { Contract, utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useEffect, useState } from 'react';
import { formDataAtom } from './atoms';

export function useEdit() {
  const formData = useAtomValue(formDataAtom);
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const [ownedTokens, setOwnedTokens] = useState<ERC721Token[]>([]);

  const [isEnumable, setIsEnumable] = useState(true);
  useEffect(() => {
    if (!ethersProvider || !utils.isAddress(formData.nftContractAddress)) return;
    (async () => {
      try {
        const contract = new Contract(formData.nftContractAddress, MaskboxNFTABI, ethersProvider);
        await contract.tokenByIndex(0);
      } catch (err: any) {
        if (err.code === 'CALL_EXCEPTION') {
          setIsEnumable(false);
        }
        console.log('Checking if is enumable', err);
      }
    })();
  }, [ethersProvider, formData.nftContractAddress, chainId]);

  const { getMyTokens } = useNFTContract();

  useEffect(() => {
    getMyTokens(formData.nftContractAddress).then(setOwnedTokens);
  }, [formData.nftContractAddress, getMyTokens]);

  return {
    ownedTokens,
    isEnumable,
  };
}
