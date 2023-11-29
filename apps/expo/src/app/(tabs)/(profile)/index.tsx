import { Button, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

import { useUser } from '../../hooks/useUser';

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <View className="mx-10 rounded border border-slate-400">
            <Button
                color="red"
                title="Sign Out"
                onPress={() => {
                    void signOut();
                }}
            />
        </View>
    );
};

const ProfilePage = () => {
    const user = useUser();

    return (
        <View className="relative h-full bg-white">
            <Stack.Screen options={{ title: 'Profile' }} />
            <View className="mb-4 mt-4 px-10 py-2">
                <Text className="mb-1.5 mr-2 text-4xl font-medium">
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-xl text-gray-500">{user?.email}</Text>
            </View>
            <View className="absolute bottom-10 w-full">
                <SignOut />
            </View>
        </View>
    );
};

export default ProfilePage;
