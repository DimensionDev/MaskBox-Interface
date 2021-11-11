import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { Button, Input } from '@/components';
import styles from './index.module.less';
import { ChainId } from '@/lib';

export enum GasPriceLevel {
  Rapid = 'rapid',
  Fast = 'fast',
  Medium = 'medium',
  Custom = 'custom',
}

const chainIdMap: Record<number, string> = {
  [ChainId.Mainnet]: 'eth',
  [ChainId.BSC]: 'bsc',
  [ChainId.xDai]: 'xdai',
  [ChainId.Matic]: 'matic',
  [ChainId.Arbitrum]: 'arb',
};

const getDebankChain = (chainId: number) => {
  return chainIdMap[chainId] ?? '';
};

export interface GasPriceRecord {
  estimated_seconds: number;
  front_tx_count: number;
  price: number;
}

export interface GasPriceDictResponse {
  data: {
    fast: GasPriceRecord;
    normal: GasPriceRecord;
    slow: GasPriceRecord;
    update_at: number;
  };
  error_code: number;
  _seconds: number;
}

export async function getGasPriceDict(chainId: ChainId) {
  const chain = getDebankChain(chainId);
  const url = `https://api.debank.com/chain/gas_price_dict_v2?chain=${chain}`;
  const response = await fetch(url);
  const result = await response.json();
  if (result.error_code === 0) {
    return result as GasPriceDictResponse;
  }
  return null;
}

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  gasPriceLevel: GasPriceLevel;
  onChange?: (result: { level: GasPriceLevel; gasPrice: number }) => void;
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
