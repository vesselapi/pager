'use client';

import { useRouter } from 'next/navigation';

import Button from '~/app/_components/Button';
import Spinner from '~/app/_components/Spinner';
import { api } from '~/utils/api';

const Sentry = () => {
  const integrations = api.integration.list.useQuery();
  const integration = integrations.data?.integrations?.find(
    (integration) => integration.appId === 'sentry',
  );
  const getOAuthLink = api.integration.oauthStart.useMutation();
  const router = useRouter();
  const connectIntegration = async () => {
    const { authUrl } = await getOAuthLink.mutateAsync({ appId: 'sentry' });
    router.push(authUrl);
  };

  return (
    <div className="mx-10 my-10">
      <h1>Sentry</h1>

      {integrations.isFetching ? (
        <Spinner className="mt-5 px-10" />
      ) : integration?.isConnected ? (
        <Button disabled>Connected</Button>
      ) : (
        <Button onClick={connectIntegration}>Connect</Button>
      )}
    </div>
  );
};

export default Sentry;
