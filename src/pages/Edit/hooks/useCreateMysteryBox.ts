import { MysteryBoxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getContractAddressConfig, ZERO_ADDRESS } from '@/lib';
import { Contract, ContractInterface, ethers } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';

const abiInterface = new ethers.utils.Interface(MysteryBoxABI);
const MAX_CONFIRMATION = 6;

export function useCreateMysteryBox() {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);

  const limit = formData.limit ?? 5;
  const createBox = useCallback(async () => {
    if (!ethersProvider || !providerChainId) return;
    const contractAddress = getContractAddressConfig(providerChainId).MysteryBox;
    const contract = new Contract(
      contractAddress,
      MysteryBoxABI as unknown as ContractInterface,
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
    let log;
    let confirmation = 0;
    while (!log) {
      await tx.wait(1);
      confirmation += 1;
      const logs = await ethersProvider.getLogs(contract.filters.CreationSuccess());
      log = logs[0];
      if (!log && confirmation >= MAX_CONFIRMATION) {
        throw new Error('Fails to get log of CreationSuccess');
      }
    }

    const parsedLog = abiInterface.parseLog(log);
    return parsedLog;
  }, [formData, ethersProvider, providerChainId]);
  return createBox;
}
