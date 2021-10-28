import { createContext, FC, useContext, useMemo, useState } from 'react';
import { create } from 'ipfs-http-client';

type UploadResult = string;

interface IUploadContext {
  upload: (file?: File, validator?: (file: File) => void) => Promise<UploadResult | undefined>;
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

const pickFile = async () => {
  const inputEl = createInput();
  document.body.appendChild(inputEl);
  return new Promise<File | null>((resolve) => {
    inputEl.addEventListener('change', (evt: Event) => {
      const files = (evt.target as HTMLInputElement)?.files;
      if (files && files.length > 0) {
        resolve(files[0]);
        document.body.removeChild(inputEl);
      } else {
        resolve(null);
      }
    });
    inputEl.click();
  });
};

const ipfsClient = create({
  url: 'https://ipfs.infura.io:5001/api/v0',
});

export const UploadProvider: FC = ({ children }) => {
  const [uploading, setUploading] = useState(false);

  const upload = useMemo(() => {
    const uploadFile = async (file: File): Promise<UploadResult | undefined> => {
      const added = await ipfsClient.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    };

    const fn: IUploadContext['upload'] = async (file, validator) => {
      let url: string | undefined;
      if (!file) {
        const pickedFile = await pickFile();
        if (pickedFile) file = pickedFile;
      }
      setUploading(true);
      if (file) {
        try {
          validator?.(file);
          url = await uploadFile(file);
        } finally {
          setUploading(false);
        }
      }
      setUploading(false);
      return url;
    };
    return fn;
  }, []);

  const contextValue = useMemo(() => {
    return {
      upload,
      uploading,
    };
  }, [upload, uploading]);

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};
