import { FC, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Icon, Overlay, PickerDialog, PickerDialogProps, SelectableIcon } from '@/components';
import styles from './index.module.less';
import { connectableChains, connectableWallets } from './config';
import { ChainId } from '@/lib';

export * from './config';

interface Props extends Omit<PickerDialogProps, 'onSelect'> {
  chainId?: ChainId;
  walletId?: string;
  onSelect?: ({
    chainId,
    walletId,
    walletType,
  }: {
    chainId: ChainId;
    walletId: string;
    walletType: string;
  }) => void;
}

export const ConnectDialog: FC<Props> = ({
  className,
  open,
  chainId,
  walletId,
  onSelect,
  ...rest
}) => {
  const [currChainId, setCurrChainId] = useState<ChainId | undefined>(chainId);
  const [currWalletId, setCurrWalletId] = useState<string | undefined>(walletId);

  useEffect(() => {
    setCurrChainId(chainId);
  }, [chainId]);

  useEffect(() => {
    setCurrWalletId(walletId);
  }, [walletId]);

  const handleConnect = useCallback(({ chainId, walletId, walletType }) => {
    if (chainId && walletId && onSelect) {
      onSelect({
        chainId,
        walletId,
        walletType,
      });
    }
  }, []);

  if (!open) return null;

  return (
    <Overlay>
      <PickerDialog
        title="Connect Wallet"
        open
        className={classnames(className, styles.dialog)}
        {...rest}
      >
        <div className={styles.step}>
          <p className={styles.stepTitle}>1.Choose Network</p>
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
                  <Icon type={c.iconType} size={48} />
                </SelectableIcon>
                <p className={styles.name}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.step}>
          <p className={styles.stepTitle}>2.Choose Wallet</p>
          <div className={classnames(styles.stepContent, styles.list)}>
            <div className={classnames(styles.stepContent, styles.list)}>
              {connectableWallets.map((w) => (
                <div
                  className={styles.option}
                  role="button"
                  key={w.id}
                  onClick={() => {
                    setCurrWalletId(w.id);
                    if (currChainId) {
                      handleConnect({
                        chainId: currChainId,
                        walletId: w.id,
                        walletType: w.type,
                      });
                    }
                  }}
                >
                  <SelectableIcon selected={w.id === currWalletId}>
                    <Icon type={w.iconType} size={48} />
                  </SelectableIcon>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PickerDialog>
    </Overlay>
  );
};
