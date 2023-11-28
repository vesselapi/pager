import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';

import { TRPCProvider } from '~/utils/api';

import '../styles.css';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from "expo-constants"
import { SignedOut, SignedIn } from '@clerk/clerk-react';
import SignInWithOAuth from './_components/SignInWithOAuth';
import { Text } from 'react-native';

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
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey} tokenCache={tokenCache}>
      <TRPCProvider>
        <SignedIn>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: 'white',
              },
            }}
          />
          <StatusBar />
        </SignedIn>
        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
