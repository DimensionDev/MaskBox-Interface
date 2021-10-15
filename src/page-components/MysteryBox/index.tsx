import { Button, LoadingIcon } from '@/components';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { TokenType } from '@/lib';
import { ExtendedBoxInfo } from '@/types';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, HTMLProps, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  box: Partial<ExtendedBoxInfo>;
}

export const MysteryBox: FC<Props> = ({ className, box, ...rest }) => {
  const getERC20Token = useGetERC20TokenInfo();
  const payment = box.payment?.[0];
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  useEffect(() => {
    if (payment) {
      getERC20Token(payment.token_addr).then((token) => {
        if (token) {
          setPaymentToken(token);
        }
      });
    }
  }, [payment]);
  const price = useMemo(() => {
    if (payment?.price && paymentToken?.decimals) {
      const digit = utils.formatUnits(payment.price, paymentToken.decimals);
      return `${digit} ${paymentToken.symbol}`;
    }
  }, [payment?.price, paymentToken?.decimals]);
  return (
    <div className={classnames(styles.mysteryBox, className)} {...rest}>
      <div className={styles.media}>
        {box.cover ? (
          <img src={box.cover} width="480" height="360" alt={box.name ?? '-'} />
        ) : (
          <LoadingIcon size={50} />
        )}
      </div>
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name}>{box.name ?? -''}</dt>
          <dd className={styles.infoRow}>Lucky Draw</dd>
          <dd className={styles.infoRow}>Get your unique card (NFT) by lucky draw</dd>
          <dd className={styles.infoRow}>
            {box.total
              ? `${box.total.sub(box.remaining!).toString()}/${box.total.toString()}`
              : '-/-'}
          </dd>
          <dd className={styles.infoRow}>limit : {box.personal_limit?.toString()}</dd>
        </dl>
        <Button className={styles.drawButton} colorScheme="primary" disabled={!price}>
          {price ? `Draw( ${price}/Time )` : <LoadingIcon size={24} />}
        </Button>
      </div>
    </div>
  );
};
