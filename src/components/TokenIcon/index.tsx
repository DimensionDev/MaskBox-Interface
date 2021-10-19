import { TokenType } from '@/lib';
import { FC, ImgHTMLAttributes, useMemo } from 'react';
import { create } from 'ethereum-blockies';
import classnames from 'classnames';
import styles from './index.module.less';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  token: TokenType;
}

export const TokenIcon: FC<Props> = ({ token, className, ...rest }) => {
  const logoUrl: string = useMemo(() => {
    if (token.logoURI) return token.logoURI;
    try {
      return create({
        color: '#dfe',
        bgcolor: '#aaa',
        seed: token.address,
      }).toDataURL();
    } catch {
      return '';
    }
  }, [token.logoURI]);

  return (
    <img
      loading="lazy"
      className={classnames(className, styles.icon)}
      src={logoUrl}
      alt={token.name}
      {...rest}
    />
  );
};
