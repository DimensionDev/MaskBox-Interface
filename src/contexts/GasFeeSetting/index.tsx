import React, { FC, useCallback, useContext, useState } from 'react';
import { GasFeeResult, GasFeeSettingDialog } from './GasFeeSettingDialog';

interface ContextOptions {
  requestGasFee: () => Promise<GasFeeResult>;
}

export const GasFeeSettingContext = React.createContext<ContextOptions>(null!);
export const useGasFeeSetting = () => useContext(GasFeeSettingContext);

interface Request {
  resolve: (result: GasFeeResult) => void;
  reject: (reason: any) => void;
}

export const GasSettingProvider: FC = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>([]);

  const handleRequest = useCallback(async () => {
    let resolve: Request['resolve'];
    let reject: Request['reject'];
    const promise = new Promise<GasFeeResult>((res, rej) => {
      resolve = (result) => {
        res(result);
      };
      reject = rej;
    });
    setRequests((reqs) => [
      ...reqs,
      {
        resolve,
        reject,
      },
    ]);
    return promise;
  }, []);
  const value = {
    requestGasFee: handleRequest,
  };
  return (
    <GasFeeSettingContext.Provider value={value}>
      {children}
      {requests.map((request, index) => (
        <GasFeeSettingDialog
          key={index}
          open
          onConfirm={(result) => {
            request.resolve(result);
            setRequests((reqs) => reqs.filter((req) => req !== request));
          }}
          onClose={() => {
            request.reject(null);
            setRequests((reqs) => reqs.filter((req) => req !== request));
          }}
        />
      ))}
    </GasFeeSettingContext.Provider>
  );
};
