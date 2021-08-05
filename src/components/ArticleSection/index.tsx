import React, { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLTableSectionElement> {
  title: string;
}
export const ArticleSection: FC<Props> = ({ title, children }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        <span className={styles.text}>{title}</span>
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
