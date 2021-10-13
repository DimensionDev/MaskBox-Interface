import { ArticleSection } from '@/components';
import { WipDialog } from '@/page-components';
import { FC } from 'react';
import styles from './index.module.less';

const wip = true;

export const Faqs: FC = () => {
  if (wip) {
    return <WipDialog />;
  }
  return (
    <article className={styles.article}>
      <ArticleSection title="Introducing NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Get Started with NFTBOX Marketplace">To do</ArticleSection>
      <ArticleSection title="How To Buy an NFT on NFTBOX">To do</ArticleSection>
    </article>
  );
};
