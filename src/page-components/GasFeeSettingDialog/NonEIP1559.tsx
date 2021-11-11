import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Button, Input } from '@/components';
import styles from './index.module.less';

export enum GasPriceLevel {
  Rapid = 'rapid',
  Fast = 'fast',
  Medium = 'medium',
  Custom = 'custom',
}

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  gasPriceLevel: GasPriceLevel;
  onChange?: ({ level, gasPrice }: { level: GasPriceLevel; gasPrice: number }) => void;
}

const levels = [
  {
    id: GasPriceLevel.Rapid,
    label: 'Rapid',
    gas: 120.0,
    cost: '12s',
  },
  {
    id: GasPriceLevel.Fast,
    label: 'Fast',
    gas: 120.0,
    cost: '12s',
  },
  {
    id: GasPriceLevel.Medium,
    label: 'Medium',
    gas: 120.0,
    cost: '12s',
  },
];

export const NonEIP1559: FC<Props> = ({ className, gasPriceLevel, onChange, ...rest }) => {
  return (
    <div className={classnames(className, styles.nonEip1559)} {...rest}>
      {levels.map((level) => (
        <Button
          key={level.id}
          className={styles.option}
          fullWidth
          colorScheme={gasPriceLevel === level.id ? 'primary' : 'light'}
          onClick={() => onChange?.({ level: level.id, gasPrice: level.gas })}
        >
          {level.label} ( {level.gas} gwei) ~{level.cost}
        </Button>
      ))}

      <div className={styles.custom}>
        <Input fullWidth size="large" rightAddon={<span>Gwei</span>} placeholder="Custom" />
      </div>
    </div>
  );
};
