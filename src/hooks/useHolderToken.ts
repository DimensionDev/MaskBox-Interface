import { useMaskboxContract } from '@/contexts';
import { useEffect, useState } from 'react';
import { useERC20Token } from './useGetERC20TokenInfo';

export function useHolderToken() {
  const [tokenAddr, setTokenAddr] = useState('');
  const contract = useMaskboxContract();
  const token = useERC20Token(tokenAddr);
  useEffect(() => {
    if (!contract) return;
    contract.holderTokenAddr().then(setTokenAddr);
  }, [contract]);

  return token;
}
