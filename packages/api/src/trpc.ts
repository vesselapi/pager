{
  "name": "@vessel/expo",
  "version": "0.1.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "clean": "git clean -xdf .expo .turbo node_modules",
    "dev:mobile": "expo start --ios",
    "dev:android": "expo start --android",
    "dev:ios": "expo start --ios",
    "lint": "eslint .",
    "format": "prettier --check \"**/*.{js,cjs,mjs,ts,tsx,md,json}\"",
    "typecheck": "tsc --noEmit",
    "android": "expo run:android",
    "ios": "expo run:ios"
  },
  "dependencies": {
    "@expo/metro-config": "^0.10.7",
    "@shopify/flash-list": "1.4.3",
    "@tanstack/react-query": "^5.8.1",
    "@trpc/client": "next",
    "@trpc/react-query": "next",
    "@trpc/server": "next",
    "expo": "^49.0.16",
    "expo-constants": "~14.4.2",
    "expo-linking": "~5.0.2",
    "expo-router": "2.0.11",
    "expo-splash-screen": "~0.22.0",
    "expo-status-bar": "~1.7.1",
    "nativewind": "^4.0.13",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.72.6",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-reanimated": "~3.3.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.1",
    "superjson": "2.2.0"
  },
  "devDependencies": {
    "@vessel/api": "workspace:^0.1.0",
    "@vessel/eslint-config": "workspace:^0.2.0",
    "@vessel/prettier-config": "workspace:^0.1.0",
    "@vessel/tailwind-config": "workspace:^0.1.0",
    "@vessel/tsconfig": "workspace:^0.1.0",
    "@babel/core": "^7.23.2",
    "@babel/preset-env": "^7.23.2",
    "@babel/runtime": "^7.23.2",
    "@expo/config-plugins": "^7.2.5",
    "@types/babel__core": "^7.20.4",
    "@types/react": "^18.2.37",
    "eslint": "^8.53.0",
    "prettier": "^3.0.3",
    "tailwindcss": "3.3.5",
    "typescript": "^5.2.2"
  },
  "eslintConfig": {
    "root": true,
    "extends": [
      "@vessel/eslint-config/base",
      "@vessel/eslint-config/react"
    ],
    "ignorePatterns": [
      "expo-plugins/**"
    ]
  },
  "prettier": "@vessel/prettier-config"
}
