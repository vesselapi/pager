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
        <View className='w-full flex-row items-center p-4'>
          <TextInput
            className='bg-white h-[40px] w-full px-4 rounded-md shadow'
            // NOTE(@zkirby): No idea why the tailwind shadow property doesn't work.
            // I'm fairly confident I'm not using the property correctly, but the 
            // style property is much easier to fine tune.
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
        <Text className='ml-1 px-4 mt-4 mb-1 font-bold text-slate-600 text-sm opacity-70'>ALERTS</Text>
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
