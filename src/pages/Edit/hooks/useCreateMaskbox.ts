import { MaskboxABI } from '@/abi';
import { useRecentTransactions } from '@/atoms';
import { useWeb3Context } from '@/contexts';
import { getContractAddressConfig, ZERO_ADDRESS } from '@/lib';
import { TransactionStatus } from '@/types';
import { Contract, ContractInterface, ethers } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';

const abiInterface = new ethers.utils.Interface(MaskboxABI);
const MAX_CONFIRMATION = 6;

export function useCreateMaskbox() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);
  const { addTransaction, updateTransactionBy } = useRecentTransactions();

  const limit = formData.limit ?? 5;
  const createBox = useCallback(async () => {
    if (!ethersProvider || !chainId) return;
    const contractAddress = getContractAddressConfig(chainId).Maskbox;
    const contract = new Contract(
      contractAddress,
      MaskboxABI as unknown as ContractInterface,
      ethersProvider.getSigner(),
    );
    const tx = await contract.createBox(
      formData.nftContractAddress,
      formData.name,
      [
        {
          token_addr: formData.tokenAddress,
          price: ethers.utils.parseUnits(formData.pricePerBox, formData.token?.decimals ?? 18),
        },
      ],
      limit,
      Math.floor(new Date(formData.startAt).getTime() / 1000),
      Math.floor(new Date(formData.endAt).getTime() / 1000),
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
