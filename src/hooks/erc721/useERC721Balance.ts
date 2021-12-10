import { useWeb3Context } from '@/contexts';
import { ZERO } from '@/lib';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useERC721InteractContract } from './useERC721InteractContract';

export function useERC721Balance(address: string | undefined) {
  const contract = useERC721InteractContract(address);
  const { account } = useWeb3Context();
  const [balance, setBalance] = useState<BigNumber>(ZERO);
  useEffect(() => {
    if (!contract || !account) return;
    contract.balanceOf(account).then((result: string) => {
      if (!result) return setBalance(ZERO);
      setBalance(BigNumber.from(result));
    });
  }, [contract, account]);

  return balance;
}
