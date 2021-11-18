import { Faq } from '@/components';
import { FC } from 'react';
import { useFaqs } from './useFaqs';
import styles from './index.module.less';
import { useLocales } from './useLocales';

export const Faqs: FC = () => {
  const t = useLocales();
  const faqs = useFaqs();
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{t('FAQs')}</h1>
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
