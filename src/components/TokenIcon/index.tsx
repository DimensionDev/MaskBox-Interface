import { ERC721Contract, TokenType } from '@/lib';
import { FC, ImgHTMLAttributes, memo, useCallback, useMemo, useRef, useState } from 'react';
import { create } from 'ethereum-blockies';
import classnames from 'classnames';
import { LazyImage } from '../Image';
import styles from './index.module.less';
import { useOnceShowup } from '@/hooks';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  token: TokenType | ERC721Contract;
}

export const TokenIcon: FC<Props> = memo(({ token, className, ...rest }) => {
  const logoURI = token && 'logoURI' in token && token.logoURI;
  const createBlockieImage = useCallback(() => {
    return create({
      color: '#dfe',
      bgcolor: '#aaa',
      seed: token?.address,
    }).toDataURL();
  }, [token?.address]);

  const logoUrl: string = useMemo(() => {
    if (logoURI) return logoURI;
    try {
      return createBlockieImage();
    } catch {
      return '';
    }
  }, [logoURI, createBlockieImage]);

  const [fallbackUrl, setFallbackUrl] = useState(logoUrl);
  const imageRef = useRef<HTMLImageElement>(null);

  useOnceShowup(imageRef, () => {
    const blockieImageUrl = create({
      color: '#dfe',
      bgcolor: '#aaa',
      seed: token?.address,
    }).toDataURL();
    setFallbackUrl(blockieImageUrl);
  });

  return (
    <LazyImage
      loading="lazy"
      className={classnames(className, styles.icon)}
      src={logoUrl}
      fallback={fallbackUrl}
      alt={token?.name}
      ref={imageRef}
      {...rest}
    />
  );
});
