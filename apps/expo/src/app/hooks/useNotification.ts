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
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
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
