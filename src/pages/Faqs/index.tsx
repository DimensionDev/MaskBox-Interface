import { Faq } from '@/components';
import { Language, useI18n } from '@/contexts';
import { FC } from 'react';
import { faqsInEn, faqsInZh } from './data';
import styles from './index.module.less';

export const Faqs: FC = () => {
  const { language } = useI18n();
  const faqs = language === Language.En ? faqsInEn : faqsInZh;
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>FAQs</h1>
      <div className={styles.faqList}>
        {faqs.map(({ title, answer }) => (
          <Faq key={title} title={title}>
            {answer}
          </Faq>
        ))}
      </div>
    </article>
  );
};
