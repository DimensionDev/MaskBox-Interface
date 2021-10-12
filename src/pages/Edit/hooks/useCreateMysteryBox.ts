import { MysteryBoxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getContractAddressConfig, ZERO_ADDRESS } from '@/lib';
import { Contract, ContractInterface, ethers } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { useCallback } from 'react';
import { formDataAtom } from '../atoms';

const abiInterface = new ethers.utils.Interface(MysteryBoxABI);

export function useCreateMysteryBox() {
  const { ethersProvider, providerChainId } = useWeb3Context();
  const formData = useAtomValue(formDataAtom);
  console.log({ formData });

  const limit = formData.limit ?? 5;
  const createBox = useCallback(async () => {
    if (!ethersProvider || !providerChainId) return;
    const contractAddress = getContractAddressConfig(providerChainId).MysteryBox;
    const contract = new Contract(
      contractAddress,
      MysteryBoxABI as unknown as ContractInterface,
      ethersProvider.getSigner(),
    );
    const result = await contract.createBox(
      formData.nftContractAddress,
      formData.name,
      [{ token_addr: formData.tokenAddress, price: ethers.utils.parseEther(formData.pricePerBox) }],
      limit,
      Math.floor(new Date(formData.startAt).getTime() / 1000),
      Math.floor(new Date(formData.endAt).getTime() / 1000),
      formData.sellAll,
      formData.selectedNFTIds,
      formData.whiteList || ZERO_ADDRESS,
    );
    await result.wait(1);
    const logs = await ethersProvider.getLogs(contract.current.filters.CreationSuccess());
    const parsedLog = abiInterface.parseLog(logs[0]);
    console.log({ result, parsedLog });
    return parsedLog;
  }, [formData, ethersProvider, providerChainId]);
  return createBox;
}
