import { Icon } from '@/components';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { FC } from 'react';
import styles from './adjustable.module.less';

interface Props {
  value: number;
  max?: number;
  min?: number;
  className?: string;
  onUpdate?: (val: number) => void;
}

export const AdjustableInput: FC<Props> = ({ value, min, max, className, onUpdate = noop }) => {
  return (
    <span className={classnames(styles.container, className)}>
      <Icon
        className={classnames(styles.button, styles.decrease, {
          [styles.disabled]: min && value <= min,
        })}
        type="decrease"
        role="button"
        onClick={() => {
          if (min && value <= min) return;
          onUpdate(value - 1);
        }}
      />
      <input
        className={styles.input}
        type="number"
        value={value}
        onChange={(evt) => {
          onUpdate(parseInt(evt.target.value));
        }}
      />
      <Icon
        className={classnames(styles.button, styles.increase, {
          [styles.disabled]: max && value >= max,
        })}
        type="increase"
        role="button"
        onClick={() => {
          if (max && value >= max) return;
          onUpdate(value + 1);
        }}
      />
    </span>
  );
};
