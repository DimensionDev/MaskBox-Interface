import {
  FC,
  forwardRef,
  ImgHTMLAttributes,
  memo,
  ReactElement,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { LoadingCircle } from '../Icon';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alternative?: ReactElement;
}

export interface LazyImageProps
  extends ImgHTMLAttributes<HTMLImageElement>,
    RefAttributes<HTMLImageElement> {
  fallback?: string;
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
      console.log('error', { src });
      resolve(false);
      cleanup();
    };
    img.onload = () => {
      console.log({ src });
      cache[src] = lazyTrue;
      resolve(true);
      cleanup();
    };
    img.src = src;
  });

  return promise;
}

export const Image: FC<ImageProps> = memo(({ alternative, src, ...rest }) => {
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

  if (loading) return <LoadingCircle className={rest.className} />;

  return loaded || !alternative ? <img {...rest} src={src} /> : alternative;
});

export const LazyImage: FC<LazyImageProps> = forwardRef(({ fallback, src, ...rest }, ref) => {
  const [loaded, setLoaded] = useState(src ? loadedMap[src] : false);

  useEffect(() => {
    isImageValid(src).then((isValid) => {
      if (isValid && src) {
        loadedMap[src] = true;
      }
      setLoaded(isValid);
    });
  }, [src]);

  return <img {...rest} ref={ref} src={loaded ? src : fallback} />;
});
