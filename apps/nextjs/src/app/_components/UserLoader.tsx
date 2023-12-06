import { useEffect } from 'react';
import { api } from '../../utils/api';
import Loader from './Loader';

/**
 * This component is responsible for ensuring that the user *in our DB*
 * is created. This is different from (but 1:1 with) the Clerk user.
 *
 * It's important that this mounts high in the component tree and
 * prevents any children that might make API calls from rendering
 * since almost every API call relies on the User being created
 * in our DB.
 *
 * TODO(@zkirby): Think up a better solution here. We're essentially blocking
 * the entire app from rendering for no reason (other than when the user is first created).
 * Likely, we're not using Clerk correctly or under utilizing some functionality.
 */
const UserLoader = ({ children }: React.PropsWithChildren) => {
  const ensureUserIsCreated = api.user.create.useMutation();

  useEffect(() => {
    ensureUserIsCreated.mutate();
  }, []);

  return (
    // NOTE(@zkirby): Keep spinning until we're sure the user is created,
    // if we use 'isFetching' here, we'll render sub-tree once until the
    // api calls kicks off.
    <Loader status={{ loading: !ensureUserIsCreated.isSuccess }}>
      {children}
    </Loader>
  );
};

export default UserLoader;
