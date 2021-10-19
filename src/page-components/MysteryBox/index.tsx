import { Button, LoadingIcon } from '@/components';
import { useGetExtendedBoxInfo } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { TokenType } from '@/lib';
import { ExtendedBoxInfo } from '@/types';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, HTMLProps, useEffect, useMemo, useState } from 'react';
import { BuyBox } from '..';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onLoad'> {
  chainId: number;
  boxId: string;
  onLoad?: (box: Partial<ExtendedBoxInfo>) => void;
  inList?: boolean;
}

export const MysteryBox: FC<Props> = ({ chainId, boxId, className, onLoad, inList, ...rest }) => {
  const box = useGetExtendedBoxInfo(chainId, boxId);
  const getERC20Token = useGetERC20TokenInfo();
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  const payment = box.payment?.[0];
  const [buyBoxOpen, setBuyBoxOpen] = useState(false);

  useEffect(() => {
    if (box && onLoad) onLoad(box);
  }, [box, onLoad]);

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
    <>
      <div
        className={classnames(styles.mysteryBox, className, { [styles.inList]: inList })}
        {...rest}
      >
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
          <Button
            className={styles.drawButton}
            colorScheme="primary"
            disabled={!price}
            onClick={() => setBuyBoxOpen(true)}
          >
            {price ? `Draw( ${price}/Time )` : <LoadingIcon size={24} />}
          </Button>
        </div>
        {payment && (
          <BuyBox
            open={buyBoxOpen}
            onClose={() => setBuyBoxOpen(false)}
            boxId={boxId}
            box={box}
            payment={payment}
          />
        )}
      </div>
    </>
  );
};
