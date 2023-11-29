import { Text, View } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';


const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const StatusToColor = {
  ACKED: 'text-blue-800 bg-blue-200',
  OPEN: 'text-red-800 bg-red-200',
  CLOSED: 'text-green-800 bg-green-200',
};

const AlertListItem = ({ alert, user }) => {
  const { status, title, createdAt } = alert;
  const { firstName, lastName } = user;

  return (
    <View className='mb-4 px-4 py-2'>
      <View
        className={'flex-row justify-between'}
      >
        <View className={'flex-row items-center'}>
          <View className={`rounded bg-opacity-80 py-0.5 mr-4 w-[65px] ${StatusToColor[status]}`}>
            <Text className={`text-center text-sm font-medium ${StatusToColor[status]}`}>
              {capitalize(status)}
            </Text>
          </View>
        </View>

        <View>
          <Text className={'mr-2 mb-1.5 text-lg font-medium'}>{title}</Text>
          <Text className={'text-gray-500 text-sm w-[350px]'}>
            Occaeacat sint aute nulla proident nulla proident nulla proident nulla
            proident....
          </Text>
        </View>

      </View>
      <View className={'flex-row items-center absolute top-3 right-0 '}>
        <Text className={'mr-4 text-sm'}>{format(createdAt, 'dd/MM p')}</Text>
      </View>

      <View className={'flex-row items-center absolute bottom-0 right-2 '}>
        <Text className={'mr-2 font-bold text-gray-600 text-sm'}>
          {(firstName?.slice(0, 1) ?? '') + (lastName?.slice(0, 1) ?? '')}
        </Text>
        <Ionicons name="md-hand-right-outline" size={24} color="black" />
      </View>
    </View>
  );
};

export default AlertListItem;
