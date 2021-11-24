import { Button, Dialog, DialogProps, Hint, LoadingIcon, TokenIcon } from '@/components';
import { useMaskboxAddress, usePurchasedNft, useWeb3Context } from '@/contexts';
import {
  useBalance,
  useERC20Approve,
  useERC20Token,
  useGetERC20Allowance,
  useHolderToken,
  useTrackTokenPrice,
} from '@/hooks';
import { getCoingeckoTokenId, TokenType, ZERO, ZERO_ADDRESS } from '@/lib';
import { BoxPayment, ExtendedBoxInfo } from '@/types';
import { formatAddres, formatBalance } from '@/utils';
import classnames from 'classnames';
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
  const getAllowance = useGetERC20Allowance();
  const approve = useERC20Approve();
  const balance = useBalance(payment.token_addr);
  const paymentToken = useERC20Token(payment.token_addr);
  const { decimals: tokenDecimals = 1, symbol: tokenSymbol } = paymentToken ?? {};
  const isNative = payment.token_addr === ZERO_ADDRESS;
  const tokenPrice = useTrackTokenPrice(tokenSymbol ? getCoingeckoTokenId(tokenSymbol) : null);
  const [allowance, setAllowance] = useState<BigNumber>(ZERO);
  useEffect(() => {
    getAllowance(payment.token_addr, contractAddress).then(setAllowance);
  }, [payment.token_addr, contractAddress]);

  const holderToken = useHolderToken();
  const balanceOfHolderToken = useBalance(holderToken?.address);

  const [quantity, setQuantity] = useState(1);
  const costAmount = payment.price.mul(quantity);
  const limit = box.personal_limit || 1;
  const allowed = isNative || allowance.gte(costAmount);

  const { holder_min_token_amount } = box;
  const qualified =
    holder_min_token_amount?.eq(0) || balanceOfHolderToken.gte(holder_min_token_amount ?? 0);

  const canBuy =
    (isNative ? balance.gt(costAmount) : allowed) &&
    purchasedNft.length + quantity <= limit &&
    qualified;
  const balaneEnough = isNative ? balance.gt(costAmount) : allowance.gt(costAmount);

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

  const buttonLabel = useMemo(() => {
    if (loading) return t('Drawing');
    if (holder_min_token_amount?.gt(0) && balanceOfHolderToken.lt(holder_min_token_amount)) {
      return t('Not enough ${symbol} to draw', { symbol: holderToken?.symbol ?? '??' });
    }
    return balaneEnough ? t('Draw') : t('Insufficient balance');
  }, [
    t,
    loading,
    holder_min_token_amount,
    holderToken?.symbol,
    balaneEnough,
    balanceOfHolderToken,
  ]);

  return (
    <Dialog {...rest} className={styles.buyBox} title={t('Draw') as string}>
      <dl className={styles.infos}>
        <dt className={styles.cost}>
          <div className={styles.currency}>
            <strong className={styles.value}>{cost}</strong>
            <span className={styles.unit}>{tokenSymbol}</span>
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
          <span
            className={styles.metaValue}
            title={`${formatBalance(balance, tokenDecimals, tokenDecimals)}${tokenSymbol}`}
          >
            {tokenDecimals ? (
              `${formatBalance(balance, tokenDecimals, 6)} ${tokenSymbol!}`
            ) : (
              <LoadingIcon size={24} />
            )}
          </span>
        </dd>
        {box.holder_min_token_amount?.gt(0) ? (
          <dd className={classnames(styles.meta, styles.requirement)}>
            {t('purchase-requirement', {
              amount: formatBalance(box.holder_min_token_amount, holderToken?.decimals ?? 18),
              symbol: holderToken?.symbol ?? '??',
            })}
          </dd>
        ) : null}
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
            {t('Allow MaskBox to use your {symbol}', { symbol: paymentToken?.symbol ?? '-' })}
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
          {buttonLabel}
        </Button>
      </div>
    </Dialog>
  );
};
