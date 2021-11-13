import { Badge, Button, Icon, VideoPlayer } from '@/components';
import { useBoxOnRSS3, useMBoxContract } from '@/contexts';
import { MaskBoxesOfQuery } from '@/graphql-hooks';
import { BoxOnChain, MediaType } from '@/types';
import classnames from 'classnames';
import { FC, HTMLProps, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  boxOnSubgraph: MaskBoxesOfQuery['maskboxes'][number];
}

export const MyMaskbox: FC<Props> = ({ className, boxOnSubgraph, ...rest }) => {
  const t = useLocales();

  const { getBoxInfo } = useMBoxContract();
  const [boxOnChain, setBoxOnChain] = useState<BoxOnChain | null>(null);
  useEffect(() => {
    if (!boxOnSubgraph) return;
    if (boxOnSubgraph.box_id) {
      getBoxInfo(boxOnSubgraph.box_id).then(setBoxOnChain);
    }
  }, []);

  const boxOnRSS3 = useBoxOnRSS3(boxOnSubgraph?.creator, boxOnSubgraph?.box_id);

  const box = useMemo(
    () => ({
      ...boxOnChain,
      ...boxOnRSS3,
      ...boxOnSubgraph,
    }),
    [boxOnChain, boxOnRSS3, boxOnSubgraph],
  );

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
  return (
    <div className={classnames(className, styles.maskbox)} {...rest}>
      {BoxCover}
      <div className={styles.interaction}>
        <dl className={styles.infoList}>
          <dt className={styles.name} title={box.name}>
            {box.name ?? '-'}
          </dt>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Price:</span>
            <span className={styles.rowValue}>200 USDT</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Sold:</span>
            <span className={styles.rowValue}>0/50</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Sold Total:</span>
            <span className={styles.rowValue}>4600 USDT</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Limit:</span>
            <span className={styles.rowValue}>5</span>
          </dd>
          <dd className={styles.infoRow}>
            <span className={styles.rowName}>Date:</span>
            <span className={styles.rowValue}>2012.11.23 23:20 ~ 2012.11.25 23:20</span>
            <Badge className={styles.statusBadge}>Coming soon</Badge>
          </dd>
        </dl>
        <div className={styles.operations}>
          <Button colorScheme="primary">Edit Details</Button>
          <Button colorScheme="danger">Cancel</Button>
          <Button>Share to Twitter</Button>
        </div>
      </div>
    </div>
  );
};
