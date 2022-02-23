import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Context } from '@/contexts';
import { useBoolean } from '@/utils';
import { getMerkleProof } from '@/api/merkleProof';

export function useMerkleProof(rootHash?: string) {
  const { account } = useWeb3Context();
  const [isFetchingProof, setIsFetchingProof, setIsNotFetchingProof] = useBoolean(true);
  const [isWhitelisted, setIsWhitelisted, setNotWhitelisted] = useBoolean(true);
  const [proof, setProof] = useState<string>();

  useEffect(() => {
    if (rootHash && account) {
      const leafArray = account
        ?.replace(/0x/, '')
        ?.match(/.{1,2}/g)
        ?.map((byte) => parseInt(byte, 16));
      const leaf = encodeURIComponent(
        Buffer.from(new Uint8Array(leafArray as number[])).toString('base64'),
      );
      setIsFetchingProof();
      getMerkleProof(leaf as string, rootHash?.replace(/0x/, ''))
        ?.then((data) => {
          setIsNotFetchingProof();
          if (data?.message === 'leaf not found') {
            setNotWhitelisted();
          }
          if (data?.proof) {
            setIsWhitelisted();
          }
          const abiCoder = new ethers.utils.AbiCoder();
          setProof(abiCoder.encode(['bytes32[]'], [data?.proof?.map((p) => '0x' + p)]));
        })
        .catch(() => setIsNotFetchingProof());
    }
  }, [rootHash, account]);
  return { isFetchingProof, isWhitelisted, proof };
}
