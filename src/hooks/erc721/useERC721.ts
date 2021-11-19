import { showToast } from '@/components';
import { useMaskboxAddress, useWeb3Context } from '@/contexts';
import { useCallback, useEffect, useState } from 'react';
import { useERC721Contract } from './useERC721Contract';

export function useERC721(address: string | undefined, owner?: string) {
  const [isApproveAll, setIsApproveAll] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [checkingApprove, setCheckingApprove] = useState(false);
  const contract = useERC721Contract(address);
  const { account, ethersProvider } = useWeb3Context();
  const maskboxAddress = useMaskboxAddress();

  const checkingAccount = owner ?? account;
  const checkIsApproveAll = useCallback(async () => {
    if (!ethersProvider || !checkingAccount || !contract) return;
    setIsApproveAll(false);

    setCheckingApprove(true);
    try {
      const result = await contract.isApprovedForAll(checkingAccount, maskboxAddress);
      setIsApproveAll(result as boolean);
    } catch (err) {
      showToast({
        title: `Fails to check approving, are you sure the contract address is correct?`,
        variant: 'error',
      });
      console.log('Fails to check approving', err);
    }
    setCheckingApprove(false);
  }, [checkingAccount, contract, maskboxAddress]);

  useEffect(() => {
    checkIsApproveAll();
  }, [checkIsApproveAll]);

  const internalApproveAll = useCallback(
    async (status: boolean = true) => {
      if (!ethersProvider || !maskboxAddress || !contract) return;
      const closeToast = showToast({
        title: status ? 'Unlocking' : 'Reverting approval',
        processing: true,
      });
      setIsApproving(true);
      try {
        const signer = ethersProvider.getSigner();
        const tx = await contract.connect(signer).setApprovalForAll(maskboxAddress, status);
        await tx.wait(1);
        checkIsApproveAll();
        showToast({
          title: status ? 'Unlock success' : 'Revert approval success',
          variant: 'success',
        });
      } catch (err: any) {
        const failedMessage = status ? `Fails to unlock` : `Failed to revert approval`;
        showToast({
          title:
            err.code === 4001
              ? 'Your wallet canceled the transaction'
              : `${failedMessage}, ${err.message}`,
          variant: 'error',
        });
      } finally {
        closeToast();
        setIsApproving(false);
      }
    },
    [ethersProvider, contract, maskboxAddress],
  );

  const approveAll = useCallback(async () => {
    await internalApproveAll(true);
  }, [internalApproveAll]);

  const unapproveAll = useCallback(async () => {
    await internalApproveAll(false);
  }, [internalApproveAll]);

  return {
    approveAll,
    unapproveAll,
    isApproveAll,
    isApproving,
    checkIsApproveAll,
    checkingApprove,
  };
}
