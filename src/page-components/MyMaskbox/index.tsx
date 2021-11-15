import { Badge, Button, Icon, showToast, SNSShare, VideoPlayer } from '@/components';
import { RouteKeys } from '@/configs';
import { useBoxOnRSS3 } from '@/contexts';
import { MaskBoxesOfQuery } from '@/graphql-hooks';
import { useBoxInfo, useCancelBox, useGetERC20TokenInfo } from '@/hooks';
import { TokenType } from '@/lib';
import { MediaType } from '@/types';
import classnames from 'classnames';
import { format } from 'date-fns';
import { utils } from 'ethers';
import { FC, HTMLProps, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  boxOnSubgraph: MaskBoxesOfQuery['maskboxes'][number];
}

const formatTime = (time: number) => format(new Date(time * 1000), 'yyyy.MM.dd hh:mm');

export const MyMaskbox: FC<Props> = ({ className, boxOnSubgraph, ...rest }) => {
  const t = useLocales();

  const { box: boxOnChain } = useBoxInfo(boxOnSubgraph?.box_id);
  const cancelBox = useCancelBox();

  const boxOnRSS3 = useBoxOnRSS3(boxOnSubgraph?.creator, boxOnSubgraph?.box_id);

  const box = useMemo(
    () => ({
      ...boxOnChain,
      ...boxOnRSS3,
      ...boxOnSubgraph,
      name: boxOnRSS3.name ?? boxOnSubgraph.name ?? boxOnChain?.name,
    }),
    [boxOnChain, boxOnRSS3, boxOnSubgraph],
  );
  const getERC20Token = useGetERC20TokenInfo();
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  const payment = box.payment?.[0];
  useEffect(() => {
    if (payment) {
      getERC20Token(payment.token_addr).then((token) => {
        if (token) {
          setPaymentToken(token);
        }
      });
    }
  }, [payment]);

  const { unitPrice, totalPrice } = useMemo(() => {
    if (payment?.price && paymentToken?.decimals) {
      const amount = box.sold_nft_list.length;
      const { decimals, symbol } = paymentToken;
      return {
        unitPrice: `${utils.formatUnits(payment.price, decimals)} ${symbol}`,
        totalPrice: `${utils.formatUnits(payment.price.mul(amount), decimals)} ${symbol}`,
      };
    }
    return {};
  }, [payment?.price, paymentToken?.decimals, box.sold_nft_list.length]);

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

  const history = useHistory();

  const cancel = useCallback(async () => {
    try {
      await cancelBox(box.box_id);
    } catch (err: any) {
      showToast({
        title: 'Cancel Maskbox',
        message: `Failed to cancel this Maskbox ${err.message}`,
        variant: 'error',
      });
    }
  }, [cancelBox, box.box_id]);

  const BoxCover = (
    <div className={styles.media}>
      {(() => {
        if (!box?.mediaUrl) return <Icon type="mask" size={48} />;

        switch (box.mediaType as MediaType) {
          case MediaType.Video:
            return <VideoPlayer src={box.mediaUrl} width="100%" height="100%" />;
          case MediaType.Audio:
            return <audio src={box.mediaUrl} controls />;
          default:
            return (
              <img
                src={box.mediaUrl}
                loading="lazy"
                width="100%"
                height="100%"
                alt={box.name ?? '-'}
              />
            );
        }
      })()}
    </div>
  );

  const badgeLabel = useMemo(() => {
    if (box.expired) return 'Ended';
    if (box.canceled) return 'Canceled';
    return box.start_time * 1000 < Date.now() ? 'Opened' : 'Coming soon';
  }, [box.started, box.expired]);

  return (
    <div className={classnames(className, styles.maskbox)} {...rest}>
      <Link to={`${RouteKeys.Details}?chain=${box.chain_id}&box=${box.box_id}`}>{BoxCover}</Link>
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name} title={box.name}>
            {box.name ?? '-'}
          </dt>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>{t('Price')}:</span>
            <span className={styles.rowValue}>{unitPrice}</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>{t('Sold')}:</span>
            <span className={styles.rowValue}>
              {total ? `${total.sub(box.remaining!).toString()}/${total.toString()}` : '-/-'}
            </span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>{t('Sold Total')}:</span>
            <span className={styles.rowValue}>{totalPrice}</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Limit:</span>
            <span className={styles.rowValue}>{box.personal_limit}</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>{t('Date')}:</span>
            <span className={styles.rowValue}>
              {`${formatTime(box.start_time)} ~ ${formatTime(box.end_time)}`}
            </span>
            <Badge
              className={styles.statusBadge}
              colorScheme={badgeLabel === 'Opened' ? 'success' : undefined}
            >
              {badgeLabel}
            </Badge>
          </dd>
        </dl>
        {!box.canceled && (
          <div className={styles.operations}>
            <Button
              colorScheme="primary"
              onClick={() => {
                history.push(`${RouteKeys.Edit}/desc?chain=${box.chain_id}&box=${box.box_id}`);
              }}
            >
              {t('Edit Details')}
            </Button>
            {box.started === false ? (
              <Button colorScheme="danger" onClick={cancel}>
                {t('Cancel')}
              </Button>
            ) : null}
            <SNSShare boxName={box.name} />
          </div>
        )}
      </div>
    </div>
  );
};
