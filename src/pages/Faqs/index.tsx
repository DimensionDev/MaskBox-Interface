import { Faq } from '@/components';
import { FC } from 'react';
import { faqs } from './data';
import styles from './index.module.less';

export const Faqs: FC = () => {
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
