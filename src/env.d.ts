interface Ethereum {
  isMetaMask?: boolean;
  isCoin98?: boolean;
  request: (options: { method: string; params?: any[] }) => Promise<any>;
}
interface Window {
  ethereum: Ethereum;
}

declare module 'process' {
  global {
    namespace NodeJS {
      type IGNORE_LABELS =
        | 'IGNORE_IDS_ON_MAINNET'
        | 'IGNORE_IDS_ON_MATIC'
        | 'IGNORE_IDS_ON_BSC'
        | 'IGNORE_IDS_ON_RINKEBY';

      interface ProcessEnv extends Record<IGNORE_LABELS, string> {}
    }
  }
}
