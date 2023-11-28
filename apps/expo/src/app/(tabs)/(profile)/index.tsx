import { useAuth } from "@clerk/clerk-expo";
import { Button, Text, View } from "react-native"
import { useUser } from "../../hooks/useUser";
// import { api } from "~/utils/api"

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <View>
            <Button
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
        <View>
            <Text>{user?.firstName}</Text>
            <SignOut />
        </View>
    )
}

export default ProfilePage