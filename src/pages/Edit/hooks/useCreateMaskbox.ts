import { MaskboxABI } from '@/abi';
import { useRecentTransactions } from '@/atoms';
import { MAX_CONFIRMATION } from '@/configs';
import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { useERC20Token } from '@/hooks';
import { ZERO_ADDRESS } from '@/lib';
import { TransactionStatus } from '@/types';
import { utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';

const abiInterface = new utils.Interface(MaskboxABI);

export function useCreateMaskbox() {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);
  const { addTransaction, updateTransactionBy } = useRecentTransactions();
  const contract = useMaskboxContract();
  const holderToken = useERC20Token(formData.holderTokenAddress);

  const limit = formData.limit ?? 5;
  const startTime = Math.floor(new Date(formData.startAt).getTime() / 1000);
  const endTime = Math.floor(new Date(formData.endAt).getTime() / 1000);
  const createBox = useCallback(async () => {
    if (!ethersProvider || !chainId || !contract) return;
    const createBoxOptions = [
      formData.nftContractAddress,
      formData.name,
      [
        {
          token_addr: formData.tokenAddress,
          price: utils.parseUnits(formData.pricePerBox, formData.token?.decimals ?? 18),
        },
      ],
      limit,
      startTime,
      endTime,
      formData.sellAll,
      formData.selectedNFTIds,
      formData.whiteList || ZERO_ADDRESS,
      formData.holderTokenAddress || ZERO_ADDRESS,
      formData.holderMinTokenAmount
        ? utils.parseUnits(formData.holderMinTokenAmount, holderToken?.decimals ?? 18)
        : 0,
    ];
    const connectedContract = contract.connect(ethersProvider.getSigner());
    const estimatedGas = await connectedContract.estimateGas.createBox(...createBoxOptions);
    const tx = await connectedContract.createBox(...createBoxOptions, { gasLimit: estimatedGas });
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
      console.log(`waited ${confirmation} block`);
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
    console.info('useCreateMaskBox', { confirmation });

    const parsedLog = abiInterface.parseLog(log);
    return parsedLog;
  }, [formData, ethersProvider, chainId]);
  return createBox;
}
