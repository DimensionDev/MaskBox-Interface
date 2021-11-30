import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: string;
  Bytes: string;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};

export type Maskbox = {
  __typename?: 'Maskbox';
  blockNumber: Scalars['BigInt'];
  box_id: Scalars['String'];
  canceled: Scalars['Boolean'];
  chain_id: Scalars['Int'];
  claimed: Scalars['Boolean'];
  create_time: Scalars['Int'];
  creator: Scalars['Bytes'];
  drawed_by_customer: Array<Scalars['BigInt']>;
  end_time: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nft_address: Scalars['Bytes'];
  nft_contract: NftContract;
  sell_all: Scalars['Boolean'];
  sold_nft_list: Array<Scalars['BigInt']>;
  start_time: Scalars['Int'];
  tx_hash: Scalars['Bytes'];
};

export type Maskbox_Filter = {
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  box_id?: Maybe<Scalars['String']>;
  box_id_contains?: Maybe<Scalars['String']>;
  box_id_ends_with?: Maybe<Scalars['String']>;
  box_id_gt?: Maybe<Scalars['String']>;
  box_id_gte?: Maybe<Scalars['String']>;
  box_id_in?: Maybe<Array<Scalars['String']>>;
  box_id_lt?: Maybe<Scalars['String']>;
  box_id_lte?: Maybe<Scalars['String']>;
  box_id_not?: Maybe<Scalars['String']>;
  box_id_not_contains?: Maybe<Scalars['String']>;
  box_id_not_ends_with?: Maybe<Scalars['String']>;
  box_id_not_in?: Maybe<Array<Scalars['String']>>;
  box_id_not_starts_with?: Maybe<Scalars['String']>;
  box_id_starts_with?: Maybe<Scalars['String']>;
  canceled?: Maybe<Scalars['Boolean']>;
  canceled_in?: Maybe<Array<Scalars['Boolean']>>;
  canceled_not?: Maybe<Scalars['Boolean']>;
  canceled_not_in?: Maybe<Array<Scalars['Boolean']>>;
  chain_id?: Maybe<Scalars['Int']>;
  chain_id_gt?: Maybe<Scalars['Int']>;
  chain_id_gte?: Maybe<Scalars['Int']>;
  chain_id_in?: Maybe<Array<Scalars['Int']>>;
  chain_id_lt?: Maybe<Scalars['Int']>;
  chain_id_lte?: Maybe<Scalars['Int']>;
  chain_id_not?: Maybe<Scalars['Int']>;
  chain_id_not_in?: Maybe<Array<Scalars['Int']>>;
  claimed?: Maybe<Scalars['Boolean']>;
  claimed_in?: Maybe<Array<Scalars['Boolean']>>;
  claimed_not?: Maybe<Scalars['Boolean']>;
  claimed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  create_time?: Maybe<Scalars['Int']>;
  create_time_gt?: Maybe<Scalars['Int']>;
  create_time_gte?: Maybe<Scalars['Int']>;
  create_time_in?: Maybe<Array<Scalars['Int']>>;
  create_time_lt?: Maybe<Scalars['Int']>;
  create_time_lte?: Maybe<Scalars['Int']>;
  create_time_not?: Maybe<Scalars['Int']>;
  create_time_not_in?: Maybe<Array<Scalars['Int']>>;
  creator?: Maybe<Scalars['Bytes']>;
  creator_contains?: Maybe<Scalars['Bytes']>;
  creator_in?: Maybe<Array<Scalars['Bytes']>>;
  creator_not?: Maybe<Scalars['Bytes']>;
  creator_not_contains?: Maybe<Scalars['Bytes']>;
  creator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  drawed_by_customer?: Maybe<Array<Scalars['BigInt']>>;
  drawed_by_customer_contains?: Maybe<Array<Scalars['BigInt']>>;
  drawed_by_customer_not?: Maybe<Array<Scalars['BigInt']>>;
  drawed_by_customer_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  end_time?: Maybe<Scalars['Int']>;
  end_time_gt?: Maybe<Scalars['Int']>;
  end_time_gte?: Maybe<Scalars['Int']>;
  end_time_in?: Maybe<Array<Scalars['Int']>>;
  end_time_lt?: Maybe<Scalars['Int']>;
  end_time_lte?: Maybe<Scalars['Int']>;
  end_time_not?: Maybe<Scalars['Int']>;
  end_time_not_in?: Maybe<Array<Scalars['Int']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  nft_address?: Maybe<Scalars['Bytes']>;
  nft_address_contains?: Maybe<Scalars['Bytes']>;
  nft_address_in?: Maybe<Array<Scalars['Bytes']>>;
  nft_address_not?: Maybe<Scalars['Bytes']>;
  nft_address_not_contains?: Maybe<Scalars['Bytes']>;
  nft_address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  nft_contract?: Maybe<Scalars['String']>;
  nft_contract_contains?: Maybe<Scalars['String']>;
  nft_contract_ends_with?: Maybe<Scalars['String']>;
  nft_contract_gt?: Maybe<Scalars['String']>;
  nft_contract_gte?: Maybe<Scalars['String']>;
  nft_contract_in?: Maybe<Array<Scalars['String']>>;
  nft_contract_lt?: Maybe<Scalars['String']>;
  nft_contract_lte?: Maybe<Scalars['String']>;
  nft_contract_not?: Maybe<Scalars['String']>;
  nft_contract_not_contains?: Maybe<Scalars['String']>;
  nft_contract_not_ends_with?: Maybe<Scalars['String']>;
  nft_contract_not_in?: Maybe<Array<Scalars['String']>>;
  nft_contract_not_starts_with?: Maybe<Scalars['String']>;
  nft_contract_starts_with?: Maybe<Scalars['String']>;
  sell_all?: Maybe<Scalars['Boolean']>;
  sell_all_in?: Maybe<Array<Scalars['Boolean']>>;
  sell_all_not?: Maybe<Scalars['Boolean']>;
  sell_all_not_in?: Maybe<Array<Scalars['Boolean']>>;
  sold_nft_list?: Maybe<Array<Scalars['BigInt']>>;
  sold_nft_list_contains?: Maybe<Array<Scalars['BigInt']>>;
  sold_nft_list_not?: Maybe<Array<Scalars['BigInt']>>;
  sold_nft_list_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  start_time?: Maybe<Scalars['Int']>;
  start_time_gt?: Maybe<Scalars['Int']>;
  start_time_gte?: Maybe<Scalars['Int']>;
  start_time_in?: Maybe<Array<Scalars['Int']>>;
  start_time_lt?: Maybe<Scalars['Int']>;
  start_time_lte?: Maybe<Scalars['Int']>;
  start_time_not?: Maybe<Scalars['Int']>;
  start_time_not_in?: Maybe<Array<Scalars['Int']>>;
  tx_hash?: Maybe<Scalars['Bytes']>;
  tx_hash_contains?: Maybe<Scalars['Bytes']>;
  tx_hash_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_hash_not?: Maybe<Scalars['Bytes']>;
  tx_hash_not_contains?: Maybe<Scalars['Bytes']>;
  tx_hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum Maskbox_OrderBy {
  BlockNumber = 'blockNumber',
  BoxId = 'box_id',
  Canceled = 'canceled',
  ChainId = 'chain_id',
  Claimed = 'claimed',
  CreateTime = 'create_time',
  Creator = 'creator',
  DrawedByCustomer = 'drawed_by_customer',
  EndTime = 'end_time',
  Id = 'id',
  Name = 'name',
  NftAddress = 'nft_address',
  NftContract = 'nft_contract',
  SellAll = 'sell_all',
  SoldNftList = 'sold_nft_list',
  StartTime = 'start_time',
  TxHash = 'tx_hash',
}

export type NftContract = {
  __typename?: 'NFTContract';
  address: Scalars['Bytes'];
  chain_id: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type NftContract_Filter = {
  address?: Maybe<Scalars['Bytes']>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  chain_id?: Maybe<Scalars['Int']>;
  chain_id_gt?: Maybe<Scalars['Int']>;
  chain_id_gte?: Maybe<Scalars['Int']>;
  chain_id_in?: Maybe<Array<Scalars['Int']>>;
  chain_id_lt?: Maybe<Scalars['Int']>;
  chain_id_lte?: Maybe<Scalars['Int']>;
  chain_id_not?: Maybe<Scalars['Int']>;
  chain_id_not_in?: Maybe<Array<Scalars['Int']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
};

export enum NftContract_OrderBy {
  Address = 'address',
  ChainId = 'chain_id',
  Id = 'id',
  Name = 'name',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  maskbox?: Maybe<Maskbox>;
  maskboxes: Array<Maskbox>;
  nftcontract?: Maybe<NftContract>;
  nftcontracts: Array<NftContract>;
};

export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type QueryMaskboxArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMaskboxesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Maskbox_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Maskbox_Filter>;
};

export type QueryNftcontractArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryNftcontractsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<NftContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<NftContract_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  maskbox?: Maybe<Maskbox>;
  maskboxes: Array<Maskbox>;
  nftcontract?: Maybe<NftContract>;
  nftcontracts: Array<NftContract>;
};

export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type SubscriptionMaskboxArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMaskboxesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Maskbox_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Maskbox_Filter>;
};

export type SubscriptionNftcontractArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionNftcontractsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<NftContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<NftContract_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** The minimum block number */
  number_gte: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type MaskBoxQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type MaskBoxQuery = {
  __typename?: 'Query';
  maskbox?:
    | {
        __typename?: 'Maskbox';
        id: string;
        box_id: string;
        chain_id: number;
        name: string;
        creator: string;
        nft_address: string;
        start_time: number;
        end_time: number;
        sell_all: boolean;
        nft_contract: { __typename?: 'NFTContract'; address: string; name: string };
      }
    | null
    | undefined;
};

export type MaskBoxesQueryVariables = Exact<{
  first?: Scalars['Int'];
  skip?: Scalars['Int'];
}>;

export type MaskBoxesQuery = {
  __typename?: 'Query';
  maskboxes: Array<{
    __typename?: 'Maskbox';
    id: string;
    box_id: string;
    chain_id: number;
    name: string;
    creator: string;
    nft_address: string;
    start_time: number;
    end_time: number;
    sell_all: boolean;
    nft_contract: { __typename?: 'NFTContract'; address: string; name: string };
  }>;
};

export type MaskBoxesOfQueryVariables = Exact<{
  first?: Scalars['Int'];
  skip?: Scalars['Int'];
  account: Scalars['Bytes'];
}>;

export type MaskBoxesOfQuery = {
  __typename?: 'Query';
  maskboxes: Array<{
    __typename?: 'Maskbox';
    id: string;
    box_id: string;
    chain_id: number;
    name: string;
    creator: string;
    nft_address: string;
    start_time: number;
    end_time: number;
    sell_all: boolean;
    canceled: boolean;
    claimed: boolean;
    sold_nft_list: Array<string>;
    drawed_by_customer: Array<string>;
    nft_contract: { __typename?: 'NFTContract'; address: string; name: string };
  }>;
};

export type MaskBoxClaimedStatusQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type MaskBoxClaimedStatusQuery = {
  __typename?: 'Query';
  maskbox?: { __typename?: 'Maskbox'; id: string; claimed: boolean } | null | undefined;
};

export type CheckMaskBoxesOfQueryVariables = Exact<{
  account: Scalars['Bytes'];
}>;

export type CheckMaskBoxesOfQuery = {
  __typename?: 'Query';
  maskboxes: Array<{ __typename?: 'Maskbox'; id: string }>;
};

export type SoldNftListQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type SoldNftListQuery = {
  __typename?: 'Query';
  maskbox?:
    | { __typename?: 'Maskbox'; id: string; drawed_by_customer: Array<string> }
    | null
    | undefined;
};

export const MaskBoxDocument = gql`
  query MaskBox($id: ID!) {
    maskbox(id: $id) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      nft_contract {
        address
        name
      }
    }
  }
`;

/**
 * __useMaskBoxQuery__
 *
 * To run a query within a React component, call `useMaskBoxQuery` and pass it any options that fit your needs.
 * When your component renders, `useMaskBoxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMaskBoxQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMaskBoxQuery(
  baseOptions: Apollo.QueryHookOptions<MaskBoxQuery, MaskBoxQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MaskBoxQuery, MaskBoxQueryVariables>(MaskBoxDocument, options);
}
export function useMaskBoxLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MaskBoxQuery, MaskBoxQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MaskBoxQuery, MaskBoxQueryVariables>(MaskBoxDocument, options);
}
export type MaskBoxQueryHookResult = ReturnType<typeof useMaskBoxQuery>;
export type MaskBoxLazyQueryHookResult = ReturnType<typeof useMaskBoxLazyQuery>;
export type MaskBoxQueryResult = Apollo.QueryResult<MaskBoxQuery, MaskBoxQueryVariables>;
export const MaskBoxesDocument = gql`
  query MaskBoxes($first: Int! = 10, $skip: Int! = 0) {
    maskboxes(
      orderBy: create_time
      orderDirection: desc
      first: $first
      skip: $skip
      where: { canceled: false, id_gt: 3 }
    ) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      nft_contract {
        address
        name
      }
    }
  }
`;

/**
 * __useMaskBoxesQuery__
 *
 * To run a query within a React component, call `useMaskBoxesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMaskBoxesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMaskBoxesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useMaskBoxesQuery(
  baseOptions?: Apollo.QueryHookOptions<MaskBoxesQuery, MaskBoxesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MaskBoxesQuery, MaskBoxesQueryVariables>(MaskBoxesDocument, options);
}
export function useMaskBoxesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MaskBoxesQuery, MaskBoxesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MaskBoxesQuery, MaskBoxesQueryVariables>(MaskBoxesDocument, options);
}
export type MaskBoxesQueryHookResult = ReturnType<typeof useMaskBoxesQuery>;
export type MaskBoxesLazyQueryHookResult = ReturnType<typeof useMaskBoxesLazyQuery>;
export type MaskBoxesQueryResult = Apollo.QueryResult<MaskBoxesQuery, MaskBoxesQueryVariables>;
export const MaskBoxesOfDocument = gql`
  query MaskBoxesOf($first: Int! = 10, $skip: Int! = 0, $account: Bytes!) {
    maskboxes(
      orderBy: create_time
      orderDirection: desc
      first: $first
      skip: $skip
      where: { creator: $account }
    ) {
      id
      box_id
      chain_id
      name
      creator
      nft_address
      start_time
      end_time
      sell_all
      canceled
      claimed
      nft_contract {
        address
        name
      }
      sold_nft_list
      drawed_by_customer
    }
  }
`;

/**
 * __useMaskBoxesOfQuery__
 *
 * To run a query within a React component, call `useMaskBoxesOfQuery` and pass it any options that fit your needs.
 * When your component renders, `useMaskBoxesOfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMaskBoxesOfQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      account: // value for 'account'
 *   },
 * });
 */
export function useMaskBoxesOfQuery(
  baseOptions: Apollo.QueryHookOptions<MaskBoxesOfQuery, MaskBoxesOfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MaskBoxesOfQuery, MaskBoxesOfQueryVariables>(MaskBoxesOfDocument, options);
}
export function useMaskBoxesOfLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MaskBoxesOfQuery, MaskBoxesOfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MaskBoxesOfQuery, MaskBoxesOfQueryVariables>(
    MaskBoxesOfDocument,
    options,
  );
}
export type MaskBoxesOfQueryHookResult = ReturnType<typeof useMaskBoxesOfQuery>;
export type MaskBoxesOfLazyQueryHookResult = ReturnType<typeof useMaskBoxesOfLazyQuery>;
export type MaskBoxesOfQueryResult = Apollo.QueryResult<
  MaskBoxesOfQuery,
  MaskBoxesOfQueryVariables
>;
export const MaskBoxClaimedStatusDocument = gql`
  query MaskBoxClaimedStatus($id: ID!) {
    maskbox(id: $id) {
      id
      claimed
    }
  }
`;

/**
 * __useMaskBoxClaimedStatusQuery__
 *
 * To run a query within a React component, call `useMaskBoxClaimedStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useMaskBoxClaimedStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMaskBoxClaimedStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMaskBoxClaimedStatusQuery(
  baseOptions: Apollo.QueryHookOptions<
    MaskBoxClaimedStatusQuery,
    MaskBoxClaimedStatusQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MaskBoxClaimedStatusQuery, MaskBoxClaimedStatusQueryVariables>(
    MaskBoxClaimedStatusDocument,
    options,
  );
}
export function useMaskBoxClaimedStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MaskBoxClaimedStatusQuery,
    MaskBoxClaimedStatusQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MaskBoxClaimedStatusQuery, MaskBoxClaimedStatusQueryVariables>(
    MaskBoxClaimedStatusDocument,
    options,
  );
}
export type MaskBoxClaimedStatusQueryHookResult = ReturnType<typeof useMaskBoxClaimedStatusQuery>;
export type MaskBoxClaimedStatusLazyQueryHookResult = ReturnType<
  typeof useMaskBoxClaimedStatusLazyQuery
>;
export type MaskBoxClaimedStatusQueryResult = Apollo.QueryResult<
  MaskBoxClaimedStatusQuery,
  MaskBoxClaimedStatusQueryVariables
>;
export const CheckMaskBoxesOfDocument = gql`
  query CheckMaskBoxesOf($account: Bytes!) {
    maskboxes(first: 1) {
      id
    }
  }
`;

/**
 * __useCheckMaskBoxesOfQuery__
 *
 * To run a query within a React component, call `useCheckMaskBoxesOfQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckMaskBoxesOfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckMaskBoxesOfQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useCheckMaskBoxesOfQuery(
  baseOptions: Apollo.QueryHookOptions<CheckMaskBoxesOfQuery, CheckMaskBoxesOfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CheckMaskBoxesOfQuery, CheckMaskBoxesOfQueryVariables>(
    CheckMaskBoxesOfDocument,
    options,
  );
}
export function useCheckMaskBoxesOfLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CheckMaskBoxesOfQuery, CheckMaskBoxesOfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CheckMaskBoxesOfQuery, CheckMaskBoxesOfQueryVariables>(
    CheckMaskBoxesOfDocument,
    options,
  );
}
export type CheckMaskBoxesOfQueryHookResult = ReturnType<typeof useCheckMaskBoxesOfQuery>;
export type CheckMaskBoxesOfLazyQueryHookResult = ReturnType<typeof useCheckMaskBoxesOfLazyQuery>;
export type CheckMaskBoxesOfQueryResult = Apollo.QueryResult<
  CheckMaskBoxesOfQuery,
  CheckMaskBoxesOfQueryVariables
>;
export const SoldNftListDocument = gql`
  query SoldNFTList($id: ID!) {
    maskbox(id: $id) {
      id
      drawed_by_customer
    }
  }
`;

/**
 * __useSoldNftListQuery__
 *
 * To run a query within a React component, call `useSoldNftListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSoldNftListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSoldNftListQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSoldNftListQuery(
  baseOptions: Apollo.QueryHookOptions<SoldNftListQuery, SoldNftListQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SoldNftListQuery, SoldNftListQueryVariables>(SoldNftListDocument, options);
}
export function useSoldNftListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SoldNftListQuery, SoldNftListQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SoldNftListQuery, SoldNftListQueryVariables>(
    SoldNftListDocument,
    options,
  );
}
export type SoldNftListQueryHookResult = ReturnType<typeof useSoldNftListQuery>;
export type SoldNftListLazyQueryHookResult = ReturnType<typeof useSoldNftListLazyQuery>;
export type SoldNftListQueryResult = Apollo.QueryResult<
  SoldNftListQuery,
  SoldNftListQueryVariables
>;
