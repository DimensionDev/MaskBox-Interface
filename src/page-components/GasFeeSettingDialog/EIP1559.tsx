import { Button, Field, Input } from '@/components';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { FC, HTMLProps, useCallback } from 'react';
import styles from './index.module.less';

export interface EIP1559GasFeeOptions {
  maxPriorityFee: number;
  maxFee: number;
  gasLimit: number;
}
interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  options: EIP1559GasFeeOptions;
  onChange?: (result: EIP1559GasFeeOptions) => void;
  onConfirm?: () => void;
}

export const EIP1559: FC<Props> = ({ className, options, onChange = noop, onConfirm, ...rest }) => {
  const updateField = useCallback(
    (key: keyof EIP1559GasFeeOptions, value: number) => {
      onChange({
        ...options,
        [key]: value,
      });
    },
    [options],
  );
  return (
    <div className={classnames(className, styles.eip1559)} {...rest}>
      <Field className={styles.field} required name="Gas limit">
        <Input
          fullWidth
          value={options.gasLimit}
          onChange={(evt) => updateField('gasLimit', parseInt(evt.currentTarget.value, 10))}
        />
      </Field>
      <Field className={styles.field} required name="Max priority fee">
        <Input
          value={options.maxPriorityFee}
          fullWidth
          rightAddon={<span>Gwei</span>}
          onChange={(evt) => updateField('maxPriorityFee', parseFloat(evt.currentTarget.value))}
        />
      </Field>
      <Field className={styles.field} required name="Max fee">
        <Input
          value={options.maxFee}
          fullWidth
          rightAddon={<span>Gwei</span>}
          onChange={(evt) => updateField('maxFee', parseFloat(evt.currentTarget.value))}
        />
      </Field>

      <Button
        className={styles.confirmButton}
        round={false}
        fullWidth
        size="large"
        onClick={onConfirm}
      >
        Save
      </Button>
    </div>
  );
};
