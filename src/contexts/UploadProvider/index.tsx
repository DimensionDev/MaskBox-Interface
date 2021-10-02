import { createContext, FC, useContext, useMemo, useState } from 'react';

interface IUploadContext {
  upload: () => Promise<any>;
  uploading: boolean;
}

const UploadContext = createContext<IUploadContext>({
  upload: () => Promise.resolve({}),
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

export const UploadProvider: FC = ({ children }) => {
  const [uploading, setUploading] = useState(false);

  const upload = useMemo(() => {
    const uploadFile = async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO upload file
    };

    return async () => {
      const inputEl = createInput();
      document.body.appendChild(inputEl);
      const result = await new Promise((resolve, reject) => {
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
