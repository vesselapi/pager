import React from 'react'

import { useOAuth } from "@clerk/clerk-expo";
import { View, SafeAreaView, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../hooks/warmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    useWarmUpBrowser();

    const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({ strategy: "oauth_github" });

    const useCreateOnPress = (startFlow: typeof startOAuthFlowGoogle) => React.useCallback(async () => {
        try {
            const { createdSessionId, setActive } =
                await startFlow();

            if (createdSessionId) {
                // NOTE(@zkirby): I have no idea why 'setActive' can be
                // undefined, I'm guessing this is poor typing.
                await setActive!({ session: createdSessionId });
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, [startFlow]);

    return (
        <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <View className="h-full w-full p-4">
                <View className="rounded-lg border-2 border-gray-500 p-4">
                    <Button
                        title="Sign in with Google"
                        onPress={useCreateOnPress(startOAuthFlowGoogle)}
                    />
                    <Button
                        title="Sign in with Github"
                        onPress={useCreateOnPress(startOAuthFlowGitHub)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignInWithOAuth