import { sift } from 'radash';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';
import type { RouterOutputs } from '~/utils/api';
import { api } from '~/utils/api';
import { useUser } from '../../hooks/useUser';
import AlertListItem from './_components/AlertListItem';
import { useSearch } from './hooks/useSearch';

const AlertListPage = () => {
  const [search, setSearch] = useSearch();

  const alerts = api.alert.all.useQuery({
    filters: sift([
      search && {
        property: 'title',
        condition: 'CONTAINS',
        value: search,
      },
    ]),
    sorts: [
      {
        property: 'createdAt',
      },
    ],
  });
  const user = useUser();
  const updateAlert = api.alert.update.useMutation();

  const update = useCallback(
    async (alert: Partial<RouterOutputs['alert']['all']['0']>) => {
      await updateAlert.mutateAsync({ id: alert.id, alert });
      await alerts.refetch();
    },
    [],
  );

  return (
    <SafeAreaView className="">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="h-screen bg-white">
        <TextInput
          placeholder="Search alerts..."
          value={search}
          onChangeText={setSearch}
        />
        <Text>Alerts</Text>
        <View className="bg-white h-screen">
          {alerts.isFetching || !user ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={alerts.data}
              renderItem={({ item }) => (
                <AlertListItem
                  alert={item}
                  user={user}
                  onAck={() => update({ status: 'ACKED' })}
                  onReopen={() => update({ status: 'OPEN' })}
                  onClose={() => update({ status: 'CLOSED' })}
                  onSelfAssign={() => update({ assignedToId: user.id })}
                />
              )}
              keyExtractor={(item) => `${item.id}`}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AlertListPage;
