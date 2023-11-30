import FeatherIcons from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useUser } from '../hooks/useUser';
import AlertListPage from './(alerts)';
import ProfilePage from './(profile)';

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  const user = useUser();

  return (
    <Tab.Navigator
      initialRouteName="alerts"
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <FeatherIcons name="bell" color={color} size={size} />
          ),
        }}
        name="(alerts)"
        component={AlertListPage}
      />
      {/* [@zkirby]TODO: turn this back on when we have an actual schedule part of the product */}
      {/* <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <FeatherIcons name="calendar" color={color} size={size} />
          ),
        }}
        name="(schedule)"
        component={SchedulePage}
      /> */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ size }) => {
            const initials =
              (user?.firstName?.charAt(0) ?? '') +
              (user?.lastName?.charAt(0) ?? '');
            return (
              <View
                style={{ height: size, width: size, borderRadius: 100 }}
                className="flex items-center justify-center bg-gray-500"
              >
                <Text className="text-sm text-white">{initials}</Text>
              </View>
            );
          },
        }}
        name="(profile)"
        component={ProfilePage}
      />
    </Tab.Navigator>
  );
};

export default TabsLayout;
