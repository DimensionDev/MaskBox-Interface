import { Button, Dialog, DialogProps, LoadingIcon, TokenIcon, showToast } from '@/components';
import { useMaskboxAddress, usePurchasedNft, useWeb3Context } from '@/contexts';
import {
  useBalance,
  useERC20Approve,
  useERC20Token,
  useGetERC20Allowance,
  useTrackTokenPrice,
} from '@/hooks';
import { getCoingeckoTokenId, TokenType, ZERO, ZERO_ADDRESS } from '@/lib';
import { BoxPayment, ExtendedBoxInfo } from '@/types';
import { formatAddres, formatBalance, useBoolean } from '@/utils';
import classnames from 'classnames';
import { BigNumber, utils } from 'ethers';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocales } from '../useLocales';
import { AdjustableInput } from './AdjustableInput';
import styles from './index.module.less';
import { useOpenBox } from './useOpenBox';

export interface BuyBoxProps extends DialogProps {
  boxId: string;
  proof?: string;
  box: Partial<ExtendedBoxInfo>;
  payment: BoxPayment;
  onPurchased?: ({ boxId, nftIds }: { boxId: string; nftIds: string[] }) => void;
}

const paymentTokenIndex = 0;
export const BuyBox: FC<BuyBoxProps> = ({
  boxId,
  box,
  payment: payment,
  onPurchased,
  proof,
  ...rest
}) => {
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

  const holderToken = useERC20Token(box.holder_token_addr);
  const balanceOfHolderToken = useBalance(holderToken?.address);

  const [quantity, setQuantity] = useState(1);
  const costAmount = payment.price.mul(quantity);
  const limit = box.personal_limit || 1;
  const allowed = isNative || allowance.gte(costAmount);

  const { holder_min_token_amount } = box;
  const qualified =
    holder_min_token_amount?.eq(0) || balanceOfHolderToken.gte(holder_min_token_amount ?? 0);

  const balanceEnough = balance.gt(costAmount);
  const allowanceEnough = allowance.gte(costAmount);
  const isEnough = isNative ? balanceEnough : allowanceEnough;
  const canBuy = isEnough && purchasedNft.length + quantity <= limit && qualified;

  const cost = useMemo(() => {
    return paymentToken ? utils.formatUnits(costAmount, paymentToken.decimals) : null;
  }, [paymentToken, costAmount]);

  const [isApproving, setApproving, setNotApproving] = useBoolean();
  const handleApprove = useCallback(async () => {
    setApproving();
    try {
      const tx = await approve(payment.token_addr, contractAddress, costAmount);
      await tx.wait(1);
      await getAllowance(payment.token_addr, contractAddress).then(setAllowance);
    } catch (err) {
      console.log('Fails to approve', err);
    } finally {
      setNotApproving();
    }
  }, [approve, payment.token_addr, contractAddress, costAmount, getAllowance]);

  const { open: openBox, loading } = useOpenBox(boxId, quantity, payment, paymentTokenIndex);

  const handleDraw = useCallback(async () => {
    const result = await openBox(proof ?? '0x00');
    if (result && onPurchased) {
      onPurchased(result);
    }
  }, [openBox, onPurchased]);

  const buttonLabel = useMemo(() => {
    if (loading) return t('Drawing');
    if (holder_min_token_amount?.gt(0) && balanceOfHolderToken.lt(holder_min_token_amount)) {
      return t('Not enough ${symbol} to draw', { symbol: holderToken?.symbol ?? '??' });
    }
    if (!balanceEnough) return t('Insufficient balance');
    if (isNative) return t('Draw');
    return allowanceEnough ? t('Draw') : t('Insufficient allowance');
  }, [
    t,
    loading,
    holder_min_token_amount,
    holderToken?.symbol,
    allowanceEnough,
    isNative,
    balanceEnough,
    balanceOfHolderToken,
  ]);

  const personalRemaining = limit - purchasedNft.length;
  const availableAmount = box.remaining?.lt(personalRemaining)
    ? box.remaining.toNumber()
    : personalRemaining;

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
            max={availableAmount}
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
            {availableAmount} / {box.total?.toString()}
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
            disabled={isApproving}
          >
            <TokenIcon className={styles.tokenIcon} token={paymentToken ?? ({} as TokenType)} />
            {isApproving
              ? t('Approving...')
              : t('Allow MaskBox to use your {symbol}', { symbol: paymentToken?.symbol ?? '-' })}
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
