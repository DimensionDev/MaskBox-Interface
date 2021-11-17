import { Button, LoadingIcon, Dialog, DialogProps, TokenIcon } from '@/components';
import { useMaskboxAddress, usePurchasedNft, useWeb3Context } from '@/contexts';
import {
  useBalance,
  useERC20Approve,
  useGetERC20Allowance,
  useGetERC20TokenInfo,
  useTrackTokenPrice,
} from '@/hooks';
import { getCoingeckoTokenId, TokenType, ZERO, ZERO_ADDRESS } from '@/lib';
import { BoxPayment, ExtendedBoxInfo } from '@/types';
import { formatAddres, formatBalance } from '@/utils';
import { BigNumber, utils } from 'ethers';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import { AdjustableInput } from './AdjustableInput';
import styles from './index.module.less';
import { useOpenBox } from './useOpenBox';

export interface BuyBoxProps extends DialogProps {
  boxId: string;
  box: Partial<ExtendedBoxInfo>;
  payment: BoxPayment;
  onPurchased?: ({ boxId, nftIds }: { boxId: string; nftIds: string[] }) => void;
}

const paymentTokenIndex = 0;
export const BuyBox: FC<BuyBoxProps> = ({ boxId, box, payment: payment, onPurchased, ...rest }) => {
  const t = useLocales();
  const { account } = useWeb3Context();
  const purchasedNft = usePurchasedNft(boxId, account);
  const contractAddress = useMaskboxAddress();
  const getERC20Token = useGetERC20TokenInfo();
  const getAllowance = useGetERC20Allowance();
  const approve = useERC20Approve();
  const balance = useBalance(payment.token_addr);
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  const isNative = payment.token_addr === ZERO_ADDRESS;
  const tokenPrice = useTrackTokenPrice(
    paymentToken?.symbol ? getCoingeckoTokenId(paymentToken.symbol) : null,
  );
  const [allowance, setAllowance] = useState<BigNumber>(ZERO);
  useEffect(() => {
    getAllowance(payment.token_addr, contractAddress).then(setAllowance);
  }, [payment.token_addr, contractAddress]);
  const [quantity, setQuantity] = useState(1);
  const costAmount = payment.price.mul(quantity);
  const limit = box.personal_limit || 1;
  const allowed = isNative || allowance.gte(costAmount);
  const canBuy =
    (isNative ? balance.gt(costAmount) : allowed) && purchasedNft.length + quantity <= limit;
  const balaneEnough = isNative ? balance.gt(costAmount) : allowance.gt(costAmount);

  useEffect(() => {
    if (!payment.token_addr) return;
    getERC20Token(payment.token_addr).then((token) => {
      if (token) {
        setPaymentToken(token);
      }
    });
  }, [payment.token_addr]);

  const cost = useMemo(() => {
    return paymentToken ? utils.formatUnits(costAmount, paymentToken.decimals) : null;
  }, [paymentToken, costAmount]);

  const handleApprove = useCallback(async () => {
    const tx = await approve(payment.token_addr, contractAddress, costAmount);
    await tx.wait(1);
    await getAllowance(payment.token_addr, contractAddress).then(setAllowance);
  }, [approve, payment.token_addr, contractAddress, costAmount, getAllowance]);

  const { open: openBox, loading } = useOpenBox(boxId, quantity, payment, paymentTokenIndex);
  const handleDraw = useCallback(async () => {
    const result = await openBox();
    if (result && onPurchased) {
      onPurchased(result);
    }
  }, [openBox, onPurchased]);

  return (
    <Dialog {...rest} className={styles.buyBox} title={t('Draw') as string}>
      <dl className={styles.infos}>
        <dt className={styles.cost}>
          <div className={styles.currency}>
            <strong className={styles.value}>{cost}</strong>
            <span className={styles.unit}>{paymentToken?.symbol}</span>
          </div>
          {isNative && cost && (
            <div className={styles.estimate}>≈ $ {parseFloat(cost) * tokenPrice}</div>
          )}
        </dt>
        <dd className={styles.meta}>
          <span className={styles.metaName}>{t('MaskBox')}:</span>
          <AdjustableInput
            className={styles.metaValue}
            value={quantity}
            min={1}
            max={limit}
            disabled={loading}
            onUpdate={setQuantity}
          />
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>{t('Quantity limit')}:</span>
          <span className={styles.metaValue}>{limit}</span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>{t('Available amount')}:</span>
          <span className={styles.metaValue} title={account}>
            {limit - purchasedNft.length} / {limit}
          </span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>{t('Current Wallet')}:</span>
          <span className={styles.metaValue} title={account}>
            {account ? formatAddres(account) : '-'}
          </span>
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>{t('Available')}</span>
          <span className={styles.metaValue}>
            {paymentToken?.decimals ? (
              `${formatBalance(balance, paymentToken.decimals, 6)} ${paymentToken?.symbol}`
            ) : (
              <LoadingIcon size={24} />
            )}
          </span>
        </dd>
      </dl>

      <div className={styles.buttonGroup}>
        {!allowed && (
          <Button
            className={styles.button}
            colorScheme="primary"
            fullWidth
            size="middle"
            onClick={handleApprove}
          >
            <TokenIcon className={styles.tokenIcon} token={paymentToken ?? ({} as TokenType)} />
            {t('Allow MASKBOX to use your {symbol}', { symbol: paymentToken?.symbol ?? '-' })}
          </Button>
        )}
        <Button
          className={styles.button}
          colorScheme="primary"
          fullWidth
          size="middle"
          disabled={!canBuy || loading}
          onClick={handleDraw}
        >
          {loading ? t('Drawing') : balaneEnough ? t('Draw') : t('Insufficient balance')}
        </Button>
      </div>
    </Dialog>
  );
};
