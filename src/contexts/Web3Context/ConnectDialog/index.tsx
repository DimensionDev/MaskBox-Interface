import { FC, useCallback, useState } from 'react';
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
  const [currWalletId, setCurrWallet] = useState<string | undefined>(walletId);
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
              <SelectableIcon
                className={styles.option}
                key={c.name}
                selected={c.chainId === currChainId}
                onClick={() => setCurrChainId(c.chainId)}
              >
                <Icon type={c.iconType} size={48} />
              </SelectableIcon>
            ))}
          </div>
        </div>

        <div className={styles.step}>
          <p className={styles.stepTitle}>2.Choose Wallet</p>
          <div className={classnames(styles.stepContent, styles.list)}>
            <div className={classnames(styles.stepContent, styles.list)}>
              {connectableWallets.map((w) => (
                <SelectableIcon
                  className={styles.option}
                  key={w.id}
                  selected={w.id === currWalletId}
                  onClick={() => {
                    setCurrWallet(w.id);
                    if (currChainId) {
                      handleConnect({
                        chainId: currChainId,
                        walletId: w.id,
                        walletType: w.type,
                      });
                    }
                  }}
                >
                  <Icon type={w.iconType} size={48} />
                </SelectableIcon>
              ))}
            </div>
          </div>
        </div>
      </PickerDialog>
    </Overlay>
  );
};
