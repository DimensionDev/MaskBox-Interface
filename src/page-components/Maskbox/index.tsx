import { Button, ButtonProps, Icon, Image, LoadingIcon, SNSShare, VideoPlayer } from '@/components';
import { RouteKeys } from '@/configs';
import { useWeb3Context } from '@/contexts';
import { BoxRSS3Node } from '@/contexts/RSS3Provider';
import { MaskBoxQuery } from '@/graphql-hooks';
import { useBalance, useERC20Token, useERC721 } from '@/hooks';
import { getNetworkColor, getNetworkExplorer, ZERO } from '@/lib';
import { BoxOnChain, MediaType } from '@/types';
import { formatAddres, formatBalance } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocales } from '../useLocales';
import { CountdownButton } from './CountdownButton';
import styles from './index.module.less';

export interface MaskboxProps extends HTMLProps<HTMLDivElement> {
  boxOnSubgraph: MaskBoxQuery['maskbox'];
  boxOnChain: Partial<BoxOnChain> | null;
  boxOnRSS3: Partial<Pick<BoxRSS3Node, 'name' | 'mediaType' | 'mediaUrl' | 'activities'>> | null;
  inList?: boolean;
  onPurchase?: () => void;
}

export const Maskbox: FC<MaskboxProps> = ({
  boxOnSubgraph,
  boxOnRSS3,
  boxOnChain,
  className,
  inList,
  onPurchase,
  ...rest
}) => {
  const t = useLocales();
  const box = useMemo(
    () => ({
      ...boxOnChain,
      ...boxOnRSS3,
      ...boxOnSubgraph,
      name: boxOnRSS3?.name ?? boxOnSubgraph?.name ?? boxOnChain?.name,
    }),
    [boxOnChain, boxOnRSS3, boxOnSubgraph],
  );
  const { holder_min_token_amount, holder_token_addr } = box;
  const chainId = box.chain_id;
  const boxId = box.box_id;
  const payment = box.payment?.[0];
  const history = useHistory();
  const paymentToken = useERC20Token(payment?.token_addr);
  const { isApproveAll, checkingApprove } = useERC721(box.nft_address, box.creator);
  const { ethersProvider, openConnectionDialog, isConnecting } = useWeb3Context();

  const startTime = box?.start_time ? new Date(box.start_time * 1000).getTime() : 0;
  const isStarted = box.started === true && startTime <= Date.now();

  const price = useMemo(() => {
    if (payment?.price && paymentToken?.decimals) {
      const digit = formatBalance(payment.price, paymentToken.decimals, 6);
      return `${digit} ${paymentToken.symbol}`;
    }
  }, [payment?.price, paymentToken?.decimals]);
  const isSoldout = useMemo(() => !!box.remaining?.eq(ZERO), [box.remaining]);
  const holderToken = useERC20Token(holder_token_addr);
  const holderTokenBalance = useBalance(holderToken?.address);
  const isQualified = useMemo(() => {
    return holder_min_token_amount?.eq(0) || holderTokenBalance.gte(holder_min_token_amount ?? 0);
  }, [holder_min_token_amount, holderTokenBalance]);

  const buttonText = useMemo(() => {
    if (ethersProvider) {
      if (isSoldout) return t('Sold out');
      if (box.expired) return t('Ended');
      if (!isApproveAll) return t('Canceled');
    }
    if (box.canceled) return t('Canceled');
    if (inList) return t('View Details');
    if (!ethersProvider) return t('Connect Wallet');

    if (!isQualified)
      return t(`Not enough {symbol} to draw`, { symbol: holderToken?.symbol ?? '??' });

    return price ? t('Draw ( {price}/Time )', { price }) : <LoadingIcon size={24} />;
  }, [inList, price, isSoldout, isApproveAll, t, isQualified, ethersProvider]);

  const boxLink = `${RouteKeys.Details}?chain=${chainId}&box=${boxId}`;
  const notReadyToView = !isStarted || isSoldout || box.expired || box.canceled || !isApproveAll;
  const allowToBuy = price && !notReadyToView && isQualified;
  const buttonProps: ButtonProps = {
    className: styles.drawButton,
    colorScheme: 'primary',
    disabled: inList ? notReadyToView : ethersProvider ? !allowToBuy : isConnecting,
    onClick: () => {
      if (inList) {
        history.push(boxLink);
      } else if (!ethersProvider) {
        openConnectionDialog?.();
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

  const creatorExplorerUrl = `${getNetworkExplorer(chainId!)}/address/${box.creator}`;

  const BoxCover = (
    <div className={styles.media}>
      {(() => {
        if (!box?.mediaUrl) return <Icon type="mask" size={48} />;

        switch (box.mediaType as MediaType) {
          case MediaType.Video:
            return <VideoPlayer src={box.mediaUrl} width="480" height="320" />;
          case MediaType.Audio:
            return <audio src={box.mediaUrl} controls />;
          default:
            return (
              <Image
                src={box.mediaUrl}
                alternative={<Icon type="mask" size={48} />}
                loading="lazy"
                width="480"
                height="320"
                alt={box.name ?? '-'}
              />
            );
        }
      })()}
    </div>
  );

  const name = box.name ?? '-';
  return (
    <div className={classnames(styles.maskbox, className)} {...rest}>
      {inList ? <Link to={boxLink}>{BoxCover}</Link> : BoxCover}
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name} title={box.name}>
            {inList ? <Link to={boxLink}>{name}</Link> : name}
          </dt>
          <dd className={styles.infoRow}>{t('Lucky Draw')}</dd>
          <dd className={styles.infoRow}>{t('Get your unique card (NFT) by lucky draw')}</dd>
          <dd className={styles.infoRow}>
            {total ? `${total.sub(box.remaining!).toString()}/${total.toString()}` : '-/-'}
          </dd>
          <dd className={styles.infoRow}>
            {t('Limit')} : {box.personal_limit?.toString()}
          </dd>
          {holder_min_token_amount?.gt(0) ? (
            <dd className={styles.infoRow}>
              {t('purchase-requirement', {
                amount: formatBalance(holder_min_token_amount ?? 0, holderToken?.decimals ?? 18, 6),
                symbol: holderToken?.symbol ?? '??',
              })}
            </dd>
          ) : null}
          {box.creator ? (
            <dd className={styles.infoRow}>
              {t('Creator')}
              {`: `}
              <a
                className={styles.creator}
                href={creatorExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={box.creator}
              >
                {formatAddres(box.creator)}
              </a>
            </dd>
          ) : null}
        </dl>
        {(() => {
          if (checkingApprove || isConnecting)
            return (
              <Button {...buttonProps} disabled>
                <LoadingIcon />
              </Button>
            );
          if (isStarted || box.canceled || !ethersProvider) {
            return <Button {...buttonProps}>{buttonText}</Button>;
          }
          return <CountdownButton {...buttonProps} startTime={startTime!} />;
        })()}
      </div>
      {inList ? null : (
        <SNSShare
          className={styles.snsShare}
          chainId={chainId!}
          boxId={boxId!}
          boxName={box.name ?? ''}
        />
      )}
    </div>
  );
};
