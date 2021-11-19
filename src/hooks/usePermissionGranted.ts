import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { useEffect, useState } from 'react';

export function usePermissionGranted() {
  const { account } = useWeb3Context();
  const contract = useMaskboxContract();
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (!account || !contract) return;
    contract.whitelist(account).then((result: boolean) => {
      setGranted(result);
    });
  }, [account]);

  return granted;
}
