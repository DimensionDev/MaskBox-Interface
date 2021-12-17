import { FC, ImgHTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { LoadingCircle } from '../Icon';
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alternative?: ReactElement;
}

const lazyTrue = Promise.resolve(true);
const lazyFalse = Promise.resolve(false);
const cache: Record<string, Promise<boolean>> = {};
const loadedMap: Record<string, boolean> = {};
function isImageValid(src?: string): Promise<boolean> {
  if (!src) return lazyFalse;
  if (cache[src] !== undefined) return cache[src];

  const promise = new Promise<boolean>((resolve) => {
    let img = document.createElement('img');
    const cleanup = () => {
      img.onerror = null;
      img.onload = null;
      img = undefined!;
    };
    img.onerror = () => {
      resolve(false);
      cleanup();
    };
    img.onload = () => {
      cache[src] = lazyTrue;
      resolve(true);
      cleanup();
    };
    img.src = src;
  });

  return promise;
}

export const Image: FC<ImageProps> = ({ alternative, src, ...rest }) => {
  const [loaded, setLoaded] = useState(src ? loadedMap[src] : false);
  const [loading, setIsLoading] = useState(src ? !loadedMap[src] : true);

  useEffect(() => {
    setIsLoading(true);
    isImageValid(src)
      .then((isValid) => {
        if (isValid && src) {
          loadedMap[src] = true;
        }
        setLoaded(isValid);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [src]);

  if (loading) return <LoadingCircle />;

  return loaded || !alternative ? <img {...rest} src={src} /> : alternative;
};
