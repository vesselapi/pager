import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SchedulePage from './(schedule)';
import ProfilePage from './(profile)';
import AlertListPage from './(alerts)';

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
    return (
        <Tab.Navigator initialRouteName="home">
            <Tab.Screen name="(alerts)" component={AlertListPage} />
            <Tab.Screen name="(schedule)" component={SchedulePage} />
            <Tab.Screen name="(profile)" component={ProfilePage} />
        </Tab.Navigator>
    );
}

export default TabsLayout