'use client';

import type { AppId } from '@vessel/types';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useEffect } from 'react';

import Spinner from '~/app/_components/Spinner';
import { api } from '~/utils/api';

const OAuthCallbackPage = ({ params }: { appId: AppId }) => {
  const router = useRouter();
  const getOAuthCallback = api.integration.oauthCallback.useMutation({
    onSuccess: () => {
      router.push(`/settings/integrations/${params.appId}`);
    },
  });
  const callbackParams = {
    appId: params.appId,
    ...Object.fromEntries([...useSearchParams()]),
  } as Parameters<(typeof getOAuthCallback)['mutateAsync']>[0];

  useEffect(() => {
    getOAuthCallback.mutateAsync(callbackParams);
  }, []);

  return (
    <div className="mx-10 my-10">
      Setting up integration... Hang tight!
      <Spinner className="mt-5 px-10" />
    </div>
  );
};

export default OAuthCallbackPage;
