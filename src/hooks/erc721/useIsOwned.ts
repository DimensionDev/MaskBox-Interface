import { useWeb3Context } from '@/contexts';
import { isSameAddress } from '@/utils';
import { useCallback } from 'react';
import { useERC721InteractContract } from './useERC721InteractContract';

export function useCheckIsOwned(address: string) {
  const contract = useERC721InteractContract(address);
  const { account } = useWeb3Context();

  const checkIsOwned = useCallback(
    async (tokenId: string) => {
      if (!contract || !account) return false;
      try {
        const ownerAddress = await contract.ownerOf(tokenId);
        return isSameAddress(ownerAddress, account);
      } catch {
        return false;
      }
    },
    [contract, account, address],
  );
  return checkIsOwned;
}
