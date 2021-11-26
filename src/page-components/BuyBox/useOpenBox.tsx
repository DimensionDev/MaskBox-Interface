import { useRecentTransactions } from '@/atoms';
import { Icon, showToast } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { useMaskboxContract } from '@/hooks';
import { getNetworkExplorer, ZERO_ADDRESS } from '@/lib';
import { BoxPayment, TransactionStatus } from '@/types';
import { useCallback, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

export function useOpenBox(
  boxId: string,
  quantity: number,
  payment: BoxPayment,
  paymentTokenIndex: number,
  proof: string[] = [],
) {
  const t = useLocales();
  const { ethersProvider, providerChainId: chainId, account } = useWeb3Context();
  const { openBox, getPurchasedNft } = useMBoxContract();
  const contract = useMaskboxContract(true);
  const isNative = payment.token_addr === ZERO_ADDRESS;
  const [loading, setLoading] = useState(false);
  const { addTransaction, updateTransactionBy } = useRecentTransactions();

  const open = useCallback(async () => {
    if (!contract || !ethersProvider || !account || !chainId) return;
    setLoading(true);
    showToast({
      title: 'Drawing',
      message: t('Sending transaction'),
    });
    try {
      const purchasedNfts = await getPurchasedNft(boxId, account);
      // TODO the proof parameter
      const tx = await openBox(boxId, quantity, paymentTokenIndex, proof, {
        value: isNative ? payment.price.mul(quantity) : undefined,
      });

      const txHash = tx.hash as string;
      addTransaction({
        chainId,
        txHash,
        name: t('Draw MaskBox'),
        status: TransactionStatus.Pending,
      });

      const exploreUrl = chainId ? `${getNetworkExplorer(chainId)}/tx/${tx?.hash}` : '';
      const closeToast = showToast({
        title: t('Transaction sent'),
        processing: true,
        message: (
          <span className={styles.drawMessage}>
            {t('Transaction Submitted')}{' '}
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
        title: t('Draw Success'),
        variant: 'success',
      });
      updateTransactionBy({
        txHash,
        status: TransactionStatus.Success,
      });
      return {
        boxId,
        nftIds: newlyPurchasedNfts,
      };
    } catch (err: any) {
      showToast({
        title: t('Fails to draw the box: {message}', {
          message: err.error ? err.error.message : err.message,
        }),
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
