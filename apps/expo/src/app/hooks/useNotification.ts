import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { api } from '~/utils/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Hook for retrieving or creating the user
 */
export function useNotification() {
  const updateUserExpoPushToken = api.user.updateExpoPushToken.useMutation();
  const requestPushToken = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return null;
    } else {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        return;
      }

      const { status: requestStatus } =
        await Notifications.requestPermissionsAsync();

      if (requestStatus !== 'granted') {
        alert('You will not receive any notifications for any alerts!');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig!.extra!.eas.projectId,
      });
      return token.data;
    }
  };

  useEffect(() => {
    requestPushToken().then((expoPushToken) => {
      if (!expoPushToken) {
        return;
      }
      updateUserExpoPushToken.mutate({ expoPushToken });
    });
  }, []);
}
