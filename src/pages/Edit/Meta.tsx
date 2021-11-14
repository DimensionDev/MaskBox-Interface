import {
  Button,
  Field,
  Icon,
  Input,
  NFTSelectList,
  showToast,
  TokenIcon,
  useDialog,
} from '@/components';
import { RouteKeys } from '@/configs';
import { useRSS3, useWeb3Context } from '@/contexts';
import { useTokenList } from '@/hooks';
import { createShareUrl } from '@/lib';
import {
  ERC721TokenPickerDialog,
  NFTPickerDialog,
  RequestConnection,
  ShareBox,
  TokenPickerDialog,
} from '@/page-components';
import { isSameAddress } from '@/utils';
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
  useSetAllDirty,
  useUpdateFormField,
  validationsAtom,
} from './atoms';
import { CreationConfirmDialog } from './CreationConfirmDialog';
import { useCreateMaskbox } from './hooks';
import styles from './index.module.less';
import { useEdit } from './useEdit';
import { useLocales } from './useLocales';

const timezoneOffset = -new Date().getTimezoneOffset() / 60;

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
  const [nftPickerVisible, setNftPickerVisible] = useState(false);
  const [tokenBoxVisible, openTokenBox, closeTokenBox] = useDialog();
  const [erc721DialogVisible, openERC721PickerDialog, closeERC721PickerDialog] = useDialog();
  const [createdBoxId, setCreatedBoxId] = useState('');

  const createBox = useCreateMaskbox();
  const {
    isEnumable,
    isApproveAll,
    isApproving,
    approveAll,
    checkingApprove,
    ownedTokens: ownedERC721Tokens,
  } = useEdit();

  const { selectedNFTIds } = formData;
  const selectedERC721Tokens = useMemo(
    () => ownedERC721Tokens.filter((token) => selectedNFTIds.includes(token.tokenId.toString())),
    [ownedERC721Tokens, selectedNFTIds],
  );

  const { saveBox } = useRSS3();
  const [confirmDialogVisible, openConfirmDialog, closeConfirmDialog] = useDialog();
  const [shareBoxVisible, openShareBox, closeShareBox] = useDialog();
  const [creating, setCreating] = useState(false);
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
    setCreating(true);
    const closeToast = showToast({
      title: t('Creating Mystery Box'),
      processing: true,
      duration: Infinity,
    });
    try {
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
      }
    } catch (err) {
      showToast({
        title: t('Fails to create: {reason}', { reason: (err as Error).message }),
        variant: 'error',
      });
      throw err;
    } finally {
      closeToast();
      setCreating(false);
    }
  }, [createBox, isReady, setAllDirty, formData]);

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

  const { tokens } = useTokenList();
  const selectedPaymentToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.tokenAddress));
  }, [tokens, formData.tokenAddress]);

  if (!providerChainId) return <RequestConnection />;

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
            <span className={styles.pickButton} onClick={isEditting ? undefined : openTokenBox}>
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
          value={formData.erc721Token?.name ?? formData.nftContractAddress}
          onChange={bindField('nftContractAddress')}
          onClick={isEditting ? undefined : openERC721PickerDialog}
          leftAddon={
            formData.erc721Token ? (
              <TokenIcon className={styles.tokenIcon} token={formData.erc721Token} />
            ) : null
          }
          rightAddon={
            <span
              className={styles.pickButton}
              onClick={isEditting ? undefined : openERC721PickerDialog}
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
              All
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
              onPick={() => setNftPickerVisible(true)}
            />
          </div>
        </Field>
      )}

      <div className={styles.rowFieldGroup}>
        <Field
          className={styles.field}
          name={t('Start date (UTC{offset})', {
            offset: timezoneOffset > 0 ? '+' + timezoneOffset : timezoneOffset,
          })}
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
          name={t('End date (UTC{offset})', {
            offset: timezoneOffset > 0 ? '+' + timezoneOffset : timezoneOffset,
          })}
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

      <Field className={styles.field} name={t('White list contract')}>
        <Input
          placeholder="eg. 0x0c8FB5C985E00fb1D232b7B9700089492Fb4B9A8"
          disabled={isEditting}
          fullWidth
          size="large"
          value={formData.whiteList}
          onChange={bindField('whiteList')}
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
        nftAddress={formData.nftContractAddress}
        title="Successful"
        onClose={() => {
          closeShareBox();
          history.replace(`/details?chain=${providerChainId}&box=${createdBoxId}`);
        }}
        nftIds={
          formData.sellAll ? ownedERC721Tokens.map((t) => t.tokenId) : formData.selectedNFTIds
        }
        onShare={() => {
          const link = `${window.location.origin}.io/#/details?chain=${providerChainId}&box=${createdBoxId}`;
          const text = t('share-text', { name: formData.name, link: link });
          const shareLink = createShareUrl(text);
          window.open(shareLink, 'noopener noreferrer');
          history.replace(`/details?chain=${providerChainId}&box=${createdBoxId}`);
        }}
      />
      <TokenPickerDialog
        open={tokenBoxVisible}
        onClose={closeTokenBox}
        onPick={(token) => {
          updateField('tokenAddress', token.address);
          updateField('token', token);
          closeTokenBox();
        }}
      />
      <ERC721TokenPickerDialog
        open={erc721DialogVisible}
        onClose={closeERC721PickerDialog}
        onPick={(token) => {
          updateField('nftContractAddress', token.address);
          updateField('erc721Token', token);
          closeERC721PickerDialog();
        }}
      />
      <NFTPickerDialog
        tokens={ownedERC721Tokens}
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
