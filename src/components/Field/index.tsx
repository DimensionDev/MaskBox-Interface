import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  required?: boolean;
  name?: string;
  tip?: string;
}
export const Field: FC<Props> = ({ required, name, tip, className, children, ...rest }) => {
  return (
    <div
      className={classnames(styles.field, className, {
        [styles.required]: required,
      })}
      {...rest}
    >
      <div className={styles.header}>
        {name && <label className={styles.fieldName}>{name}</label>}
        {tip && <span className={styles.tip}>{tip}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
