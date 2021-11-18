import { getSubgraphEndpoint } from '@/lib';
import {
  ApolloProvider as Provider,
  ApolloClient,
  NormalizedCacheObject,
  from as fromLinks,
  HttpLink,
  InMemoryCache,
  WatchQueryOptions,
  QueryOptions,
} from '@apollo/client';
import { FC, useMemo } from 'react';
import { useWeb3Context } from '../Web3Context';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  } as WatchQueryOptions,
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  } as QueryOptions,
};

const hashQuery = location.hash.slice(location.hash.indexOf('?'));
const urlChain = new URLSearchParams(location.search).get('chain');
const hashChain = new URLSearchParams(hashQuery).get('chain');
const fallbackChain = parseInt(urlChain || hashChain || '1', 10);

export const ApolloProvider: FC = ({ children }) => {
  const { providerChainId } = useWeb3Context();

  const apolloClient: ApolloClient<NormalizedCacheObject> = useMemo(() => {
    const endpoint = getSubgraphEndpoint(providerChainId ?? fallbackChain);
    const httpLink = new HttpLink({
      uri: endpoint,
      fetch: fetch,
    });

    return new ApolloClient({
      link: fromLinks([httpLink]),
      cache: new InMemoryCache(),
      defaultOptions,
    });
  }, [providerChainId]);

  return <Provider client={apolloClient}>{children}</Provider>;
};
