import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { capitalize } from 'radash'

const StatusToColor = {
  ACKED: 'text-blue-800 bg-blue-200',
  OPEN: 'text-red-800 bg-red-200',
  CLOSED: 'text-green-800 bg-green-200',
};

const AlertListItem = ({ alert, user }) => {
  const { status, title, createdAt } = alert;
  const { firstName, lastName } = user;

  return (
    <View className="mb-4 px-4 py-2">
      <View className={'flex-row justify-between'}>
        <View className={'flex-row items-center'}>
          <View
            className={`mr-4 w-[65px] rounded bg-opacity-80 py-0.5 ${StatusToColor[status]}`}
          >
            <Text
              className={`text-center text-sm font-medium ${StatusToColor[status]}`}
            >
              {capitalize(status)}
            </Text>
          </View>
        </View>

        <View>
          <Text className={'mb-1.5 mr-2 text-lg font-medium'}>{title}</Text>
          <Text className={'w-[350px] text-sm text-gray-500'}>
            Occaeacat sint aute nulla proident nulla proident nulla proident
            nulla proident....
          </Text>
        </View>
      </View>
      <View className={'absolute right-0 top-3 flex-row items-center '}>
        <Text className={'mr-4 text-sm'}>{format(createdAt, 'dd/MM p')}</Text>
      </View>

      <View className={'absolute bottom-0 right-2 flex-row items-center '}>
        <Text className={'mr-2 text-sm font-bold text-gray-600'}>
          {(firstName?.slice(0, 1) ?? '') + (lastName?.slice(0, 1) ?? '')}
        </Text>
        <Ionicons name="md-hand-right-outline" size={24} color="black" />
      </View>
    </View>
  );
};

export default AlertListItem;
