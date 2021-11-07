import { Button, ButtonProps, useCountdown } from '@/components';
import { FC } from 'react';

interface Props extends ButtonProps {
  startTime: number;
}
function formatCountdown(options: Record<string, number>) {
  const paris = Object.keys(options).map((key) => {
    const val = options[key];
    if (val < 1) {
      return '';
    }
    return `${val} ${key}${val > 1 ? 's' : ''}`;
  });
  return paris.filter(Boolean).join(' ');
}

export const CountdownButton: FC<Props> = ({ startTime, ...rest }) => {
  const { days, hours, minutes, seconds } = useCountdown(startTime ?? 0);
  const buttonLabel = `Start Sale in ${formatCountdown({
    day: days,
    hour: hours,
    minute: minutes,
    sec: seconds,
  })}`;
  return <Button {...rest}>{buttonLabel}</Button>;
};
