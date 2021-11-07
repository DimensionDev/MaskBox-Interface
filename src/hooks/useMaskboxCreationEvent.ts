import { MaskboxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { getContractFromBlock } from '@/lib';
import { utils } from 'ethers';
import { first } from 'lodash-es';
import { useAsyncRetry } from 'react-use';
import { useMysteryBoxContract } from './useMysteryBoxContract';

const abiInterface = new utils.Interface(MaskboxABI);
export function useMaskBoxCreationSuccessEvent(
  creatorAddress?: string,
  tokenAddress?: string,
  boxId?: string | null,
) {
  const contract = useMysteryBoxContract();
  const { providerChainId, ethersProvider } = useWeb3Context();

  return useAsyncRetry(async () => {
    if (!contract || !providerChainId || !ethersProvider) return null;
    const fromBlock = getContractFromBlock(providerChainId);
    const filter = contract.filters.CreationSuccess(creatorAddress, tokenAddress, boxId);
    const logs = await ethersProvider.getLogs({
      ...filter,
      fromBlock,
    });
    const firstLog = first(logs);
    console.log({ logs });
    return firstLog ? abiInterface.parseLog(firstLog) : null;
  }, [boxId, creatorAddress, tokenAddress, contract, providerChainId, ethersProvider]);
}
