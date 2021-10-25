import { MysterBoxNFTABI } from '@/abi';
import { showToast } from '@/components';
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
  const [checkingApprove, setCheckingApprove] = useState(false);
  const { account, ethersProvider, providerChainId } = useWeb3Context();
  const [ownedTokens, setOwnedTokens] = useState<ERC721Token[]>([]);
  const contractAddress = useMemo(
    () => (providerChainId ? getContractAddressConfig(providerChainId)?.MysteryBox : ''),
    [providerChainId],
  );

  const checkIsApproveAll = useCallback(async () => {
    if (!ethersProvider || !account || !providerChainId) return;
    setIsApproveAll(false);
    if (!utils.isAddress(formData.nftContractAddress)) return;

    setCheckingApprove(true);
    try {
      const contract = new Contract(formData.nftContractAddress, MysterBoxNFTABI, ethersProvider);
      const result = await contract.isApprovedForAll(account, contractAddress);
      setIsApproveAll(result as boolean);
    } catch (err) {
      showToast({
        title: `Fails to check approving: ${(err as Error).message}`,
        variant: 'error',
      });
    }
    setCheckingApprove(false);
  }, [account, formData.nftContractAddress]);

  useEffect(() => {
    checkIsApproveAll();
  }, [checkIsApproveAll]);

  const { getMyTokens } = useNFTContract();

  useEffect(() => {
    getMyTokens(formData.nftContractAddress).then(setOwnedTokens);
  }, [formData.nftContractAddress, getMyTokens]);

  const approveAll = useCallback(async () => {
    if (!ethersProvider || !formData.nftContractAddress) return;
    const closeToast = showToast({
      title: 'Unlocking',
      processing: true,
    });
    try {
      const contract = new Contract(
        formData.nftContractAddress,
        MysterBoxNFTABI,
        ethersProvider.getSigner(),
      );
      const tx = await contract.setApprovalForAll(contractAddress, true);
      await tx.wait(1);
      checkIsApproveAll();
    } catch (err) {
      showToast({
        title: `Fails to unlock ${(err as Error).message}`,
        variant: 'error',
      });
    } finally {
      closeToast();
    }
  }, [ethersProvider, formData.nftContractAddress, checkIsApproveAll]);

  return {
    checkingApprove,
    isApproveAll,
    approveAll,
    ownedTokens,
  };
}
