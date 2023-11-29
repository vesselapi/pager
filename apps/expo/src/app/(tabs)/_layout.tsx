import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SchedulePage from './(schedule)';
import ProfilePage from './(profile)';
import AlertListPage from './(alerts)';
import FeatherIcons from '@expo/vector-icons/Feather'
import { useUser } from '../hooks/useUser';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
    const user = useUser();

    return (
        <Tab.Navigator initialRouteName="alerts" screenOptions={{
            tabBarShowLabel: false
        }}>
            <Tab.Screen options={{
                tabBarIcon: ({ color, size }) => (
                    <FeatherIcons name="bell" color={color} size={size} />
                ),
            }} name="(alerts)" component={AlertListPage} />
            <Tab.Screen options={{
                tabBarIcon: ({ color, size }) => (
                    <FeatherIcons name="calendar" color={color} size={size} />
                ),
            }} name="(schedule)" component={SchedulePage} />
            <Tab.Screen options={{
                tabBarIcon: ({ size }) => {
                    const initials = (user?.firstName?.charAt(0) ?? '') + (user?.lastName?.charAt(0) ?? '')
                    return <View style={{ height: size, width: size, borderRadius: 100 }} className='bg-gray-500 flex items-center justify-center'><Text className="text-sm text-white">{initials}</Text></View>
                },
            }} name="(profile)" component={ProfilePage} />
        </Tab.Navigator>
    );
}

export default TabsLayout