import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Button, Image, SafeAreaView, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useWarmUpBrowser } from './hooks/warmUpBrowser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import logoUri from './logo'

WebBrowser.maybeCompleteAuthSession();


const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

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
          // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
          throw new Error(
            'There are unmet requirements, modify this else to handle them',
          );
        }
      } catch (err) {
        console.error('OAuth error', err);
      }
    }, [startFlow]);

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4 bg-[#181818] flex-col justify-center">
        <View className='w-full flex items-center'>
          <Image className='h-[100px] w-[100px] mb-10' source={{ uri: logoUri }} />
        </View>
        <View className="rounded-lg border-2 bg-white p-4 mb-4">
          <TouchableOpacity onPress={useCreateOnPress(startOAuthFlowGoogle)} >
            <View className='w-full flex-row items-center justify-center '>
              <FontAwesome name="google" size={24} color="black" className='mr-3' />
              <Text className='text-xl'>Sign in with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="rounded-lg border-2 bg-white p-4 mb-4">
          <TouchableOpacity onPress={useCreateOnPress(startOAuthFlowGoogle)} >
            <View className='w-full flex-row items-center justify-center'>
              <FontAwesome name="github" size={24} color="black" className='mr-3' />
              <Text className='text-xl'>Sign in with Github</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInWithOAuth;
