import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLTableSectionElement>, 'title'> {
  title: string | JSX.Element;
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
