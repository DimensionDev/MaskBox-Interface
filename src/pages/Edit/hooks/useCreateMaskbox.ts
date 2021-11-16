import { MaskboxABI } from '@/abi';
import { useRecentTransactions } from '@/atoms';
import { MAX_CONFIRMATION } from '@/configs';
import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { ZERO_ADDRESS } from '@/lib';
import { TransactionStatus } from '@/types';
import { toUTCZero } from '@/utils';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';

const abiInterface = new ethers.utils.Interface(MaskboxABI);

export function useCreateMaskbox() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);
  const { addTransaction, updateTransactionBy } = useRecentTransactions();
  const contract = useMaskboxContract();

  const limit = formData.limit ?? 5;
  const startTime = Math.floor(toUTCZero(formData.startAt).getTime() / 1000);
  const endTime = Math.floor(toUTCZero(formData.endAt).getTime() / 1000);
  const createBox = useCallback(async () => {
    if (!ethersProvider || !chainId || !contract) return;
    const tx = await contract.connect(ethersProvider.getSigner()).createBox(
      formData.nftContractAddress,
      formData.name,
      [
        {
          token_addr: formData.tokenAddress,
          price: ethers.utils.parseUnits(formData.pricePerBox, formData.token?.decimals ?? 18),
        },
      ],
      limit,
      startTime,
      endTime,
      formData.sellAll,
      formData.selectedNFTIds,
      formData.whiteList || ZERO_ADDRESS,
    );
    const txHash = tx.hash as string;
    addTransaction({
      chainId,
      txHash,
      name: 'Create MaskBox',
      status: TransactionStatus.Pending,
    });
    let log;
    let confirmation = 0;
    while (!log) {
      await tx.wait(1);
      confirmation += 1;
      const logs = await ethersProvider.getLogs(contract.filters.CreationSuccess());
      log = logs[0];
      if (!log && confirmation >= MAX_CONFIRMATION) {
        updateTransactionBy({
          txHash,
          status: TransactionStatus.Fails,
        });
        throw new Error('Fails to get log of CreationSuccess');
      }
    }
    updateTransactionBy({
      txHash,
      status: TransactionStatus.Success,
    });
    console.info('useCreateMaskbox', { confirmation });

    const parsedLog = abiInterface.parseLog(log);
    return parsedLog;
  }, [formData, ethersProvider, chainId]);
  return createBox;
}
