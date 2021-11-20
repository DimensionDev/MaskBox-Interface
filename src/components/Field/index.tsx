import classnames from 'classnames';
import { FC, HTMLProps, ReactNode } from 'react';
import styles from './index.module.less';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'name'> {
  required?: boolean;
  name?: string | ReactNode;
  hint?: ReactNode;
  tip?: string;
}
export const Field: FC<Props> = ({ required, name, hint, tip, className, children, ...rest }) => {
  return (
    <div
      className={classnames(styles.field, className, {
        [styles.required]: required,
      })}
      {...rest}
    >
      <div className={styles.header}>
        {name && <label className={styles.fieldName}>{name}</label>}
        {hint ? hint : null}
        {tip && <span className={styles.tip}>{tip}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
