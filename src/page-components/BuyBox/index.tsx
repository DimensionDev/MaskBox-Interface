import { Dialog, DialogProps, Icon, RoundButton, showToast } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { useTrackTokenPrice } from '@/hooks';
import { getCoingeckoTokenId, getNetworkExplorer } from '@/lib';
import { formatAddres } from '@/utils';
import { utils } from 'ethers';
import { FC, useCallback } from 'react';
import styles from './index.module.less';

interface Props extends DialogProps {
  onShare?: () => void;
}

export const BuyBox: FC<Props> = ({ ...rest }) => {
  const { account, ethersProvider } = useWeb3Context();
  const { collectionPrice: price, myAllowance, myBalance, approve, buy } = useMBoxContract();
  const tokenPrice = useTrackTokenPrice(getCoingeckoTokenId(price.symbol));
  const cost = utils.formatUnits(price.value, price.decimals);
  const allowed = !price.isNative && myAllowance.gte(price.value);
  const canBuy = (price.isNative && myBalance.gte(price.value)) || allowed;

  const handleApprove = useCallback(() => {
    approve();
  }, [approve]);

  const chainId = ethersProvider?.network?.chainId;

  const handleBuy = useCallback(async () => {
    showToast({
      title: 'Buying',
      message: 'Sending transaction',
    });
    const result = await buy();
    const exploreUrl = chainId ? getNetworkExplorer(chainId) + result?.hash : '';
    console.log('buy result', result);
    showToast({
      title: 'Transaction sent',
      message: (
        <span>
          Transaction Submitted{' '}
          <a
            href={exploreUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="view transaction"
          >
            <Icon type="external" size={18} />
          </a>
        </span>
      ),
    });
  }, [buy, chainId]);

  return (
    <Dialog {...rest} className={styles.buyBox} title="Buy">
      <dl className={styles.infos}>
        <dt className={styles.cost}>
          <div className={styles.currency}>
            <strong className={styles.value}>{cost}</strong>
            <span className={styles.unit}>{price.symbol}</span>
          </div>
          <div className={styles.estimate}>
            ~$
            {parseFloat(cost) * tokenPrice}
          </div>
        </dt>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Mystery Box:</span>
          <span className={styles.metaValue}>1</span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Current Wallet:</span>
          <span className={styles.metaValue} title={account}>
            {account ? formatAddres(account) : '-'}
          </span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Available</span>
          <span className={styles.metaValue}>
            {utils.formatUnits(myBalance, price.decimals)} {price.symbol}
          </span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Gas fee</span>
          <span className={styles.metaValue}>0.001 ETH</span>
        </dd>
      </dl>

      <div className={styles.buttonGroup}>
        {!allowed && (
          <RoundButton className={styles.button} fullWidth size="large" onClick={handleApprove}>
            Allow NFTBOX to use your {price.symbol}
          </RoundButton>
        )}
        <RoundButton
          className={styles.button}
          fullWidth
          size="large"
          disabled={!canBuy}
          onClick={handleBuy}
        >
          Buy
        </RoundButton>
      </div>
    </Dialog>
  );
};
