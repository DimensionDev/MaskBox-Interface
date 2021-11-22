import { FC, ImgHTMLAttributes, ReactElement, useEffect, useState } from 'react';
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
      img = undefined;
    };
    img.onerror = () => {
      resolve(false);
      cleanup();
    };
    img.onload = () => {
      console.log('image loaded');
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

  useEffect(() => {
    isImageValid(src).then((isValid) => {
      if (isValid && src) {
        loadedMap[src] = true;
      }
      setLoaded(isValid);
    });
  }, [src]);

  return loaded || !alternative ? <img {...rest} src={src} /> : alternative;
};
