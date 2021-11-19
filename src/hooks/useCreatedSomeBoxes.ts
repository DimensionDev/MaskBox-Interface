import { useWeb3Context } from '@/contexts';
import { useCheckMaskBoxesOfLazyQuery } from '@/graphql-hooks';
import { useEffect } from 'react';

export function useCreatedSomeBoxes(): boolean {
  const { account } = useWeb3Context();
  const [fetch, { data }] = useCheckMaskBoxesOfLazyQuery();
  useEffect(() => {
    if (!account) return;
    fetch({
      variables: {
        account,
      },
    });
  }, [fetch, account]);

  return data ? data.maskboxes.length > 0 : false;
}
