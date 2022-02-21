import {
  Button,
  Field,
  Hint,
  Icon,
  Input,
  NFTList,
  showToast,
  TokenIcon,
  UploadButton,
} from '@/components';
import { RouteKeys } from '@/configs';
import { usePickERC20, useRSS3, useWeb3Context } from '@/contexts';
import { useERC721, useLazyLoadERC721Tokens, useTokenList } from '@/hooks';
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
import { useAtom } from 'jotai';
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

  const [formData, setFormData] = useAtom(formDataAtom);
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
  const [iswhitelistConfirmed, confirmwhitelist, editwhitelist] = useBoolean();
  const [createdBoxId, setCreatedBoxId] = useState('');
  const [qualification, setQualification] = useState(
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  );

  const createBox = useCreateMaskbox();
  const { isEnumable } = useEdit();
  const {
    tokens: ownedERC721Tokens,
    pendingSize: pendingERC721TokenSize,
    balance,
    loading: nftLoading,
  } = useLazyLoadERC721Tokens(formData.nftContractAddress);
  const { isApproveAll, isApproving, checkingApprove, approveAll } = useERC721(
    formData.nftContractAddress,
  );
  const [sellingNFTIds, setSellingNFTIds] = useState<string[]>([]);
  const [sellingContractAddress, setSellingContractAddress] = useState<string>('');
  const sellingERC721Tokens = useMemo(
    () => ownedERC721Tokens.filter((t) => sellingNFTIds.includes(t.tokenId)),
    [ownedERC721Tokens, sellingNFTIds],
  );

  const { selectedNFTIds } = formData;
  const selectedERC721Tokens = useMemo(
    () => ownedERC721Tokens.filter((token) => selectedNFTIds.includes(token.tokenId.toString())),
    [ownedERC721Tokens, selectedNFTIds],
  );

  const { saveBox } = useRSS3();
  const [confirmDialogVisible, openConfirmDialog, closeConfirmDialog] = useBoolean();
  const [whitelistNumber, setwhitelistNumber] = useState<number>(0);
  const [shareBoxVisible, openShareBox, closeShareBox] = useBoolean();
  const [creating, startCreating, finishCreating] = useBoolean();
  const [uploading, setUploading, setNotUploading] = useBoolean();

  const [uploadError, setUploadError] = useState<Error | null>(null);

  const getMerkleProof = async (leaves: string[]) => {
    try {
      const res = await fetch(
        'https://lf8d031acj.execute-api.ap-east-1.amazonaws.com/api/v1/merkle_tree/create',
        {
          method: 'POST',
          body: JSON.stringify({
            leaves,
          }),
        },
      );
      return res.json() as Promise<{ root: string }>;
    } catch (err) {
      showToast({
        title: t('Fails to get merkle proof: {reason}', { reason: (err as Error).message }),
        variant: 'error',
      });
      throw err;
    }
  };
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

      const whitelist =
        formData?.fileAddressList && formData?.fileAddressList?.length > 0
          ? formData?.fileAddressList
          : formData?.whitelist && formData?.whitelist?.length > 0
          ? formData?.whitelist?.split(',')
          : undefined;

      if (whitelist) {
        const leaves = whitelist
          .map((address) =>
            address
              ?.replace(/0x/, '')
              ?.match(/.{1,2}/g)
              ?.map((byte) => parseInt(byte, 16)),
          )
          .filter((numbers) => numbers && numbers.length)
          .map((numbers) => new Uint8Array(numbers as number[]))
          .map((uint8Array) => Buffer.from(uint8Array).toString('base64'));
        const res = await getMerkleProof(leaves);
        formData.merkleProof = '0x' + res?.root;
      } else {
        formData.merkleProof = '0x0000000000000000000000000000000000000000000000000000000000000000';
      }
      setQualification(formData.merkleProof);

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
          whitelistFileName: formData.whitelistFileName,
          qualification_rss3: formData.merkleProof,
        });
        localStorage.setItem(`${args.box_id.toString()}whitelist`, formData.whitelist || '');
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
      whitelistFileName: formData?.whitelistFileName,
    });
    history.replace(`/details?chain=${providerChainId}&box=${editingBoxId}`);
  }, [history, editingBoxId, formData]);

  useEffect(() => {
    if (formData.pricePerBox.startsWith('-')) {
      updateField('pricePerBox', formData.pricePerBox.slice(1));
    }
  }, [formData.pricePerBox]);

  const pickERC20 = usePickERC20();
  const { tokens, updateTokens } = useTokenList();
  const selectedPaymentToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.tokenAddress));
  }, [tokens, formData.tokenAddress]);

  const qualifyingToken = useMemo(() => {
    return tokens.find((token) => isSameAddress(token.address, formData.holderTokenAddress));
  }, [tokens, formData.holderTokenAddress]);

  const handlewhitelistConfirm = () => {
    const whitelistNum = formData?.whitelist ? formData.whitelist?.split(',')?.length : 0;
    if (whitelistNum != null && whitelistNum > 0) {
      setwhitelistNumber(whitelistNum);
      confirmwhitelist();
    }
  };

  const handleUploaded = useCallback(
    ({
      fileAddressList,
      whitelistFileName,
    }: {
      fileAddressList?: string[];
      whitelistFileName: string;
    }) => {
      setUploadError(null);
      setNotUploading();
      if (fileAddressList && fileAddressList?.length > 1000) {
        setUploadError(new Error(t('Max limit of address')));
      }
      if (fileAddressList?.some((address) => /^(0x)?[0-9a-zA-Z]{40}$/.test(address) === false)) {
        setUploadError(new Error(t('File contains unvalid addrdss')));
      }
      setFormData((fd) => ({ ...fd, fileAddressList, whitelistFileName }));
    },
    [],
  );

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
                // TODO move this checking into pickERC20
                const existed = tokens.find((t) => isSameAddress(t.address, token.address));
                if (!existed) {
                  updateTokens();
                }
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
          max="255"
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
              {t('All ({balance} NFT)', { balance: balance.toString() })}
            </label>
            <label className={styles.selectType}>
              <input
                disabled={isEditting}
                type="radio"
                value="part"
                checked={!formData.sellAll}
                onChange={(evt) => updateField('sellAll', !evt.currentTarget.checked)}
              />
              {t('Select partially')}
            </label>
            {formData.sellAll && <div className={styles.warning}>{t('select-all-warning')}</div>}
          </div>
        )}
      </Field>

      {formData.nftContractAddress && !formData.sellAll && (
        <Field className={styles.field} name="Select NFT" required>
          <div className={styles.selectedNft}>
            <NFTList tokens={selectedERC721Tokens} pickable={!isEditting} onPick={openNftPicker} />
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
        <div className={styles.commonText}>
          When entering address or uploading CSV file, another uploading whitelist method is
          disabled.
        </div>
        <Input
          placeholder="e.g.0x"
          disabled={isEditting || iswhitelistConfirmed || Boolean(formData?.whitelistFileName)}
          fullWidth
          multiLine
          spellCheck={false}
          value={formData.whitelist}
          onChange={bindField('whitelist')}
        />

        <div className={styles.rowFieldGroup}>
          <div className={styles.buttonWrapper}>
            <Button
              className={styles.button}
              disabled={!formData?.whitelist || isEditting}
              colorScheme={iswhitelistConfirmed ? 'success' : 'primary'}
              onClick={handlewhitelistConfirm}
            >
              {t('Confirm')}
            </Button>
            <Button
              className={styles.button}
              disabled={isEditting || Boolean(formData?.whitelistFileName)}
              colorScheme="primary"
              onClick={editwhitelist}
            >
              {t('Edit')}
            </Button>
          </div>
          <div className={styles.commonText}>
            {whitelistNumber > 0 && `total: ${whitelistNumber}`}
          </div>
        </div>
      </Field>

      <div className={styles.commonText}>
        *Addresses should be separated by commas in English (half-width) or space. In Excel, one
        cell can only be filled with one address, max to 1000.
      </div>

      <UploadButton
        fileName={formData.whitelistFileName}
        tabIndex={0}
        disabled={isEditting || Boolean(formData?.whitelist)}
        onStartUpload={setUploading}
        onUploaded={handleUploaded}
        onError={setUploadError}
      />
      {uploadError && <div className={styles.uploadWarning}>{uploadError?.message}</div>}

      <div className={styles.commonText}>
        *Addresses should be separated by commas in English (half-width) or space. In Excel, one
        cell can only be filled with one address.
      </div>

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
                // TODO move this checking into pickERC20
                const existed = tokens.find((t) => isSameAddress(t.address, token.address));
                if (!existed) {
                  updateTokens();
                }
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
        tokens={formData.sellAll ? ownedERC721Tokens : selectedERC721Tokens}
        onClose={closeConfirmDialog}
        whitelistAddressList={
          formData?.whitelist && formData?.whitelist?.length > 0
            ? formData?.whitelist?.split(',')
            : undefined
        }
        fileName={formData?.whitelistFileName}
        nftAddress={formData.nftContractAddress}
        onConfirm={create}
        creating={creating}
      />
      <ShareBox
        open={shareBoxVisible}
        nftAddress={sellingContractAddress}
        tokens={sellingERC721Tokens}
        title="Successful"
        onClose={() => {
          closeShareBox();
          history.replace(`/details?chain=${providerChainId}&box=${createdBoxId}`);
        }}
        onShare={() => {
          const link = `${window.location.origin}/#/?chaidetailsn=${providerChainId}&box=${createdBoxId}&rootHash=${qualification}`;
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
        pendingSize={pendingERC721TokenSize}
        loading={nftLoading}
        contractAddress={formData.nftContractAddress}
        contractName={formData.erc721Contract?.name ?? ''}
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
