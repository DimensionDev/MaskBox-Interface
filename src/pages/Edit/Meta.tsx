import { BaseButton as Button, Input, NFTSelectList, PickerDialog, showToast } from '@/components';
import { useRSS3, useWeb3Context } from '@/contexts';
import { NFTPickerDialog, TokenPickerDialog } from '@/page-components';
import classnames from 'classnames';
import { useAtomValue } from 'jotai/utils';
import { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  formDataAtom,
  readyToCreateAtom,
  useBindFormField,
  useUpdateFormField,
  validationsAtom,
} from './atoms';
import { useCreateMysteryBox } from './hooks';
import { useEdit } from './useEdit';
import styles from './index.module.less';
import { utils } from 'ethers';

export const Meta: FC = () => {
  const history = useHistory();
  const formData = useAtomValue(formDataAtom);
  const isReady = useAtomValue(readyToCreateAtom);
  const validations = useAtomValue(validationsAtom);
  const bindField = useBindFormField();
  const updateField = useUpdateFormField();
  const { providerChainId } = useWeb3Context();
  const [nftPickerVisible, setNftPickerVisible] = useState(false);
  const [boxUrl, setBoxUrl] = useState('');
  const [urlBoxVisible, setUrlBoxVisible] = useState(false);

  const shareLink = new URL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(boxUrl)}`)
    .href;

  const createBox = useCreateMysteryBox();
  const { isApproveAll, approveAll, checkingApprove, ownedTokens } = useEdit();

  const selectedTokens = ownedTokens;
  console.log({ selectedTokens });

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
        setBoxUrl(`https://box.mask.io/#/details?chain=${providerChainId}&box=${args.box_id}`);
        setUrlBoxVisible(true);
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

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Contract</h2>
      <div className={styles.field}>
        <label className={styles.fieldName}>Price per box (in Ether)</label>
        <Input
          min="0"
          type="number"
          className={styles.cell}
          placeholder="Price in Ether"
          fullWidth
          size="large"
          value={formData.pricePerBox}
          onChange={bindField('pricePerBox')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>Limit of purchase per wallet</label>
        <Input
          type="number"
          className={styles.cell}
          placeholder="Limit of purchase per wallet"
          fullWidth
          size="large"
          value={formData.limit ?? ''}
          onChange={(evt) =>
            updateField('limit', evt.currentTarget.value ? parseInt(evt.currentTarget.value) : null)
          }
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>NFT Contract</label>
        <div className={styles.cell}>
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
        </div>
      </div>

      <div
        className={styles.field}
        style={{ display: formData.nftContractAddress && !formData.sellAll ? 'block' : 'none' }}
      >
        <label className={styles.fieldName}>Select NFT</label>
        <div className={styles.cell}>
          <div className={styles.selectedNft}>
            <NFTSelectList
              tokens={selectedTokens}
              selectedTokenIds={formData.selectedNFTIds}
              onPick={() => setNftPickerVisible(true)}
            />
          </div>
        </div>
      </div>

      <div className={styles.rowFieldGroup}>
        <div className={styles.field}>
          <label className={styles.fieldName}>Start date (UTC+8)</label>
          <Input
            className={styles.cell}
            placeholder="Date"
            fullWidth
            size="large"
            type="datetime-local"
            value={formData.startAt}
            onChange={bindField('startAt')}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldName}>End date (UTC+8)</label>
          <Input
            className={styles.cell}
            placeholder="Date"
            fullWidth
            size="large"
            type="datetime-local"
            value={formData.endAt}
            onChange={bindField('endAt')}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldName}>White list contract </label>
        <Input
          className={styles.cell}
          placeholder="eg. 0x0c8FB5C985E00fb1D232b7B9700089492Fb4B9A8"
          fullWidth
          size="large"
          value={formData.whiteList}
          onChange={bindField('whiteList')}
        />
      </div>

      <div className={classnames(styles.field, styles.buttonList)}>
        {!isApproveAll && formData.nftContractAddress && (
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
          className={styles.button}
          size="large"
          onClick={() => {
            if (history.length > 1) {
              history.goBack();
            } else {
              history.push('/edit/desc');
            }
          }}
        >
          Go back
        </Button>
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
      <TokenPickerDialog open={false} />
      <PickerDialog title="Share" open={urlBoxVisible} onClose={() => setUrlBoxVisible(false)}>
        <div className={styles.urlBoxContent}>
          <p>
            Copy following url, and <a href={shareLink}> share</a> on twitter
          </p>
          <div className={styles.url}>
            <a href={shareLink}>{boxUrl}</a>
          </div>
        </div>
      </PickerDialog>
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
