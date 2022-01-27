import { useWeb3Context } from '@/contexts';
import { ZERO } from '@/lib';
import { createDefer } from '@/utils';
import { BigNumber } from 'ethers';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useERC721InteractContract } from './useERC721InteractContract';

export function useERC721Balance(address: string | undefined) {
  const contract = useERC721InteractContract(address);
  const { account } = useWeb3Context();
  const [balance, setBalance] = useState<BigNumber>(ZERO);
  useEffect(() => {
    if (!contract || !account) return;
    const [promise, resolve, reject] = createDefer<BigNumber | null>();
    contract.balanceOf(account).then((result: string) => {
      if (!result) return resolve(ZERO);
      resolve(BigNumber.from(result));
    });
    promise.then((result) => {
      if (!result) return setBalance(ZERO);
      setBalance(BigNumber.from(result));
    }, noop);
    return () => {
      reject();
    };
  }, [contract, account]);

  return balance;
}
