import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

export interface ArticleSectionProps extends Omit<HTMLProps<HTMLTableSectionElement>, 'title'> {
  title: string | JSX.Element;
}
export const ArticleSection: FC<ArticleSectionProps> = ({ title, className, children }) => {
  return (
    <section className={classnames(styles.section, className)}>
      <h2 className={styles.title}>
        <span className={styles.text}>{title}</span>
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
