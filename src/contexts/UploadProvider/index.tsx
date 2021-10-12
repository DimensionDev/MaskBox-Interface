import { showToast } from '@/components';
import { createContext, FC, useContext, useMemo, useState } from 'react';

type UploadResult = string;

interface IUploadContext {
  upload: () => Promise<UploadResult>;
  uploading: boolean;
}

const UploadContext = createContext<IUploadContext>({
  upload: () => Promise.resolve(''),
  uploading: false,
});

export function useUpload(): IUploadContext {
  return useContext(UploadContext);
}

const createInput = () => {
  const inputEl = document.createElement('input');
  inputEl.style.display = 'none';
  inputEl.type = 'file';
  document.body.appendChild(inputEl);
  return inputEl;
};

const ONE_MB = 1 * 1024 * 1024;

export const UploadProvider: FC = ({ children }) => {
  const [uploading, setUploading] = useState(false);

  const upload = useMemo(() => {
    const uploadFile = async (file: File): Promise<UploadResult | undefined> => {
      if (file.size > ONE_MB) {
        showToast({
          variant: 'error',
          title: 'File size of cover image up to 1MB',
        });
        return;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', (evt) => {
          if (evt.target) {
            const result = evt.target.result as string;
            resolve(result);
          }
        });
        reader.readAsDataURL(file);
      });
    };

    return async () => {
      const inputEl = createInput();
      document.body.appendChild(inputEl);
      const result = await new Promise<string | undefined>((resolve, reject) => {
        inputEl.addEventListener('change', (ev: Event) => {
          const file = (ev.target as HTMLInputElement)?.files?.[0];
          if (file) {
            setUploading(true);
            uploadFile(file)
              .then((res) => {
                resolve(res);
                document.body.removeChild(inputEl);
              }, reject)
              .finally(() => {
                setUploading(false);
              });
          }
        });
        inputEl.click();
      });
      return result;
    };
  }, []);

  const contextValue = useMemo(() => {
    return {
      upload,
      uploading,
    };
  }, [upload, uploading]);

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};
