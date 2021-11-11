import { Button, Icon, Overlay, PickerDialog, PickerDialogProps } from '@/components';
import { useCopyToClipboard } from 'react-use';
import classnames from 'classnames';
import { useWeb3Context } from '@/contexts';
import { getNetworkExplorer } from '@/lib';
import { FC, useMemo } from 'react';
import styles from './index.module.less';
import { useLocales } from '../useLocales';

interface Props extends PickerDialogProps {}

export const AccountDialog: FC<Props> = ({ onClose, open, ...rest }) => {
  const t = useLocales();
  const { account, disconnect, isMetaMask, providerChainId: chainId } = useWeb3Context();
  const explorerUrl = useMemo(() => {
    const url = chainId ? getNetworkExplorer(chainId) : '';
    return `${url}/address/${account}`;
  }, [chainId, account]);
  const [_, copyToClipboard] = useCopyToClipboard();

  if (!open) return null;

  return (
    <Overlay>
      <PickerDialog title="Account" open {...rest} onClose={onClose}>
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
      </PickerDialog>
    </Overlay>
  );
};
