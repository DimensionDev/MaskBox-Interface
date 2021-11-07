import { MaskboxABI } from '@/abi';
import { useWeb3Context } from '@/contexts';
import { useMysteryBoxContract } from '@/hooks';
import { CreateResult } from '@/types';
import { utils } from 'ethers';
import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

const abiInterface = new utils.Interface(MaskboxABI);

export function useGetBoxes() {
  const { ethersProvider } = useWeb3Context();
  const contract = useMysteryBoxContract();
  const [boxes, setBoxes] = useState<CreateResult[]>([]);
  const offsetRef = useRef(0);
  const getBoxes = useCallback(async () => {
    if (!contract || !ethersProvider) return;
    const blockNumber = await ethersProvider.getBlockNumber();
    const filter = contract.filters.CreationSuccess();
    const offset = offsetRef.current;
    const logs = await ethersProvider.getLogs({
      ...filter,
      fromBlock: blockNumber - 30000 * (offset + 1),
      toBlock: blockNumber - offset * 0,
    });
    offsetRef.current += 1;
    const boxIds = logs.map((log) => {
      const { args } = abiInterface.parseLog(log);
      return {
        name: args.name,
        creator: args.creator,
        nft_address: args.nft_address,
        box_id: args.box_id.toString(),
        sell_all: args.sell_all,
        start_time: args.start_time,
        end_time: args.end_time,
      } as CreateResult;
    });
    setBoxes((originalBoxes) => uniqBy([...originalBoxes, ...boxIds], 'box_id'));
  }, [contract, ethersProvider]);

  useEffect(() => {
    getBoxes();
  }, [getBoxes]);

  return { boxes, getBoxes };
}
