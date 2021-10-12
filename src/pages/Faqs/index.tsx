import { ArticleSection, PickerDialog } from '@/components';
import { FC } from 'react';
import styles from './index.module.less';

const wip = true;

export const Faqs: FC = () => {
  if (wip) {
    return (
      <PickerDialog open title="Under construction">
        <p className={styles.wip}>This page is under construction</p>
      </PickerDialog>
    );
  }
  return (
    <article className={styles.article}>
      <ArticleSection title="Introducing NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Get Started with NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Buy an NFT on NFTBOX">To do</ArticleSection>
    </article>
  );
};
