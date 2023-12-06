import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useWarmUpBrowser } from './hooks/warmUpBrowser';
import logoUri from './logo';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();

  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({
    strategy: 'oauth_github',
  });

  const useCreateOnPress = (startFlow: typeof startOAuthFlowGoogle) =>
    React.useCallback(async () => {
      try {
        const { createdSessionId, setActive } = await startFlow();

        if (createdSessionId) {
          // NOTE(@zkirby): I have no idea why 'setActive' can be
          // undefined, I'm guessing this is poor typing.
          await setActive!({ session: createdSessionId });
        } else {
          // NOTE: Do nothing if they don't complete the sign in flow.
          return;
        }
      } catch (err) {
        console.error('OAuth error', err);
      }
    }, [startFlow]);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignIn = await signIn.create({
        identifier: 'avery+guest@vessel.dev',
        password: 'vesselguest',
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4 bg-[#181818] flex-col justify-center">
        <View className="w-full flex items-center">
          <Image
            className="h-[100px] w-[100px] mb-10"
            source={{ uri: logoUri }}
          />
        </View>
        <View className="rounded-lg border-2 bg-white p-4 mb-4">
          <TouchableOpacity onPress={useCreateOnPress(startOAuthFlowGoogle)}>
            <View className="w-full flex-row items-center justify-center ">
              <FontAwesome
                name="google"
                size={24}
                color="black"
                className="mr-3"
              />
              <Text className="text-xl">Sign in with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="rounded-lg border-2 bg-white p-4 mb-4">
          <TouchableOpacity onPress={useCreateOnPress(startOAuthFlowGitHub)}>
            <View className="w-full flex-row items-center justify-center">
              <FontAwesome
                name="github"
                size={24}
                color="black"
                className="mr-3"
              />
              <Text className="text-xl">Sign in with Github</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="p-4 mb-4">
          <TouchableOpacity onPress={onSignInPress}>
            <View className="w-full flex-row items-center justify-center">
              <Text className="text-xl text-slate-200">Continue as guest</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInWithOAuth;
