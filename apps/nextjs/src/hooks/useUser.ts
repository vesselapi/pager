import { useEffect, useState } from 'react';

import type { RouterOutputs } from '~/utils/api';
import { api } from '~/utils/api';

/**
 * Hook for retrieving or creating the user
 */
export function useUser() {
  const [user, setUser] = useState<RouterOutputs['user']['me']['user']>();

  const createOrGetUser = api.user.me.useMutation({
    onSuccess: (result) => result?.user && setUser(result.user),
  });

  useEffect(() => {
    createOrGetUser.mutate();
  }, []);

  return user;
}
