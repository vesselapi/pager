import { Text, View } from 'react-native';
import { Stack } from 'expo-router';

const SchedulePage = () => {
  return (
    <View>
      <Stack.Screen options={{ title: 'Schedules' }} />
      <Text>Coming soon...</Text>
    </View>
  );
};

export default SchedulePage;
