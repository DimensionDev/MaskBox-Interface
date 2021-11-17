import { Button, Icon, LoadingIcon, Overlay, Dialog, DialogProps } from '@/components';
import { useCopyToClipboard } from 'react-use';
import classnames from 'classnames';
import { useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { FC, useMemo } from 'react';
import styles from './index.module.less';
import { useLocales } from '../useLocales';
import { useRecentTransactions } from '@/atoms';
import { TransactionStatus } from '@/types';

interface Props extends DialogProps {}

export const AccountDialog: FC<Props> = ({ onClose, open, ...rest }) => {
  const t = useLocales();
  const { account, disconnect, isMetaMask, providerChainId: chainId } = useWeb3Context();
  const explorerUrl = useMemo(() => {
    const url = chainId ? getNetworkExplorer(chainId) : '';
    return `${url}/address/${account}`;
  }, [chainId, account]);
  const [_, copyToClipboard] = useCopyToClipboard();
  const { recentTransactions, clearTransactions } = useRecentTransactions();

  if (!open) return null;

  return (
    <Overlay>
      <Dialog title="Account" open {...rest} onClose={onClose}>
        <div className={styles.row}>
          {t('Connected with {wallet}', {
            wallet: isMetaMask ? 'MetaMask' : (t('Unknown') as string),
          })}
          <Button
            size="small"
            className={styles.disconnectButton}
            onClick={() => {
              disconnect?.();
              onClose?.();
            }}
            colorScheme="light"
          >
            {t('Disconnect')}
          </Button>
        </div>
        <div className={classnames(styles.row, styles.account)}>
          <Icon className={styles.icon} type={isMetaMask ? 'metamask' : 'wallet'} size={36} />
          {account}
        </div>
        {account ? (
          <div className={styles.row}>
            <div className={styles.cell}>
              <a
                href={explorerUrl}
                className={styles.cell}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className={styles.icon} type="link" size={18} />
                {t('View in your browser')}
              </a>
              <div
                role="button"
                className={styles.copyButton}
                onClick={() => copyToClipboard(account)}
              >
                <Icon className={styles.icon} type="copy" size={18} />
                {t('Copy Address')}
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.recentTxes}>
          <h3 className={styles.title}>
            Recent Transactions
            {recentTransactions.length > 0 && (
              <button className={styles.clearButton} onClick={clearTransactions}>
                Clear All
              </button>
            )}
          </h3>
          {recentTransactions.length > 0 ? (
            <ul className={styles.transactions}>
              {recentTransactions.map((tx) => (
                <li key={tx.txHash} className={styles.transaction}>
                  {tx.status === TransactionStatus.Pending ? (
                    <LoadingIcon color="#FFA800" size={16} />
                  ) : (
                    <Icon
                      color={tx.status === TransactionStatus.Success ? '#2BC128' : '#FB2047'}
                      type={tx.status === TransactionStatus.Success ? 'success' : 'warning'}
                      size={16}
                    />
                  )}
                  <span className={styles.operationName}>{tx.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>Your transactions will appear here...</div>
          )}
        </div>
      </Dialog>
    </Overlay>
  );
};
