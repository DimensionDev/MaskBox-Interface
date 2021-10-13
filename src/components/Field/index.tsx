import classnames from 'classnames';
import { FC, HTMLProps } from 'react';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  required?: boolean;
  name?: string;
}
export const Field: FC<Props> = ({ required, name, className, children, ...rest }) => {
  return (
    <div
      className={classnames(styles.field, className, {
        [styles.required]: required,
      })}
      {...rest}
    >
      {name && <label className={styles.fieldName}>{name}</label>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
