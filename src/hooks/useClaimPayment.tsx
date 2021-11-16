import { MaskboxABI } from '@/abi';
import { useRecentTransactions } from '@/atoms';
import { Icon, showToast } from '@/components';
import { MAX_CONFIRMATION } from '@/configs';
import { useMaskboxContract, useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { TransactionStatus } from '@/types';
import { utils } from 'ethers';
import { useCallback } from 'react';
import styles from './use-claim-payment.module.less';

const abiInterface = new utils.Interface(MaskboxABI);
export function useClaimPayment() {
  const contract = useMaskboxContract();
  const { ethersProvider, providerChainId: chainId } = useWeb3Context();
  const { addTransaction, updateTransactionBy } = useRecentTransactions();
  const claimPayment = useCallback(
    async (boxId: string) => {
      if (!contract || !ethersProvider || !chainId) return;
      const signer = ethersProvider.getSigner();
      showToast({
        title: 'Withrawing',
        message: 'Sending transaction',
      });
      try {
        const tx = await contract.connect(signer).claimPayment([boxId]);
        const txHash = tx.hash as string;
        addTransaction({
          chainId,
          txHash,
          name: 'Withdraw',
          status: TransactionStatus.Pending,
        });
        const exploreUrl = chainId ? `${getNetworkExplorer(chainId)}/tx/${txHash}` : '';
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
        let log;
        let confirmation = 0;
        while (!log) {
          await tx.wait(1);
          confirmation += 1;
          const logs = await ethersProvider.getLogs(contract.filters.ClaimPayment());
          log = logs[0];
          if (!log && confirmation >= MAX_CONFIRMATION) {
            updateTransactionBy({
              txHash,
              status: TransactionStatus.Fails,
            });
            throw new Error('Fails to get log of ClaimPayment');
          }
        }
        updateTransactionBy({
          txHash,
          status: TransactionStatus.Success,
        });
        closeToast();
        const parsedLog = abiInterface.parseLog(log);
        return parsedLog.args;
      } catch (err: any) {
        console.log({ withdrawError: err });
        showToast({
          title: `Fails to withdraw ${boxId}: ${err.error ? err.error.message : err.message}`,
          variant: 'error',
        });
      }
    },
    [contract, ethersProvider, chainId],
  );

  return claimPayment;
}
