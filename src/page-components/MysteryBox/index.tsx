import { Button, ButtonProps, Icon, LoadingIcon, SNSShare } from '@/components';
import { MediaType } from '@/contexts';
import { useGetExtendedBoxInfo } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { TokenType, ZERO } from '@/lib';
import { ExtendedBoxInfo } from '@/types';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, HTMLProps, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CountdownButton } from './CountdownButton';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'onLoad'> {
  chainId: number;
  boxId: string;
  inList?: boolean;
  onLoad?: (box: Partial<ExtendedBoxInfo>) => void;
  onPurchase?: () => void;
}

export const MysteryBox: FC<Props> = ({
  chainId,
  boxId,
  className,
  inList,
  onLoad,
  onPurchase,
  ...rest
}) => {
  const box = useGetExtendedBoxInfo(chainId, boxId);
  const getERC20Token = useGetERC20TokenInfo();
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  const payment = box.payment?.[0];
  const history = useHistory();

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

  const startTime = box.start_time ? box.start_time * 1000 : undefined;
  const notStarted = box.started === false || (startTime && startTime > Date.now());

  const price = useMemo(() => {
    if (payment?.price && paymentToken?.decimals) {
      const digit = utils.formatUnits(payment.price, paymentToken.decimals);
      return `${digit} ${paymentToken.symbol}`;
    }
  }, [payment?.price, paymentToken?.decimals]);
  const isSoldout = useMemo(
    () => box.remaining !== undefined && box.remaining.eq(ZERO),
    [box.remaining],
  );

  const buttonText = useMemo(() => {
    if (isSoldout) return 'Sold out';
    if (box.expired) {
      return 'Ended';
    } else if (inList) {
      return 'View Details';
    }

    return price ? `Draw ( ${price}/Time )` : <LoadingIcon size={24} />;
  }, [inList, price, isSoldout]);

  const buttonProps: ButtonProps = {
    className: styles.drawButton,
    colorScheme: 'primary',
    disabled: !inList && (!price || notStarted || box.expired || isSoldout),
    onClick: () => {
      if (inList) {
        history.push(`/details?chain=${chainId}&box=${boxId}`);
      } else if (box.started && !box.expired && onPurchase) {
        onPurchase();
      }
    },
  };

  const total = useMemo(() => {
    // TODO If the box is set to sell all,
    // and the creator get a new NFT after creating the box
    // then remaining will be greater than total.
    // This will be fixed from the contract later
    if (box.total && box.remaining && box.remaining.gt(box.total)) {
      return box.remaining;
    }
    return box.total;
  }, [box.total, box.remaining]);

  const BoxCover = (
    <div className={styles.media}>
      {box.mediaUrl ? (
        (() => {
          switch (box.mediaType as MediaType) {
            case MediaType.Video:
              return <video src={box.mediaUrl} width="480" height="360" controls={!inList} />;
            case MediaType.Audio:
              return <audio src={box.mediaUrl} controls />;
            default:
              return (
                <img
                  src={box.mediaUrl}
                  loading="lazy"
                  width="480"
                  height="360"
                  alt={box.name ?? '-'}
                />
              );
          }
        })()
      ) : (
        <Icon type="mask" size={48} />
      )}
    </div>
  );

  return (
    <div
      className={classnames(styles.mysteryBox, className, { [styles.inList]: inList })}
      {...rest}
    >
      {inList ? <Link to={`/details?chain=${chainId}&box=${boxId}`}>{BoxCover}</Link> : BoxCover}
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name} title={box.name}>
            {box.name ?? '-'}
          </dt>
          <dd className={styles.infoRow}>Lucky Draw</dd>
          <dd className={styles.infoRow}>Get your unique card (NFT) by lucky draw</dd>
          <dd className={styles.infoRow}>
            {total ? `${total.sub(box.remaining!).toString()}/${total.toString()}` : '-/-'}
          </dd>
          <dd className={styles.infoRow}>limit : {box.personal_limit?.toString()}</dd>
        </dl>
        {notStarted ? (
          <CountdownButton {...buttonProps} startTime={startTime!} />
        ) : (
          <Button {...buttonProps}>{buttonText}</Button>
        )}
      </div>
      {inList ? null : <SNSShare boxName={box.name ?? ''} className={styles.snsShare} />}
    </div>
  );
};
