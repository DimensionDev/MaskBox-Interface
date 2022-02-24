import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Context } from '@/contexts';
import { useBoolean, switchAddressToBase64 } from '@/utils';
import { getMerkleProof } from '@/api/merkleProof';
import { DEFAULT_MERKLE_PROOF } from '@/constants';

export function useMerkleProof(rootHash?: string) {
  const { account } = useWeb3Context();
  const [isFetchingProof, setIsFetchingProof, setIsNotFetchingProof] = useBoolean(true);
  const [isWhitelisted, setIsWhitelisted, setNotWhitelisted] = useBoolean(true);
  const [proof, setProof] = useState<string>(DEFAULT_MERKLE_PROOF);

  useEffect(() => {
    if (rootHash && account) {
      const base64Address = switchAddressToBase64(account);
      const leaf = encodeURIComponent(base64Address);
      setIsFetchingProof();
      getMerkleProof(leaf, rootHash?.replace(/^0x/, ''))
        ?.then((data) => {
          setIsNotFetchingProof();
          if (data?.message === 'leaf not found') {
            setNotWhitelisted();
          }
          if (data?.proof) {
            setIsWhitelisted();
          }
          const abiCoder = new ethers.utils.AbiCoder();
          setProof(abiCoder.encode(['bytes32[]'], [data?.proof?.map((p) => '0x' + p) ?? []]));
        })
        .catch(() => setIsNotFetchingProof());
    }
  }, [rootHash, account]);
  return { isFetchingProof, isWhitelisted, proof };
}
