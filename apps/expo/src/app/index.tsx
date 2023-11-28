import React from 'react';
import { Button, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

import { api } from '~/utils/api';
import type { RouterOutputs } from '~/utils/api';
import { useAuth } from '@clerk/clerk-expo';


// const AlertsList = () => {
//   const alerts = api.alert.all.useQuery({
//     sorts: allSorts,
//     filters: allFilters,
//   });
//   const updateAlert = api.alert.update.useMutation();
//   const users = api.user.all.useQuery();
//   const currentUser = useAuth();

//   return (
//     <div className="flex flex-col">
//       <div className="pt-4">
//         {/* Alerts List */}
//         <div className="h-screen overflow-y-auto">
//           <div
//             className={classNames({
//               'px-10': display.style === 'expanded',
//               'mt-4': !configsAreApplied,
//               'border-t-[1px]':
//                 !configsAreApplied && display.style === 'condensed',
//             })}
//           >
//             {alerts.isFetching ? (
//               <Spinner className="mt-5 px-10" />
//             ) : (
//               alerts.data?.map((a: RouterOutputs['alert']['all']['0']) => {
//                 const user = users.data?.find((u) => u.id === a.assignedToId) ?? {
//                   firstName: '',
//                   lastName: '',
//                 };
//                 const update = async (
//                   alert: Partial<RouterOutputs['alert']['all']['0']>,
//                 ) => {
//                   await updateAlert.mutateAsync({ id: a.id, alert });
//                   await alerts.refetch();
//                 };

//                 return (
//                   <AlertsListItem
//                     key={a.id}
//                     style={display.style}
//                     createdAt={a.createdAt}
//                     title={a.title}
//                     status={a.status}
//                     firstName={user.firstName}
//                     lastName={user.lastName}
//                     onAck={() => update({ status: 'ACKED' })}
//                     onClose={() => update({ status: 'CLOSED' })}
//                     onSelfAssign={() => update({ assignedToId: currentUser.userId })}
//                     onReopen={() => update({ status: 'OPEN' })}
//                   />
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const Index = () => {
  const alerts = [
    {
      name: 'hi',
      id: 2
    },
    {
      name: 'hello',
      id: 3
    },
    {
      name: 'hey',
      id: 4
    },
    {
      name: 'howdy',
      id: 5
    }
  ]

  const currentUser = useAuth();

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Alerts' }} />
      <FlatList
        data={alerts}
        renderItem={({ item }) => <View><Text>{item.name}</Text></View>}
        keyExtractor={item => `${item.id}`}
      />
      <Text>{currentUser.isSignedIn}</Text>
      <Text>{currentUser.userId}</Text>
    </SafeAreaView>
  )

};

export default Index;
