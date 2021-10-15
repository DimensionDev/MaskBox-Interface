import { TokenType } from '@/lib';
import { FC, ImgHTMLAttributes, useMemo } from 'react';
import { create } from 'ethereum-blockies';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  token: TokenType;
}

export const TokenIcon: FC<Props> = ({ token, ...rest }) => {
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

  return <img loading="lazy" src={logoUrl} alt={token.name} {...rest} />;
};
