import { Button, LoadingIcon, PickerDialog, PickerDialogProps, TokenIcon } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { useBalance, useERC20Approve, useGetERC20Allowance, useTrackTokenPrice } from '@/hooks';
import { useGetERC20TokenInfo } from '@/hooks/useGetERC20TokenInfo';
import { getCoingeckoTokenId, TokenType, ZERO, ZERO_ADDRESS } from '@/lib';
import { BoxPayment, ExtendedBoxInfo } from '@/types';
import { formatAddres, formatBalance } from '@/utils';
import { BigNumber, utils } from 'ethers';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AdjustableInput } from './AdjustableInput';
import { useOpenBox } from './useOpenBox';
import styles from './index.module.less';

interface Props extends PickerDialogProps {
  boxId: string;
  box: Partial<ExtendedBoxInfo>;
  onShare?: () => void;
  payment: BoxPayment;
}

const paymentTokenIndex = 0;
export const BuyBox: FC<Props> = ({ boxId, box, payment: payment, ...rest }) => {
  const { account } = useWeb3Context();
  const { contractAddress } = useMBoxContract();
  const getERC20Token = useGetERC20TokenInfo();
  const getAllowance = useGetERC20Allowance();
  const approve = useERC20Approve();
  const balance = useBalance(payment.token_addr);
  const [paymentToken, setPaymentToken] = useState<TokenType | null>(null);
  const isNative = payment.token_addr === ZERO_ADDRESS;
  console.log({ payment, isNative });
  const tokenPrice = useTrackTokenPrice(
    paymentToken?.symbol ? getCoingeckoTokenId(paymentToken.symbol) : null,
  );
  const [allowance, setAllowance] = useState<BigNumber>(ZERO);
  console.log({ allowance: allowance.toString() });
  useEffect(() => {
    getAllowance(payment.token_addr, contractAddress).then(setAllowance);
  }, [payment.token_addr, contractAddress]);
  const [quantity, setQuantity] = useState(1);
  const costAmount = payment.price.mul(quantity);
  const allowed = isNative || allowance.gte(costAmount);
  const canBuy = isNative ? balance.gt(costAmount) : allowed;

  useEffect(() => {
    if (payment) {
      getERC20Token(payment.token_addr).then((token) => {
        if (token) {
          setPaymentToken(token);
        }
      });
    }
  }, [payment.token_addr]);

  const cost = useMemo(() => {
    return paymentToken ? utils.formatUnits(costAmount, paymentToken.decimals) : null;
  }, [paymentToken, costAmount]);

  const handleApprove = useCallback(async () => {
    const tx = await approve(payment.token_addr, contractAddress, costAmount);
    await tx.wait(1);
    await getAllowance(payment.token_addr, contractAddress).then(setAllowance);
  }, [approve, payment.token_addr, contractAddress, costAmount, getAllowance]);

  const openBox = useOpenBox(boxId, quantity, payment, paymentTokenIndex);
  const limit = box.personal_limit || 1;

  return (
    <PickerDialog {...rest} className={styles.buyBox} title="Buy">
      <dl className={styles.infos}>
        <dt className={styles.cost}>
          <div className={styles.currency}>
            <strong className={styles.value}>{cost}</strong>
            <span className={styles.unit}>{paymentToken?.symbol}</span>
          </div>
          {isNative && cost && (
            <div className={styles.estimate}>~${parseFloat(cost) * tokenPrice}</div>
          )}
        </dt>
        <dd className={styles.meta}>
          <span className={styles.metaName}>MaskBox:</span>
          <AdjustableInput
            className={styles.metaValue}
            value={quantity}
            min={1}
            max={limit}
            onUpdate={setQuantity}
          />
        </dd>
        <dd className={styles.meta}>
          <span className={styles.metaName}>Quantity limit:</span>
          <span className={styles.metaValue} title={account}>
            {limit}
          </span>
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
            Allow MASKBOX to use your {paymentToken?.symbol}
          </Button>
        )}
        <Button
          className={styles.button}
          colorScheme="primary"
          fullWidth
          size="middle"
          disabled={!canBuy}
          onClick={openBox}
        >
          Draw
        </Button>
      </div>
    </PickerDialog>
  );
};
