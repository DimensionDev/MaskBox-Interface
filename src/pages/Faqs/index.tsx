import { ArticleSection } from '@/components';
import React, { FC } from 'react';
import styles from './index.module.less';

export const Faqs: FC = () => {
  return (
    <article className={styles.article}>
      <ArticleSection title="Introducing NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Get Started with NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Buy an NFT on NFTBOX">To do</ArticleSection>
    </article>
  );
};
