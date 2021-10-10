import { MysterBoxNFTABI } from '@/abi';
import { useNFTContract, useWeb3Context } from '@/contexts';
import { getContractAddressConfig } from '@/lib';
import { ERC721Token } from '@/types';
import { Contract, utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formDataAtom } from './atoms';

export function useEdit() {
  const formData = useAtomValue(formDataAtom);
  const [isApproveAll, setIsApproveAll] = useState(false);
  const { account, ethersProvider, providerChainId } = useWeb3Context();
  const [ownedTokens, setOwnedTokens] = useState<ERC721Token[]>([]);
  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId).MysteryBox : ''),
    [providerChainId],
  );

  const checkIsApproveAll = useCallback(async () => {
    if (!ethersProvider || !account || !providerChainId) return;
    setIsApproveAll(false);
    if (!utils.isAddress(formData.nftContractAddress)) return;

    const contract = new Contract(formData.nftContractAddress, MysterBoxNFTABI, ethersProvider);
    const result = await contract.isApprovedForAll(account, contractAddress);
    setIsApproveAll(result as boolean);
  }, [account, formData.nftContractAddress]);

  useEffect(() => {
    checkIsApproveAll();
  }, [checkIsApproveAll]);

  const { getMyTokens } = useNFTContract();

  useEffect(() => {
    getMyTokens(formData.nftContractAddress).then((tokens) => {
      console.log({ tokens });
      setOwnedTokens(tokens);
    });
  }, [formData.nftContractAddress, getMyTokens]);

  const approveAll = useCallback(async () => {
    if (!ethersProvider || !formData.nftContractAddress) return;
    const contract = new Contract(
      formData.nftContractAddress,
      MysterBoxNFTABI,
      ethersProvider.getSigner(),
    );
    await contract.setApprovalForAll(contractAddress, true);
    checkIsApproveAll();
  }, [ethersProvider, formData.nftContractAddress, checkIsApproveAll]);

  return {
    isApproveAll,
    approveAll,
    ownedTokens,
  };
}
