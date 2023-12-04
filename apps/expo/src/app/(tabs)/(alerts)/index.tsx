import { sift } from 'radash';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';
import { api } from '~/utils/api';
import { useUser } from '../../hooks/useUser';
import AlertListItem from './_components/AlertListItem';
import type { Alert } from './alerts.types';
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

  const update = useCallback(async (id: string, alert: Partial<Alert>) => {
    await updateAlert.mutateAsync({ id, alert });
    await alerts.refetch();
  }, []);

  const isLoading = useMemo(
    () => updateAlert.isPending || alerts.isFetching,
    [alerts.isFetching, updateAlert.isPending],
  );

  return (
    <SafeAreaView className="">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="h-screen bg-white">
        <View className="w-full flex-row items-center p-4">
          <TextInput
            className="bg-white h-[40px] w-full px-4 rounded-md shadow"
            style={{
              shadowColor: '#171717',
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 3,
            }}
            placeholder="Search alerts..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Text className="ml-1 px-4 mt-4 mb-1 font-bold text-slate-600 text-sm opacity-70">
          ALERTS
        </Text>
        <View className="bg-white h-screen">
          {isLoading || !user ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={alerts.data}
              contentContainerStyle={{ paddingBottom: 300 }}
              renderItem={({ item }) => (
                <AlertListItem
                  alert={item}
                  user={user}
                  onAck={() => update(item.id, { status: 'ACKED' })}
                  onReopen={() => update(item.id, { status: 'OPEN' })}
                  onClose={() => update(item.id, { status: 'CLOSED' })}
                  onSelfAssign={() =>
                    update(item.id, { assignedToId: user.id })
                  }
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
