'use client';

import { useRouter } from 'next/navigation';

import Button from '~/app/_components/Button';
import Loader from '~/app/_components/Loader';
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

      <Loader className="mt-5" status={{ loading: integrations.isFetching }}>
        <Button
          onClick={connectIntegration}
          disabled={integration?.isConnected}
        >
          Connected
        </Button>
      </Loader>
    </div>
  );
};

export default Sentry;
