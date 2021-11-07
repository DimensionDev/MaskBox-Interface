import { getContractAddressConfig } from '@/lib';
import { useWeb3Context } from '../Web3Context';

export function useMaskboxAddress() {
  const { providerChainId } = useWeb3Context();
  return providerChainId ? getContractAddressConfig(providerChainId)?.Maskbox : '';
}
