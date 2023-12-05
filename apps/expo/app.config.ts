import type { ExpoConfig } from '@expo/config';

const defineConfig = (): ExpoConfig => ({
  owner: 'vessel',
  name: 'Pager',
  slug: 'vessel',
  scheme: 'expo',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#171717',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/d90f23a9-bbca-450d-abca-0b42c78c9353',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.vessel.pager',
    supportsTablet: true,
  },
  android: {
    package: 'com.vessel.pager',
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#1F104A',
    },
    googleServicesFile: './google-services.json',
  },
  extra: {
    /**
     * NOTE(@zkirby): There must be a .env file with this variable in the same
     * directory as the app.config file for expo to pick this up.
     */
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    eas: { projectId: 'd90f23a9-bbca-450d-abca-0b42c78c9353' },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: ['expo-router', './expo-plugins/with-modify-gradle.js'],
});

export default defineConfig;
