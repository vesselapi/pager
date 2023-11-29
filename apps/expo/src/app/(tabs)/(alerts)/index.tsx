import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '~/utils/api';
import { useUser } from '../../hooks/useUser';
import AlertListItem from './_components/AlertListItem';
import { Stack } from 'expo-router';

const AlertsList = ({ alerts, user }) => {
  return (
    <FlatList
      data={alerts}
      renderItem={({ item }) => <AlertListItem alert={item} user={user} />}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

const AlertListPage = () => {
  const alerts = api.alert.all.useQuery({});
  const user = useUser();

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Alerts' }} />
      {/* TODO(@zkriby): figure out why the element is taking up the whole screen without putting absolute on it. */}
      <View className="absolute top-0 h-screen bg-white">
        {alerts.isFetching || !user ? (
          <ActivityIndicator />
        ) : (
          <AlertsList alerts={alerts.data} user={user} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AlertListPage;
