'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Spinner from '~/app/_components/Spinner';
import { api } from '~/utils/api';
import { PageProps } from '.next/types/app/layout';

const OAuthCallbackPage = ({ params }: PageProps) => {
  const getOAuthCallback = api.integration.oauthCallback.useMutation();
  const router = useRouter();
  const callbackParams = {
    appId: params.appId,
    ...Object.fromEntries([...useSearchParams()]),
  } as Parameters<(typeof getOAuthCallback)['mutateAsync']>[0];
  useEffect(() => {
    getOAuthCallback
      .mutateAsync(callbackParams)
      .then(() => router.push(`/settings/integrations/${params.appId}`));
  }, []);
  return (
    <div className="mx-10 my-10">
      <Spinner className="mt-5 px-10" />
    </div>
  );
};

export default OAuthCallbackPage;
