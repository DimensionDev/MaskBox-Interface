import { MaskboxNFTABI } from '@/abi';
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
  const [isApproving, setIsApproving] = useState(false);
  const [checkingApprove, setCheckingApprove] = useState(false);
  const { account, ethersProvider, providerChainId: chainId } = useWeb3Context();
  const [ownedTokens, setOwnedTokens] = useState<ERC721Token[]>([]);
  const contractAddress = useMemo(
    () => (chainId ? getContractAddressConfig(chainId)?.Maskbox : ''),
    [chainId],
  );

  const checkIsApproveAll = useCallback(async () => {
    if (!ethersProvider || !account) return;
    setIsApproveAll(false);
    if (!utils.isAddress(formData.nftContractAddress)) return;

    setCheckingApprove(true);
    try {
      const contract = new Contract(formData.nftContractAddress, MaskboxNFTABI, ethersProvider);
      const result = await contract.isApprovedForAll(account, contractAddress);
      setIsApproveAll(result as boolean);
    } catch (err) {
      showToast({
        title: `Fails to check approving, are you sure the contract address is correct?`,
        variant: 'error',
      });
      console.log('Fails to check approving', err);
    }
    setCheckingApprove(false);
  }, [account, formData.nftContractAddress]);

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

  useEffect(() => {
    checkIsApproveAll();
  }, [checkIsApproveAll]);

  const { getMyTokens } = useNFTContract();

  useEffect(() => {
    if (formData.nftContractAddress) {
      debugger;
    }
    getMyTokens(formData.nftContractAddress).then(setOwnedTokens);
  }, [formData.nftContractAddress, getMyTokens]);

  const approveAll = useCallback(async () => {
    if (!ethersProvider || !formData.nftContractAddress) return;
    const closeToast = showToast({
      title: 'Unlocking',
      processing: true,
    });
    setIsApproving(true);
    try {
      const contract = new Contract(
        formData.nftContractAddress,
        MaskboxNFTABI,
        ethersProvider.getSigner(),
      );
      const tx = await contract.setApprovalForAll(contractAddress, true);
      await tx.wait(1);
      checkIsApproveAll();
      showToast({
        title: 'Unlock success',
        variant: 'success',
      });
    } catch (err: any) {
      showToast({
        title:
          err.code === 4001
            ? 'Your wallet canceled the transaction'
            : `Fails to unlock, ${err.message}`,
        variant: 'error',
      });
    } finally {
      closeToast();
      setIsApproving(false);
    }
  }, [ethersProvider, formData.nftContractAddress, checkIsApproveAll]);

  return {
    checkingApprove,
    approveAll,
    ownedTokens,
    isApproveAll,
    isApproving,
    isEnumable,
  };
}
