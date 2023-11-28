import React from 'react';
import { ActivityIndicator, Button, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

import { api } from '~/utils/api';
import type { RouterOutputs } from '~/utils/api';
import { useAuth } from '@clerk/clerk-expo';
import AlertListItem from './_components/AlertListItem';

const AlertsList = ({ alerts }) => {
  return (
    <FlatList
      data={alerts}
      renderItem={({ item }) => <AlertListItem alert={item} />}
      keyExtractor={item => `${item.id}`}
    />
  )
}

const AlertListPage = () => {
  const alerts = api.alert.all.useQuery({});

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Alerts' }} />
      <View className='flex flex-col'>
        {alerts.isFetching ? <ActivityIndicator /> : <AlertsList alerts={alerts.data} />}
      </View>
    </SafeAreaView>
  )

};

export default AlertListPage;
