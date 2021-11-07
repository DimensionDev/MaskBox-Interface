import { Icon, showToast } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { useMysteryBoxContract } from '@/hooks/useMysteryBoxContract';
import { getNetworkExplorer, ZERO_ADDRESS } from '@/lib';
import { BoxPayment } from '@/types';
import { useCallback, useState } from 'react';
import styles from './index.module.less';

export function useOpenBox(
  boxId: string,
  quantity: number,
  payment: BoxPayment,
  paymentTokenIndex: number,
  proof: string[] = [],
) {
  const { ethersProvider, providerChainId: chainId, account } = useWeb3Context();
  const { openBox, getPurchasedNft } = useMBoxContract();
  const contract = useMysteryBoxContract(true);
  const isNative = payment.token_addr === ZERO_ADDRESS;
  const [loading, setLoading] = useState(false);

  const open = useCallback(async () => {
    if (!contract || !ethersProvider || !account) return;
    setLoading(true);
    showToast({
      title: 'Drawing',
      message: 'Sending transaction',
    });
    try {
      const purchasedNfts = await getPurchasedNft(boxId, account);
      console.log('purchasedNfts', { purchasedNfts });
      // TODO the proof parameter
      const tx = await openBox(boxId, quantity, paymentTokenIndex, proof, {
        value: isNative ? payment.price.mul(quantity) : undefined,
      });
      const exploreUrl = chainId ? `${getNetworkExplorer(chainId)}/tx/${tx?.hash}` : '';
      const closeToast = showToast({
        title: 'Transaction sent',
        processing: true,
        message: (
          <span className={styles.drawMessage}>
            Transaction Submitted{' '}
            <a
              href={exploreUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="view transaction"
            >
              <Icon type="external" size={18} color="#0057ff" />
            </a>
          </span>
        ),
      });
      await tx.wait(1);
      await ethersProvider.getLogs(contract.filters.OpenSuccess());
      const newlyPurchasedNfts = (await getPurchasedNft(boxId, account)).filter(
        (id) => !purchasedNfts.includes(id),
      );
      console.log({ newlyPurchasedNfts });
      closeToast();
      showToast({
        title: `Draw Success`,
        variant: 'success',
      });
      return {
        boxId,
        nftIds: newlyPurchasedNfts,
      };
    } catch (err: any) {
      showToast({
        title: `Fails to draw the box ${boxId}: ${err.error ? err.error.message : err.message}`,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [
    account,
    chainId,
    boxId,
    quantity,
    payment,
    paymentTokenIndex,
    proof,
    contract,
    ethersProvider,
  ]);

  return { open, loading };
}
