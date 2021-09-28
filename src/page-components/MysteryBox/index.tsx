import { LoadingIcon, showToast, ThickButton } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { Price } from '@/lib';
import classnames from 'classnames';
import { utils } from 'ethers';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';

interface Props {
  price: Price;
  onOpen?: () => void;
}

export const MysteryBox: FC<Props> = ({ price, onOpen }) => {
  const [opened, setOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const paintingRef = useRef<HTMLDivElement>(null);
  const { account, connectWeb3 } = useWeb3Context();
  const { claim } = useMBoxContract();

  useEffect(() => {
    if (!paintingRef.current) {
      return;
    }
    const animationendFn = () => {
      setOpened(true);
      setTimeout(() => {
        onOpen?.();
      }, 200);
    };
    const paintingEle = paintingRef.current;
    paintingEle.addEventListener('animationend', animationendFn);
    return () => {
      paintingEle.removeEventListener('animationend', animationendFn);
    };
  }, [paintingRef.current, onOpen]);

  const handleClaim = async () => {
    const closeToast = showToast({
      title: 'Claiming',
    });
    await claim();
    closeToast();
    showToast({
      title: 'Claimed',
      message: 'NFT claimed',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.boxGroup}>
        <div className={classnames(styles.comp, styles.lisa)} />
        <div className={classnames(styles.comp, styles.sunflower)} />
        <div className={classnames(styles.comp, styles.box)} />
        <div
          ref={paintingRef}
          className={classnames(styles.comp, styles.painting, open ? styles.open : null)}
        >
          {opened && (
            <div className={styles.spinner}>
              <LoadingIcon size={30} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <p className={styles.value}>
          {utils.formatUnits(price.value, price.decimals)} {price.symbol}
        </p>
        {account ? (
          <ThickButton className={styles.button} onClick={handleClaim}>
            Open Mystery Boxes
          </ThickButton>
        ) : (
          <ThickButton className={styles.button} onClick={connectWeb3}>
            Connect Wallet
          </ThickButton>
        )}
      </div>
    </div>
  );
};
