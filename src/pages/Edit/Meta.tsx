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
import { useRSS3, useWeb3Context } from '@/contexts';
import { useTokenList } from '@/hooks';
import { createShareUrl } from '@/lib';
import {
  ERC721TokenPickerDialog,
  NFTPickerDialog,
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
  formDataAtom,
  readyToCreateAtom,
  useBindFormField,
  useUpdateFormField,
  validationsAtom,
} from './atoms';
import { CreationConfirmDialog } from './CreationConfirmDialog';
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
  const [tokenBoxVisible, openTokenBox, closeTokenBox] = useDialog();
  const [erc721DialogVisible, openERC721PickerDialog, closeERC721PickerDialog] = useDialog();
  const [createdBoxId, setCreatedBoxId] = useState('');

  const createBox = useCreateMysteryBox();
  const {
    isEnumable,
    isApproveAll,
    isApproving,
    approveAll,
    checkingApprove,
    ownedTokens: ownedERC721Tokens,
  } = useEdit();

  const { saveBox } = useRSS3();
  const [confirmDialogVisible, openConfirmDialog, closeConfirmDialog] = useDialog();
  const [shareBoxVisible, openShareBox, closeShareBox] = useDialog();
  const [creating, setCreating] = useState(false);
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
    setCreating(true);
    const closeToast = showToast({
      title: 'Creating Mystery Box',
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
          cover: formData.cover,
          activities: formData.activities,
        });
        closeConfirmDialog();
        openShareBox();
      }
    } catch (err) {
      showToast({
        title: `Fails to create: ${(err as Error).message}`,
        variant: 'error',
      });
      throw err;
    } finally {
      closeToast();
      setCreating(false);
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
            <span className={styles.pickButton} onClick={openTokenBox}>
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
          className={styles.clickableInput}
          placeholder="Enter the contract address"
          fullWidth
          size="large"
          readOnly
          value={formData.erc721Token?.name ?? formData.nftContractAddress}
          onChange={bindField('nftContractAddress')}
          onClick={openERC721PickerDialog}
          rightAddon={
            <span className={styles.pickButton} onClick={openERC721PickerDialog}>
              <Icon size={24} type="arrowDown" />
            </span>
          }
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

      {formData.nftContractAddress && !formData.sellAll && (
        <Field className={styles.field} name="Select NFT" required>
          <div className={styles.selectedNft}>
            <NFTSelectList
              tokens={ownedERC721Tokens}
              selectedTokenIds={formData.selectedNFTIds}
              onPick={() => setNftPickerVisible(true)}
            />
          </div>
        </Field>
      )}

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
            max={formData.endAt}
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
            min={formData.startAt}
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
            {checkingApprove ? 'Checking...' : isApproving ? 'Unlocking' : 'Unlock NFT'}
          </Button>
        )}
        <Button
          title={validations.join('\n')}
          className={styles.button}
          fullWidth
          size="large"
          colorScheme="primary"
          disabled={!isReady || !isApproveAll}
          onClick={openConfirmDialog}
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
          const text = `I just created an NFT mystery box ${formData.name} on MaskBox platform. Try to draw and good luck! ${link}`;
          const shareLink = createShareUrl(text);
          window.open(shareLink, 'noopener noreferrer');
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
