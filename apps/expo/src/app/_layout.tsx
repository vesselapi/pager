import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';

import { TRPCProvider } from '~/utils/api';

import '../styles.css';

import Constants from 'expo-constants';
import { ClerkProvider } from '@clerk/clerk-expo';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import SignInWithOAuth from './(auth)/SignInWithOAuth';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <Stack>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar />
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth />
      </SignedOut>
    </ClerkProvider>
  );
};

export default RootLayout;
