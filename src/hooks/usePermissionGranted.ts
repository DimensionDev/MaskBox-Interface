import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { useEffect, useState } from 'react';

/**
 * Permission to create a Maskbox
 * check if current address is in admin list or whitelist
 */
export function usePermissionGranted() {
  const { account } = useWeb3Context();
  const contract = useMaskboxContract();
  const [isAdmin, setIsAdmin] = useState(false);
  const [inWhitelist, setInWhitelist] = useState(false);

  useEffect(() => {
    if (!account || !contract) return;
    contract.whitelist(account).then((result: boolean) => {
      setInWhitelist(result);
    });
    contract.admin(account).then((result: boolean) => {
      setIsAdmin(result);
    });
  }, [account, contract]);

  return isAdmin || inWhitelist;
}
