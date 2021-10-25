import { Button, Field, Icon, Input, NFTSelectList, showToast, TokenIcon } from '@/components';
import { useRSS3, useWeb3Context } from '@/contexts';
import { useTokenList } from '@/hooks';
import { NFTPickerDialog, TokenPickerDialog } from '@/page-components';
import { isSameAddress } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  formDataAtom,
  readyToCreateAtom,
  useBindFormField,
  useUpdateFormField,
  validationsAtom,
} from './atoms';
import { useCreateMysteryBox } from './hooks';
import styles from './index.module.less';
import { useEdit } from './useEdit';

const timezoneOffset = -new Date().getTimezoneOffset() / 60;

export const Meta: FC = () => {
  const history = useHistory();
  const formData = useAtomValue(formDataAtom);
  const isReady = useAtomValue(readyToCreateAtom);
  const validations = useAtomValue(validationsAtom);
  const bindField = useBindFormField();
  const updateField = useUpdateFormField();
  const { providerChainId } = useWeb3Context();
  const [nftPickerVisible, setNftPickerVisible] = useState(false);
  const [tokenBoxVisible, setTokenBoxVisible] = useState(false);

  const createBox = useCreateMysteryBox();
  const { isApproveAll, approveAll, checkingApprove, ownedTokens } = useEdit();

  const { saveBox } = useRSS3();
  const create = useCallback(async () => {
    if (!isReady || validations.length) {
      validations.forEach((validation) => {
        showToast({
          title: validation,
          variant: 'error',
        });
      });
      return;
    }
    const closeToast = showToast({
      title: 'Creating Mystery Box',
      processing: true,
      duration: Infinity,
    });
    try {
      const result = await createBox();
      if (result) {
        const { args } = result;
        await saveBox({
          id: args.box_id.toString(),
          name: args.name,
          cover: formData.cover,
          activities: formData.activities,
        });
        history.replace(`/details?chain=${providerChainId}&box=${args.box_id}&new=true`);
      }
    } catch (err) {
      showToast({
        title: `Fails to create: ${(err as Error).message}`,
        variant: 'error',
      });
      throw err;
    } finally {
      closeToast();
    }
  }, [createBox, isReady]);

  useEffect(() => {
    if (formData.pricePerBox.startsWith('-')) {
      updateField('pricePerBox', formData.pricePerBox.slice(1));
    }
  }, [formData.pricePerBox]);

  const { tokens } = useTokenList();
  const selectedPaymentToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.tokenAddress));
  }, [tokens, formData.tokenAddress]);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Contract
        <span className={styles.step}>2/2</span>
        <Button
          colorScheme="light"
          className={styles.backButton}
          size="large"
          onClick={() => {
            history.replace('/edit/desc');
          }}
        >
          Go back
        </Button>
      </h2>
      <Field className={styles.field} name="Price per box" required>
        <Input
          inputMode="decimal"
          type="number"
          placeholder="0"
          fullWidth
          size="large"
          value={formData.pricePerBox}
          onChange={bindField('pricePerBox')}
          rightAddon={
            <span className={styles.pickButton} onClick={() => setTokenBoxVisible(true)}>
              {selectedPaymentToken ? (
                <TokenIcon className={styles.tokenIcon} token={selectedPaymentToken} />
              ) : null}
              <span className={styles.tokenSymbol}>{selectedPaymentToken?.symbol || '- - -'}</span>
              <Icon size={24} type="arrowDown" />
            </span>
          }
        />
      </Field>
      <Field className={styles.field} name="Limit of purchase per wallet" required>
        <Input
          type="number"
          placeholder="Limit of purchase per wallet"
          fullWidth
          size="large"
          value={formData.limit ?? ''}
          onChange={(evt) =>
            updateField('limit', evt.currentTarget.value ? parseInt(evt.currentTarget.value) : null)
          }
        />
      </Field>

      <Field className={styles.field} name="NFT Contract" required>
        <Input
          placeholder="Enter the contract address"
          fullWidth
          size="large"
          value={formData.nftContractAddress}
          onChange={bindField('nftContractAddress')}
        />
        {utils.isAddress(formData.nftContractAddress) && (
          <div className={styles.selectGroup}>
            <label className={styles.selectType}>
              <input
                type="radio"
                value="all"
                checked={formData.sellAll}
                onChange={(evt) => updateField('sellAll', evt.currentTarget.checked)}
              />
              All
            </label>
            <label className={styles.selectType}>
              <input
                type="radio"
                value="part"
                checked={!formData.sellAll}
                onChange={(evt) => updateField('sellAll', !evt.currentTarget.checked)}
              />
              Selective part
            </label>
          </div>
        )}
      </Field>

      <Field
        className={styles.field}
        name="Select NFT"
        required
        style={{ display: formData.nftContractAddress && !formData.sellAll ? 'block' : 'none' }}
      >
        <div className={styles.selectedNft}>
          <NFTSelectList
            tokens={ownedTokens}
            selectedTokenIds={formData.selectedNFTIds}
            onPick={() => setNftPickerVisible(true)}
          />
        </div>
      </Field>

      <div className={styles.rowFieldGroup}>
        <Field
          className={styles.field}
          name={`Start date (UTC${timezoneOffset > 0 ? '+' + timezoneOffset : timezoneOffset})`}
          required
        >
          <Input
            placeholder="Date"
            fullWidth
            size="large"
            type="datetime-local"
            value={formData.startAt}
            onChange={bindField('startAt')}
          />
        </Field>
        <Field
          className={styles.field}
          name={`End date (UTC${timezoneOffset > 0 ? '+' + timezoneOffset : timezoneOffset})`}
          required
        >
          <Input
            placeholder="Date"
            fullWidth
            size="large"
            type="datetime-local"
            value={formData.endAt}
            onChange={bindField('endAt')}
          />
        </Field>
      </div>

      <Field className={styles.field} name="White list contract">
        <Input
          placeholder="eg. 0x0c8FB5C985E00fb1D232b7B9700089492Fb4B9A8"
          fullWidth
          size="large"
          value={formData.whiteList}
          onChange={bindField('whiteList')}
        />
      </Field>

      <div className={classnames(styles.field, styles.buttonList)}>
        {!isApproveAll && utils.isAddress(formData.nftContractAddress) && (
          <Button
            className={styles.button}
            fullWidth
            size="large"
            colorScheme="primary"
            onClick={approveAll}
            disabled={checkingApprove}
          >
            {checkingApprove ? 'Checking...' : 'Unlock NFT'}
          </Button>
        )}
        <Button
          title={validations.join('\n')}
          className={styles.button}
          fullWidth
          size="large"
          colorScheme="primary"
          disabled={!isReady}
          onClick={create}
        >
          Create Mystery box
        </Button>
      </div>
      <div className={styles.field}>
        <ul className={styles.validations}>
          {validations.map((validation) => (
            <li key={validation}>{validation}</li>
          ))}
        </ul>
      </div>
      <TokenPickerDialog
        open={tokenBoxVisible}
        onClose={() => setTokenBoxVisible(false)}
        onPick={(token) => {
          updateField('tokenAddress', token.address);
          updateField('token', token);
          setTokenBoxVisible(false);
        }}
      />
      <NFTPickerDialog
        tokens={ownedTokens}
        selectedTokenIds={formData.selectedNFTIds}
        onClose={() => setNftPickerVisible(false)}
        onConfirm={(ids) => {
          updateField('selectedNFTIds', ids);
          setNftPickerVisible(false);
        }}
        open={nftPickerVisible}
      />
    </section>
  );
};
