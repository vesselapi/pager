import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

const SchedulePage = () => {
  return (
    <View>
      <Stack.Screen options={{ title: 'Schedules' }} />
      <Text>Coming soon...</Text>
    </View>
  );
};

export default SchedulePage;
