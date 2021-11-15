import {
  Badge,
  Button,
  Icon,
  PickerDialog,
  showToast,
  SNSShare,
  useDialog,
  VideoPlayer,
} from '@/components';
import { RouteKeys } from '@/configs';
import { useBoxOnRSS3 } from '@/contexts';
import { MaskBoxesOfQuery } from '@/graphql-hooks';
import { useBoxInfo, useCancelBox, useERC20Token, useERC721Token } from '@/hooks';
import { MediaType } from '@/types';
import { formatToLocale, toLocalUTC, TZOffsetLabel } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, HTMLProps, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  boxOnSubgraph: MaskBoxesOfQuery['maskboxes'][number];
}

const formatTime = (time: number) => formatToLocale(new Date(time * 1000), 'yyyy-MM-dd hh:mm');

export const MyMaskbox: FC<Props> = ({ className, boxOnSubgraph, ...rest }) => {
  const t = useLocales();

  const { box: boxOnChain } = useBoxInfo(boxOnSubgraph?.box_id);
  const cancelBox = useCancelBox();
  const [cancelDialogVisible, openCancelDialog, closeCancelDialog] = useDialog();
  const [editDialogVisible, openEditDialog, closeEditDialog] = useDialog();

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
  const payment = box.payment?.[0];
  const paymentToken = useERC20Token(payment?.token_addr);
  const erc721Token = useERC721Token(box.nft_address);

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
    } finally {
      closeCancelDialog();
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
    return toLocalUTC(box.start_time * 1000).getTime() < Date.now() ? 'Opened' : 'Coming soon';
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
            <Button colorScheme="primary" onClick={openEditDialog}>
              {t('Edit Details')}
            </Button>
            {box.started === false ? (
              <Button colorScheme="danger" onClick={openCancelDialog}>
                {t('Cancel')}
              </Button>
            ) : null}
            <SNSShare boxName={box.name} />
          </div>
        )}
      </div>
      {!box.canceled && box.started === false ? (
        <PickerDialog
          className={styles.cancelDialog}
          title={t('Cancel issue')}
          open={cancelDialogVisible}
          onClose={closeCancelDialog}
        >
          <ul className={styles.infoList}>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>{t('Mystery box name')}</span>
              <span className={styles.rowVale}>{t('Saint Seiya')}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>{t('Price per box')}</span>
              <span className={styles.rowVale}>{unitPrice}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>{t('Limit per wallet')}</span>
              <span className={styles.rowVale}>{box.personal_limit}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>{t('NFT Contract ')}</span>
              <span className={styles.rowVale}>{erc721Token?.name}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>{t('NFT Amount')}</span>
              <span className={styles.rowVale}>{box.total?.toString()}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>
                {t('Start date({offset})', { offset: TZOffsetLabel })}
              </span>
              <span className={styles.rowVale}>{formatTime(box.start_time)}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.rowName}>
                {t('End date({offset})', { offset: TZOffsetLabel })}
              </span>
              <span className={styles.rowVale}>{formatTime(box.end_time)}</span>
            </li>
          </ul>
          <div className={styles.buttons}>
            <Button
              className={styles.button}
              fullWidth
              colorScheme="light"
              size="large"
              onClick={closeCancelDialog}
            >
              Cancel
            </Button>
            <Button
              className={styles.button}
              fullWidth
              colorScheme="danger"
              size="large"
              onClick={cancel}
            >
              Confirm
            </Button>
          </div>
        </PickerDialog>
      ) : null}

      <PickerDialog
        className={styles.editDialog}
        open={editDialogVisible}
        title="Edit details"
        onClose={closeEditDialog}
      >
        <div className={styles.texts}>
          As the contract has been created, you can only edit the off-chain details such as
          mysterybox name, thumbnail and descreption.
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.button}
            fullWidth
            colorScheme="light"
            size="large"
            onClick={closeEditDialog}
          >
            Cancel
          </Button>
          <Button
            className={styles.button}
            fullWidth
            colorScheme="primary"
            size="large"
            onClick={() => {
              history.push(`${RouteKeys.Edit}/desc?chain=${box.chain_id}&box=${box.box_id}`);
            }}
          >
            Confirm
          </Button>
        </div>
      </PickerDialog>
    </div>
  );
};
