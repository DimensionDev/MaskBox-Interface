import {
  Button,
  Field,
  Hint,
  Icon,
  Input,
  NFTSelectList,
  showToast,
  TokenIcon,
} from '@/components';
import { RouteKeys } from '@/configs';
import { usePickERC20, useRSS3, useWeb3Context } from '@/contexts';
import { useERC721, useTokenList } from '@/hooks';
import { createShareUrl, ZERO_ADDRESS } from '@/lib';
import {
  ERC721ContractPicker,
  NFTPickerDialog,
  RequestConnection,
  ShareBox,
} from '@/page-components';
import { isSameAddress, TZOffsetLabel, useBoolean } from '@/utils';
import classnames from 'classnames';
import { utils } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  boxIdAtom,
  chainAtom,
  formDataAtom,
  isEdittingAtom,
  readyToCreateAtom,
  useBindFormField,
  useResetForm,
  useSetAllDirty,
  useUpdateFormField,
  validationsAtom,
} from './atoms';
import { CreationConfirmDialog } from './CreationConfirmDialog';
import { useCreateMaskbox } from './hooks';
import styles from './index.module.less';
import { useEdit } from './useEdit';
import { useLocales } from './useLocales';

export const Meta: FC = () => {
  const t = useLocales();
  const history = useHistory();

  const formData = useAtomValue(formDataAtom);
  const isReady = useAtomValue(readyToCreateAtom);
  const chain = useAtomValue(chainAtom);
  const isEditting = useAtomValue(isEdittingAtom);
  const editingBoxId = useAtomValue(boxIdAtom);
  const validations = useAtomValue(validationsAtom);

  const bindField = useBindFormField();
  const updateField = useUpdateFormField();
  const setAllDirty = useSetAllDirty();
  const { providerChainId } = useWeb3Context();
  const [nftPickerVisible, openNftPicker, closeNftPicker] = useBoolean();
  const [contractPickerVisible, openContractPicker, closeContractPicker] = useBoolean();
  const [createdBoxId, setCreatedBoxId] = useState('');

  const createBox = useCreateMaskbox();
  const { isEnumable, ownedTokens: ownedERC721Tokens } = useEdit();
  const { isApproveAll, isApproving, checkingApprove, approveAll } = useERC721(
    formData.nftContractAddress,
  );
  const [sellingNFTIds, setSellingNFTIds] = useState<string[]>([]);
  const [sellingContractAddress, setSellingContractAddress] = useState<string>('');

  const { selectedNFTIds } = formData;
  const selectedERC721Tokens = useMemo(
    () => ownedERC721Tokens.filter((token) => selectedNFTIds.includes(token.tokenId.toString())),
    [ownedERC721Tokens, selectedNFTIds],
  );

  const { saveBox } = useRSS3();
  const [confirmDialogVisible, openConfirmDialog, closeConfirmDialog] = useBoolean();
  const [shareBoxVisible, openShareBox, closeShareBox] = useBoolean();
  const [creating, startCreating, finishCreating] = useBoolean();
  const resetForm = useResetForm();
  const create = useCallback(async () => {
    setAllDirty();
    if (!isReady || validations.length) {
      validations.forEach((validation) => {
        showToast({
          title: validation,
          variant: 'error',
        });
      });
      return;
    }
    startCreating();
    const closeToast = showToast({
      title: t('Creating Mystery Box'),
      processing: true,
      duration: Infinity,
    });
    try {
      setSellingContractAddress(formData.nftContractAddress);
      setSellingNFTIds(
        formData.sellAll ? ownedERC721Tokens.map((t) => t.tokenId) : [...formData.selectedNFTIds],
      );
      const result = await createBox();
      if (result) {
        const { args } = result;
        setCreatedBoxId(args.box_id.toString() as string);
        await saveBox({
          id: args.box_id.toString(),
          name: args.name,
          mediaType: formData.mediaType,
          mediaUrl: formData.mediaUrl,
          activities: formData.activities,
        });
        closeConfirmDialog();
        openShareBox();
        resetForm();
      }
    } catch (err) {
      showToast({
        title: t('Fails to create: {reason}', { reason: (err as Error).message }),
        variant: 'error',
      });
      throw err;
    } finally {
      closeToast();
      finishCreating();
    }
  }, [createBox, isReady, setAllDirty, formData, ownedERC721Tokens]);

  const update = useCallback(async () => {
    if (!editingBoxId) return;
    await saveBox({
      id: editingBoxId,
      name: formData.name,
      mediaType: formData.mediaType,
      mediaUrl: formData.mediaUrl,
      activities: formData.activities,
    });
    history.replace(`/details?chain=${providerChainId}&box=${editingBoxId}`);
  }, [history, editingBoxId, formData]);

  useEffect(() => {
    if (formData.pricePerBox.startsWith('-')) {
      updateField('pricePerBox', formData.pricePerBox.slice(1));
    }
  }, [formData.pricePerBox]);

  const pickERC20 = usePickERC20();
  const { tokens } = useTokenList();
  const selectedPaymentToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.tokenAddress));
  }, [tokens, formData.tokenAddress]);

  const qualifyingToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.holderTokenAddress));
  }, [tokens, formData.holderTokenAddress]);

  if (!providerChainId) return <RequestConnection />;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {t('Contract')}
        <span className={styles.step}>2/2</span>
        <Button
          colorScheme="light"
          className={styles.backButton}
          size="large"
          onClick={() => {
            const search = isEditting ? `?chain=${chain}&box=${editingBoxId}` : '';
            history.replace(`${RouteKeys.EditDescription}${search}`);
          }}
        >
          {t('Go back')}
        </Button>
      </h2>
      <Field className={styles.field} name={t('Price per box')} required>
        <Input
          inputMode="decimal"
          type="number"
          placeholder="0"
          fullWidth
          size="large"
          disabled={isEditting}
          value={formData.pricePerBox}
          onChange={bindField('pricePerBox')}
          rightAddon={
            <span
              className={styles.pickButton}
              onClick={async () => {
                if (isEditting) return;
                const token = await pickERC20();
                updateField('tokenAddress', token.address);
                updateField('token', token);
              }}
            >
              {selectedPaymentToken ? (
                <TokenIcon className={styles.tokenIcon} token={selectedPaymentToken} />
              ) : null}
              <span className={styles.tokenSymbol}>{selectedPaymentToken?.symbol || '- - -'}</span>
              <Icon size={24} type="arrowDown" />
            </span>
          }
        />
      </Field>
      <Field className={styles.field} name={t('Limit of purchase per wallet')} required>
        <Input
          type="number"
          placeholder={t('Limit of purchase per wallet')}
          fullWidth
          size="large"
          disabled={isEditting}
          value={formData.limit ?? ''}
          onChange={(evt) =>
            updateField('limit', evt.currentTarget.value ? parseInt(evt.currentTarget.value) : null)
          }
        />
      </Field>

      <Field className={styles.field} name={t('NFT Contract')} required>
        <Input
          className={styles.clickableInput}
          placeholder={t('Drop down to select or enter the contract address.')}
          fullWidth
          size="large"
          readOnly
          disabled={isEditting}
          value={formData.erc721Contract?.name ?? formData.nftContractAddress}
          onChange={bindField('nftContractAddress')}
          onClick={isEditting ? undefined : openContractPicker}
          leftAddon={
            formData.erc721Contract ? (
              <TokenIcon className={styles.tokenIcon} token={formData.erc721Contract} />
            ) : null
          }
          rightAddon={
            <span
              className={styles.pickButton}
              onClick={isEditting ? undefined : openContractPicker}
            >
              <Icon size={24} type="arrowDown" />
            </span>
          }
        />
        {utils.isAddress(formData.nftContractAddress) && (
          <div className={styles.selectGroup}>
            <label className={styles.selectType}>
              <input
                disabled={isEditting}
                type="radio"
                value="all"
                checked={formData.sellAll}
                onChange={(evt) => updateField('sellAll', evt.currentTarget.checked)}
              />
              {t('All')}
            </label>
            <label className={styles.selectType}>
              <input
                disabled={isEditting}
                type="radio"
                value="part"
                checked={!formData.sellAll}
                onChange={(evt) => updateField('sellAll', !evt.currentTarget.checked)}
              />
              {t('Selective part')}
            </label>
          </div>
        )}
      </Field>

      {formData.nftContractAddress && !formData.sellAll && (
        <Field className={styles.field} name="Select NFT" required>
          <div className={styles.selectedNft}>
            <NFTSelectList
              tokens={selectedERC721Tokens}
              selectedTokenIds={formData.selectedNFTIds}
              onPick={isEditting ? undefined : openNftPicker}
            />
          </div>
        </Field>
      )}

      <div className={styles.rowFieldGroup}>
        <Field
          className={styles.field}
          name={t('Start date ({offset})', { offset: TZOffsetLabel })}
          required
        >
          <Input
            placeholder={t('Date')}
            fullWidth
            disabled={isEditting}
            size="large"
            type="datetime-local"
            value={formData.startAt}
            max={formData.endAt}
            onChange={bindField('startAt')}
          />
        </Field>
        <Field
          className={styles.field}
          name={t('End date ({offset})', { offset: TZOffsetLabel })}
          required
        >
          <Input
            placeholder={t('Date')}
            fullWidth
            disabled={isEditting}
            size="large"
            type="datetime-local"
            value={formData.endAt}
            min={formData.startAt}
            onChange={bindField('endAt')}
          />
        </Field>
      </div>

      <Field
        className={styles.field}
        name={t('White list contract')}
        hint={
          <Hint width={244} height={100}>
            {t('white-list-hint')}
          </Hint>
        }
      >
        <Input
          placeholder="eg. 0x0c8FB5C985E00fb1D232b7B9700089492Fb4B9A8"
          disabled={isEditting}
          fullWidth
          size="large"
          value={formData.whiteList}
          onChange={bindField('whiteList')}
        />
      </Field>

      <Field
        className={styles.field}
        name={t('Minimum position')}
        hint={
          <Hint width={364} height={130}>
            {t('min-token-hint', { symbol: qualifyingToken?.symbol ?? '??' })}
          </Hint>
        }
      >
        <Input
          placeholder="0"
          disabled={isEditting}
          fullWidth
          size="large"
          type="number"
          value={formData.holderMinTokenAmount}
          onChange={bindField('holderMinTokenAmount')}
          rightAddon={
            <span
              className={styles.pickButton}
              onClick={async () => {
                if (isEditting) return;
                const token = await pickERC20({
                  exclude: [ZERO_ADDRESS],
                });
                updateField('holderTokenAddress', token.address);
                updateField('holderToken', token);
              }}
            >
              {qualifyingToken ? (
                <TokenIcon className={styles.tokenIcon} token={qualifyingToken} />
              ) : null}
              <span className={styles.tokenSymbol}>{qualifyingToken?.symbol || '- - -'}</span>
              <Icon size={24} type="arrowDown" />
            </span>
          }
        />
      </Field>

      <div className={classnames(styles.field, styles.buttonList)}>
        {!isEnumable && (
          <Button className={styles.button} fullWidth size="large" colorScheme="primary" disabled>
            Provided contract is not a enumable NFT contract
          </Button>
        )}
        {!isApproveAll && utils.isAddress(formData.nftContractAddress) && isEnumable && (
          <Button
            className={styles.button}
            fullWidth
            size="large"
            colorScheme="primary"
            onClick={approveAll}
            disabled={checkingApprove || isApproving}
          >
            {checkingApprove ? t('Checking...') : isApproving ? t('Unlocking') : t('Unlock NFT')}
          </Button>
        )}
        <div onMouseEnter={setAllDirty}>
          <Button
            title={validations.join('\n')}
            className={styles.button}
            fullWidth
            size="large"
            colorScheme="primary"
            disabled={!isReady || !isApproveAll}
            onClick={isEditting ? update : openConfirmDialog}
          >
            {isEditting ? t('Update') : t('Create Mystery box')}
          </Button>
        </div>
      </div>
      <div className={styles.field}>
        <ul className={styles.validations}>
          {validations.map((validation) => (
            <li key={validation}>{t(validation)}</li>
          ))}
        </ul>
      </div>
      <CreationConfirmDialog
        open={confirmDialogVisible}
        onClose={closeConfirmDialog}
        sellAll={formData.sellAll}
        nftAddress={formData.nftContractAddress}
        nftIdList={formData.selectedNFTIds}
        onConfirm={create}
        creating={creating}
      />
      <ShareBox
        open={shareBoxVisible}
        nftAddress={sellingContractAddress}
        title="Successful"
        onClose={() => {
          closeShareBox();
          history.replace(`/details?chain=${providerChainId}&box=${createdBoxId}`);
        }}
        nftIds={sellingNFTIds}
        onShare={() => {
          const link = `${window.location.origin}/#/details?chain=${providerChainId}&box=${createdBoxId}`;
          const text = t('share-text', { name: formData.name, link: link });
          const shareLink = createShareUrl(text);
          window.open(shareLink, 'noopener noreferrer');
          history.replace(`/details?chain=${providerChainId}&box=${createdBoxId}`);
        }}
      />
      <ERC721ContractPicker
        open={contractPickerVisible}
        onClose={closeContractPicker}
        onPick={(contract) => {
          updateField('nftContractAddress', contract.address);
          updateField('erc721Contract', contract);
          closeContractPicker();
        }}
      />
      <NFTPickerDialog
        open={nftPickerVisible}
        tokens={ownedERC721Tokens}
        selectedTokenIds={formData.selectedNFTIds}
        onClose={closeNftPicker}
        onConfirm={(ids) => {
          updateField('selectedNFTIds', ids);
          closeNftPicker();
        }}
      />
    </section>
  );
};
