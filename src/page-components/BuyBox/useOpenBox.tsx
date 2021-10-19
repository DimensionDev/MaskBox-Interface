import { MysteryBoxABI } from '@/abi';
import { Icon, showToast } from '@/components';
import { useWeb3Context } from '@/contexts';
import { useMysteryBoxContract } from '@/hooks/useMysteryBoxContract';
import { getNetworkExplorer, ZERO_ADDRESS } from '@/lib';
import { BoxPayment } from '@/types';
import { utils } from 'ethers';
import { useCallback } from 'react';

const abiInterface = new utils.Interface(MysteryBoxABI);

export function useOpenBox(
  boxId: string,
  quantity: number,
  payment: BoxPayment,
  paymentTokenIndex: number,
  proof: string[] = [],
) {
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const contract = useMysteryBoxContract(true);
  const isNative = payment.token_addr === ZERO_ADDRESS;

  const openBox = useCallback(async () => {
    if (!contract || !ethersProvider) return;
    showToast({
      title: 'Drawing',
      message: 'Sending transaction',
    });
    // TODO the proof parameter
    const tx = await contract.openBox(boxId, quantity, paymentTokenIndex, proof, {
      value: isNative ? payment.price.mul(quantity) : undefined,
    });
    const exploreUrl = chainId ? getNetworkExplorer(chainId) + tx?.hash : '';
    const closeToast = showToast({
      title: 'Transaction sent',
      processing: true,
      message: (
        <span>
          Transaction Submitted{' '}
          <a
            href={exploreUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="view transaction"
          >
            <Icon type="external" size={18} />
          </a>
        </span>
      ),
    });
    await tx.wait(1);
    const openLogs = await ethersProvider.getLogs(contract.filters.OpenSuccess());
    const parsedOpenLog = abiInterface.parseLog(openLogs[0]);
    console.log({ parsedOpenLog });
    closeToast();
    showToast({
      title: `Draw Success`,
      variant: 'success',
    });
  }, [chainId, contract, ethersProvider]);

  return openBox;
}
