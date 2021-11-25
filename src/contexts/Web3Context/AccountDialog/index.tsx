import { Button, Icon, LoadingIcon, Overlay, Dialog, DialogProps } from '@/components';
import { useCopyToClipboard } from 'react-use';
import classnames from 'classnames';
import { useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { FC, useCallback, useEffect, useMemo } from 'react';
import styles from './index.module.less';
import { useLocales } from '../../useLocales';
import { useRecentTransactions } from '@/atoms';
import { TransactionStatus } from '@/types';
import { useBoolean } from '@/hooks';

interface Props extends DialogProps {}

export const AccountDialog: FC<Props> = ({ onClose, open, ...rest }) => {
  const t = useLocales();
  const [copied, setCopied, setNotCopied] = useBoolean();
  const { account, disconnect, isMetaMask, providerChainId: chainId } = useWeb3Context();
  const explorerUrl = useMemo(() => {
    const url = chainId ? getNetworkExplorer(chainId) : '';
    return `${url}/address/${account}`;
  }, [chainId, account]);
  const [, copyToClipboard] = useCopyToClipboard();
  const { recentTransactions, clearTransactions } = useRecentTransactions();

  const copy = useCallback(() => {
    copyToClipboard(account!);
    setCopied();
  }, [account, copyToClipboard]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(setNotCopied, 1000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!open) return null;

  return (
    <Overlay>
      <Dialog title={t('Account')} open {...rest} onClose={onClose}>
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
              <div role="button" className={styles.copyButton} onClick={copy}>
                <Icon
                  className={styles.icon}
                  type={copied ? 'success' : 'copy'}
                  color="green"
                  size={18}
                />
                {t(copied ? 'Copied' : 'Copy Address')}
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.recentTxes}>
          <h3 className={styles.title}>
            {t('Recent Transactions')}
            {recentTransactions.length > 0 && (
              <button className={styles.clearButton} onClick={clearTransactions}>
                {t('Clear All')}
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
            <div className={styles.empty}>{t('Your transactions will appear here...')}</div>
          )}
        </div>
      </Dialog>
    </Overlay>
  );
};
