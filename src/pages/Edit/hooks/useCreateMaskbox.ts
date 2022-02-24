import { MaskboxABI } from '@/abi';
import { useRecentTransactions } from '@/atoms';
import { useMaskboxContract, useWeb3Context, useMerkleTreeAddress } from '@/contexts';
import { useERC20Token } from '@/hooks';
import { ZERO_ADDRESS } from '@/lib';
import { TransactionStatus } from '@/types';
import { DEFAULT_MERKLE_PROOF } from '@/constants';
import { utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';
import { useLocales } from '../useLocales';

const abiInterface = new utils.Interface(MaskboxABI);

export function useCreateMaskbox() {
  const t = useLocales();
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);
  const { addTransaction, updateTransactionBy } = useRecentTransactions();
  const contract = useMaskboxContract();
  const merkleTreeAddress = useMerkleTreeAddress();
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
      formData.merkleProof === DEFAULT_MERKLE_PROOF ? ZERO_ADDRESS : merkleTreeAddress,
      formData.holderTokenAddress || ZERO_ADDRESS,
      formData.holderMinTokenAmount
        ? utils.parseUnits(formData.holderMinTokenAmount, holderToken?.decimals ?? 18)
        : 0,
      formData.merkleProof,
    ];
    const connectedContract = contract.connect(ethersProvider.getSigner());
    const estimatedGas = await connectedContract.estimateGas.createBox(...createBoxOptions);
    const tx = await connectedContract.createBox(...createBoxOptions, { gasLimit: estimatedGas });
    const txHash = tx.hash as string;
    addTransaction({
      chainId,
      txHash,
      name: t('Create MaskBox'),
      status: TransactionStatus.Pending,
    });
    const receipt = await tx.wait(1);
    const log = receipt.events[0];
    updateTransactionBy({
      txHash,
      status: TransactionStatus.Success,
    });

    const parsedLog = abiInterface.parseLog(log);
    return parsedLog;
  }, [formData, ethersProvider, chainId, merkleTreeAddress]);
  return createBox;
}
