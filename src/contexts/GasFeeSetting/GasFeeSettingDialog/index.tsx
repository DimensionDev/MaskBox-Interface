import { Button, PickerDialog, PickerDialogProps } from '@/components';
import { useWeb3Context } from '@/contexts';
import { supportedEIP1559 } from '@/lib';
import classnames from 'classnames';
import { FC, useState } from 'react';
import { useLocales } from '../../useLocales';
import { EIP1559, EIP1559GasFeeOptions } from './EIP1559';
import { NonEIP1559, GasPriceLevel } from './NonEIP1559';
import styles from './index.module.less';

export type GasFeeResult =
  | {
      gasPrice: number;
    }
  | EIP1559GasFeeOptions;

export interface GasFeeSettingDialogProps extends PickerDialogProps {
  onConfirm: (result: GasFeeResult) => void;
}

export const GasFeeSettingDialog: FC<GasFeeSettingDialogProps> = ({
  className,
  onConfirm,
  ...rest
}) => {
  const t = useLocales();

  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPriceLevel, setGasPriceLevel] = useState<GasPriceLevel>(GasPriceLevel.Fast);
  const [eip1559GasFeeOptions, setEip1559GasFeeOptions] = useState<EIP1559GasFeeOptions>({
    maxPriorityFee: 0,
    maxFee: 0,
    gasLimit: 0,
  });

  const { providerChainId } = useWeb3Context();
  const isEIP1559Supported = supportedEIP1559(providerChainId);
  return (
    <PickerDialog
      title={t('Setting Gas Fee')}
      className={classnames(className, styles.dialog)}
      {...rest}
    >
      <div className={styles.summary}>
        <div className={styles.value}>
          <strong className={styles.digit}>{gasPrice}</strong>
          <span className={styles.unit}>Gwei</span>
        </div>
        <p className={styles.inusd}>≈ $ 31.38</p>
      </div>

      {isEIP1559Supported ? (
        <EIP1559 options={eip1559GasFeeOptions} onChange={setEip1559GasFeeOptions} />
      ) : (
        <NonEIP1559
          gasPriceLevel={gasPriceLevel}
          onChange={(result) => {
            setGasPriceLevel(result.level);
            setGasPrice(result.gasPrice);
          }}
        />
      )}
      <Button
        className={styles.confirmButton}
        round={false}
        fullWidth
        size="large"
        colorScheme="primary"
        onClick={() => {
          onConfirm({
            ...eip1559GasFeeOptions,
            gasPrice,
          });
        }}
      >
        Save
      </Button>
    </PickerDialog>
  );
};
