import { Dialog, DialogProps, Icon, IconType, Overlay, SelectableIcon } from '@/components';
import { ChainId } from '@/lib';
import classnames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { useLocales } from '../../useLocales';
import { connectableChains, connectableWallets } from './config';
import styles from './index.module.less';

export * from './config';

interface Props extends Omit<DialogProps, 'onSelect'> {
  chainId?: ChainId;
  walletId?: string;
  onSelect?: ({ chainId, walletId }: { chainId: ChainId; walletId: string }) => void;
}

export const ConnectDialog: FC<Props> = ({
  className,
  open,
  chainId,
  walletId,
  onSelect,
  ...rest
}) => {
  const t = useLocales();
  const [currChainId, setCurrChainId] = useState<ChainId | undefined>(chainId);

  useEffect(() => {
    if (chainId) {
      setCurrChainId(chainId);
    }
  }, [chainId]);

  useEffect(() => {
    if (!open) {
      setCurrChainId(chainId);
    }
  }, [chainId, open]);

  const handleConnect = useCallback(({ chainId, walletId }) => {
    if (chainId && walletId && onSelect) {
      onSelect({
        chainId,
        walletId,
      });
    }
  }, []);

  if (!open) return null;

  return (
    <Overlay>
      <Dialog
        title={t('Connect Wallet')}
        open
        className={classnames(className, styles.dialog)}
        {...rest}
      >
        <div className={styles.step}>
          <p className={styles.stepTitle}>{t('1.Choose Network')}</p>
          <div className={classnames(styles.stepContent, styles.list)}>
            {connectableChains.map((c) => (
              <div
                className={classnames(styles.option, {
                  [styles.selected]: c.chainId === currChainId,
                })}
                key={c.name}
                role="button"
                onClick={() => setCurrChainId(c.chainId)}
              >
                <SelectableIcon key={c.name} selected={c.chainId === currChainId}>
                  <Icon type={c.iconType as IconType} size={48} />
                </SelectableIcon>
                <p className={styles.name}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.step}>
          <p className={styles.stepTitle}>{t('2.Choose Wallet')}</p>
          <div className={classnames(styles.stepContent, styles.list)}>
            <div className={classnames(styles.stepContent, styles.list)}>
              {connectableWallets.map((w) => (
                <div
                  className={styles.option}
                  role="button"
                  key={w.id}
                  onClick={() => {
                    if (w.installed) {
                      handleConnect({
                        chainId: currChainId,
                        walletId: w.id,
                      });
                    } else if (w.installUrl) {
                      window.open(w.installUrl, '_blank noopener noreferrer');
                    }
                  }}
                >
                  <SelectableIcon selected={w.id === walletId}>
                    <Icon type={w.iconType} size={48} />
                  </SelectableIcon>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </Overlay>
  );
};
