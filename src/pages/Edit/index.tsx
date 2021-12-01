import { RouteKeys } from '@/configs';
import { useBox, useERC20Token, useERC721Contract, useNFTIdsOfBox } from '@/hooks';
import { isZeroAddress } from '@/utils';
import { format } from 'date-fns';
import { formatUnits } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { FC, useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { boxIdAtom, chainAtom, formDataAtom, initFormData, isEdittingAtom } from './atoms';
import { Description } from './Description';
import styles from './index.module.less';
import { Meta } from './Meta';
import { useLocales } from './useLocales';

export const Edit: FC = () => {
  const location = useLocation();
  const [isEditting, updateIsEditting] = useAtom(isEdittingAtom);
  const [, updateChain] = useAtom(chainAtom);
  const [boxId, updateBoxId] = useAtom(boxIdAtom);
  const updateFormData = useUpdateAtom(formDataAtom);
  const { boxOnSubgraph, boxOnRSS3, boxOnChain } = useBox(boxId);
  const paymentToken = useERC20Token(boxOnChain?.payment?.[0]?.token_addr);
  const erc721Contract = useERC721Contract(boxOnChain?.nft_address);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const _chain = params.get('chain');
    const _boxId = params.get('box');
    updateChain(_chain);
    updateBoxId(_boxId);
    updateIsEditting(!!_chain && !!_boxId);
  }, [location.search]);

  useEffect(() => {
    if (!isEditting) {
      updateFormData(initFormData);
    }
  }, [isEditting]);

  useEffect(() => {
    if (isEditting && boxOnRSS3) {
      updateFormData((fd) => {
        return {
          ...fd,
          name: boxOnRSS3.name,
          mediaType: boxOnRSS3.mediaType,
          mediaUrl: boxOnRSS3.mediaUrl,
          activities: boxOnRSS3.activities,
        };
      });
    }
  }, [isEditting, boxOnRSS3]);

  useEffect(() => {
    if (isEditting && boxOnChain && paymentToken) {
      updateFormData((fd) => {
        const payment = boxOnChain?.payment?.[0];
        if (!payment) return fd;
        return {
          ...fd,
          pricePerBox: formatUnits(payment.price, paymentToken.decimals),
          tokenAddress: paymentToken.address,
          token: paymentToken,
          limit: boxOnChain.personal_limit!,
          nftContractAddress: boxOnChain.nft_address!,
          holderTokenAddress: isZeroAddress(boxOnChain.holder_token_addr!)
            ? ''
            : boxOnChain.holder_token_addr!,
        };
      });
    }
  }, [isEditting, paymentToken, boxOnChain]);

  useEffect(() => {
    if (isEditting && boxOnSubgraph) {
      updateFormData((fd) => ({
        ...fd,
        sellAll: boxOnSubgraph.sell_all,
        startAt: format(boxOnSubgraph.start_time * 1000, "yyyy-MM-dd'T'HH:mm"),
        endAt: format(boxOnSubgraph.end_time * 1000, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [isEditting, boxOnSubgraph]);

  useEffect(() => {
    if (isEditting && erc721Contract) {
      updateFormData((fd) => ({
        ...fd,
        erc721Contract: erc721Contract,
      }));
    }
  }, [isEditting, erc721Contract]);

  const sellingNFTIds = useNFTIdsOfBox(boxId, boxOnSubgraph?.sell_all);

  useEffect(() => {
    if (isEditting && sellingNFTIds) {
      updateFormData((fd) => ({
        ...fd,
        selectedNFTIds: sellingNFTIds,
      }));
    }
  }, [isEditting, sellingNFTIds]);

  const t = useLocales();
  return (
    <main className={styles.editPage}>
      <h1 className={styles.title}>{t('Create MaskBox')}</h1>
      <Switch>
        <Route exact path={RouteKeys.EditDescription} component={Description}></Route>
        <Route path={RouteKeys.EditMeta} component={Meta}></Route>
        <Redirect to={RouteKeys.EditDescription} />
      </Switch>
    </main>
  );
};
