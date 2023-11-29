import { useAuth } from "@clerk/clerk-expo";
import { Button, Text, View } from "react-native"
import { useUser } from "../../hooks/useUser";
import { Stack } from "expo-router";
// import { api } from "~/utils/api"

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <View className='border rounded mx-10 border-slate-400'>
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
    const user = useUser()

    return (
        <View className="h-full bg-white relative">
            <Stack.Screen options={{ title: 'Profile' }} />
            <View className='mb-4 px-10 py-2 mt-4'>
                <Text className='mr-2 mb-1.5 text-4xl font-medium'>{user?.firstName}{" "}{user?.lastName}</Text>
                <Text className='text-gray-500 text-xl'>{user?.email}</Text>
            </View>
            <View className="absolute bottom-10 w-full">
                <SignOut />
            </View>
        </View>
    )
}

export default ProfilePage