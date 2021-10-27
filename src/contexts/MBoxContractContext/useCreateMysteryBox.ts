import { MysteryBoxABI } from '@/abi';
import { contractAddresses } from '@/lib';
import { Contract, ContractInterface } from 'ethers';
import { useCallback, useEffect, useRef } from 'react';
import { useWeb3Context } from '../Web3Context';

const contractAddress = contractAddresses.Rinkeby.MysteryBox;
const mboxContract = new Contract(contractAddress, MysteryBoxABI as unknown as ContractInterface);

interface PaymentOption {
  token_addr: string;
  price: string;
}

interface CreateBoxOptions {
  nft_address: string;
  name: string;
  payment: PaymentOption[];
}

/**
 * @deprecate
 */
export function useCreateMysteryBox() {
  const { ethersProvider } = useWeb3Context();
  const contract = useRef(mboxContract);

  useEffect(() => {
    if (ethersProvider) {
      contract.current = contract.current.connect(ethersProvider);
    }
  }, [ethersProvider]);

  const createBox = useCallback(async (options: CreateBoxOptions) => {
    const result = await contract.current.createBox(options);
    console.log(result);
  }, []);
  return createBox;
}
