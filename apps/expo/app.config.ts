import type { ExpoConfig } from '@expo/config';

const defineConfig = (): ExpoConfig => ({
  name: 'Pager',
  slug: 'pager',
  scheme: 'expo',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.jpg',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/icon.jpg',
    resizeMode: 'contain',
    backgroundColor: '#171717',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'your.bundle.identifier',
    supportsTablet: true,
  },
  android: {
    package: 'com.vessel.pager',
    adaptiveIcon: {
      foregroundImage: './assets/icon.jpg',
      backgroundColor: '#1F104A',
    },
  },
  extra: {
    /**
     * NOTE(@zkirby): There must be a .env file with this variable in the same
     * directory as the app.config file for expo to pick this up.
     */
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ['expo-router', './expo-plugins/with-modify-gradle.js'],
});

export default defineConfig;
