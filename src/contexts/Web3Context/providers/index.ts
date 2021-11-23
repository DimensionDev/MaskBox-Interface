export * from './addChainToWallet';

import { getInjectedProvider } from './injected';
enum ProviderType {
  Injected = 'injected',
}

export default function getProvider(type: string) {
  switch (type) {
    case ProviderType.Injected:
      return getInjectedProvider();
  }
}
